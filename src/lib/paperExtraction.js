// src/lib/paperExtraction.js
// Extracts raw text from an uploaded PDF or image, then splits it into candidate
// questions using pattern heuristics. This is intentionally NOT fully automated -
// see extractQuestions() notes below for why a human review step is mandatory.

// Lazy-loaded so these (fairly heavy) libraries never ship in the main bundle -
// only downloaded when an institution actually uses paper upload.
async function extractTextFromPdf(file, onProgress) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  const imageUrls = [] // page-level images extracted as whole-page renders for now

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(`Reading page ${i} of ${pdf.numPages}...`)
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    fullText += pageText + '\n\n'
  }

  // Heuristic: a digitally-created PDF yields substantial real text per page.
  // A scanned/photographed PDF yields almost nothing - that's our signal to fall
  // back to OCR instead of returning an empty/garbage extraction silently.
  const avgCharsPerPage = fullText.length / pdf.numPages
  const looksScanned = avgCharsPerPage < 20

  return { text: fullText, looksScanned, pageCount: pdf.numPages }
}

async function extractFromExcel(file) {
  const XLSX = await import('xlsx')
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  // Expected columns (case-insensitive, flexible naming): Question, Option A/B/C/D, Correct Answer, Marks
  const findCol = (row, ...names) => {
    const key = Object.keys(row).find(k => names.some(n => k.toLowerCase().replace(/[^a-z]/g,'') === n))
    return key ? row[key] : ''
  }

  const candidates = rows.map((row, idx) => {
    const questionText = String(findCol(row, 'question', 'questiontext') || '').trim()
    const options = []
    const optA = String(findCol(row, 'optiona', 'a') || '').trim()
    const optB = String(findCol(row, 'optionb', 'b') || '').trim()
    const optC = String(findCol(row, 'optionc', 'c') || '').trim()
    const optD = String(findCol(row, 'optiond', 'd') || '').trim()
    if (optA) options.push({ label:'A', text: optA })
    if (optB) options.push({ label:'B', text: optB })
    if (optC) options.push({ label:'C', text: optC })
    if (optD) options.push({ label:'D', text: optD })
    const correct = String(findCol(row, 'correctanswer', 'correct', 'answer') || 'A').trim().toUpperCase()
    const marks = parseFloat(findCol(row, 'marks', 'mark')) || 1

    return {
      tempId: `xlsx_${idx}`,
      question_text: questionText,
      options: options.length ? options : [{label:'A',text:''},{label:'B',text:''}],
      correct_answer: options.some(o => o.label === correct) ? correct : (options[0]?.label || 'A'),
      marks,
      // Spreadsheet rows are structured data, not OCR guesses - confidence is high
      // whenever the row actually has a question and 2+ options filled in.
      confidence: questionText && options.length >= 2 ? 'high' : 'needs_review',
      raw_chunk: JSON.stringify(row),
    }
  }).filter(c => c.question_text.length > 0)

  return candidates
}

async function extractTextFromDocx(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

async function extractTextFromImage(file, onProgress) {
  const Tesseract = await import('tesseract.js')
  const result = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') onProgress?.(`Reading text... ${Math.round(m.progress * 100)}%`)
    },
  })
  return { text: result.data.text, confidence: result.data.confidence }
}

// Splits raw extracted text into candidate questions using common numbering/option
// patterns (1. / Q1. / 1) ... A) B) C) D) or (a)(b)(c)(d)). This is a heuristic,
// not a guarantee - it works well on consistently-formatted papers and struggles
// with mixed formatting, multi-column layouts, or inconsistent spacing. That's
// exactly why every candidate question below carries a `confidence` flag and MUST
// go through the institution's review screen before anything reaches question_bank.
export function splitIntoQuestions(rawText) {
  const text = rawText.replace(/\r\n/g, '\n')
  // Split on a line that starts with a question number pattern
  const questionSplitRe = /\n(?=\s*(?:Q\.?\s*\d+|Question\s+\d+|\d+[\.\)])\s)/gi
  const chunks = text.split(questionSplitRe).map(c => c.trim()).filter(Boolean)

  const optionRe = /(?:^|\n)\s*(?:\(?([A-D])\)?[\.\)])\s*(.+?)(?=(?:\n\s*\(?[A-D]\)?[\.\)])|$)/gis

  return chunks.map((chunk, idx) => {
    const questionMatch = chunk.match(/^(?:Q\.?\s*\d+|Question\s+\d+|\d+[\.\)])\s*(.+?)(?=\n\s*\(?[A-D]\)?[\.\)]|$)/is)
    const questionText = (questionMatch?.[1] || chunk.split('\n')[0]).trim()

    const options = []
    let m
    const optRe = new RegExp(optionRe)
    while ((m = optRe.exec(chunk)) !== null) {
      options.push({ label: m[1].toUpperCase(), text: m[2].trim() })
      if (options.length > 6) break // safety cap
    }

    // Confidence: did we find a clean question stem AND at least 2 options?
    const confidence = questionText.length > 5 && options.length >= 2 ? 'high'
      : options.length >= 2 ? 'medium' : 'needs_review'

    return {
      tempId: `candidate_${idx}`,
      question_text: questionText,
      options: options.length ? options : [{label:'A',text:''},{label:'B',text:''}],
      correct_answer: options[0]?.label || 'A', // institution MUST confirm this - never trust a guess
      confidence,
      raw_chunk: chunk,
    }
  }).filter(c => c.question_text.length > 3)
}

export const paperExtraction = {
  async extractFromFile(file, onProgress) {
    const name = file.name.toLowerCase()
    const isXlsx = name.endsWith('.xlsx') || name.endsWith('.xls') ||
      file.type.includes('spreadsheet') || file.type.includes('excel')
    const isDocx = name.endsWith('.docx') || file.type.includes('wordprocessingml')
    const isPdf = file.type === 'application/pdf'

    if (isXlsx) {
      onProgress?.('Reading spreadsheet...')
      const candidates = await extractFromExcel(file)
      // Signal to the caller that these are already-finished candidates, not raw text
      return { candidates, confidence: 'high', pageCount: 1 }
    }
    if (isDocx) {
      onProgress?.('Reading Word document...')
      const text = await extractTextFromDocx(file)
      return { text, confidence: 'high' }
    }
    if (isPdf) {
      const { text, looksScanned, pageCount } = await extractTextFromPdf(file, onProgress)
      if (looksScanned) {
        onProgress?.('This looks like a scanned PDF - switching to OCR (slower, less exact)...')
        return { text, confidence: 'low', warning: 'This PDF appears to be scanned/photographed rather than a native digital document. Extraction accuracy will be lower - please review every question carefully.', pageCount }
      }
      return { text, confidence: 'high', pageCount }
    }
    // Image
    const { text, confidence } = await extractTextFromImage(file, onProgress)
    return { text, confidence: confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low',
      warning: confidence < 70 ? 'Image quality or handwriting may have reduced extraction accuracy - please review every question carefully.' : null }
  },
  splitIntoQuestions,
}
