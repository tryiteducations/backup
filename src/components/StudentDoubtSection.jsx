// FILE: src/components/StudentDoubtSection.jsx
// Enhanced doubt section with voice note, PDF, image, and video uploads
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const MAX_IMAGES = 7
const MAX_FILE_SIZE_MB = 50

const UPLOAD_TYPES = [
  { id: 'voiceNote', label: '🎤 Voice Note', accept: 'audio/*', icon: '🎙️', desc: 'Record or upload audio' },
  { id: 'pdf', label: '📄 PDF', accept: '.pdf', icon: '📑', desc: 'Upload PDF documents' },
  { id: 'images', label: '🖼️ Images', accept: 'image/*', icon: '📸', desc: `Up to ${MAX_IMAGES} images`, multiple: true },
  { id: 'video', label: '🎬 Video', accept: 'video/*', icon: '📹', desc: 'Upload video (max 50MB)' },
]

export default function StudentDoubtSection({ onUploadComplete }) {
  const navigate = useNavigate()
  const [uploads, setUploads] = useState({
    voiceNote: null,
    pdf: null,
    images: [],
    video: null,
  })
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewType, setPreviewType] = useState(null)
  const fileInputRefs = useRef({})

  const handleFileSelect = (type, e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const newUploads = { ...uploads }

    files.forEach((file) => {
      // Size check
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        return
      }

      switch (type) {
        case 'voiceNote':
          if (!file.type.startsWith('audio/')) {
            alert('Please upload an audio file')
            return
          }
          newUploads.voiceNote = file
          break
        case 'pdf':
          if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file')
            return
          }
          newUploads.pdf = file
          break
        case 'images':
          if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
          }
          if (newUploads.images.length >= MAX_IMAGES) {
            alert(`Maximum ${MAX_IMAGES} images allowed`)
            return
          }
          newUploads.images = [...newUploads.images, file]
          break
        case 'video':
          if (!file.type.startsWith('video/')) {
            alert('Please upload a video file')
            return
          }
          newUploads.video = file
          break
        default:
          break
      }
    })

    setUploads(newUploads)
    // Reset file input
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type].value = ''
    }
  }

  const removeFile = (type, index) => {
    const newUploads = { ...uploads }
    if (type === 'images') {
      newUploads.images = newUploads.images.filter((_, i) => i !== index)
    } else {
      newUploads[type] = null
    }
    setUploads(newUploads)
    setPreviewUrl(null)
    setPreviewType(null)
  }

  const showPreview = (type, file) => {
    if (type === 'images' || type === 'video') {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setPreviewType(type)
    }
  }

  const handleSubmit = () => {
    if (!question.trim() && !subject.trim()) {
      alert('Please enter your question or select a subject')
      return
    }
    const hasUploads = uploads.voiceNote || uploads.pdf || uploads.images.length > 0 || uploads.video
    if (!hasUploads) {
      alert('Please attach at least one file (voice note, PDF, image, or video)')
      return
    }

    // Store upload data in sessionStorage for the doubt posting page
    const uploadData = {
      question,
      subject,
      uploads: {
        voiceNote: uploads.voiceNote ? { name: uploads.voiceNote.name, size: uploads.voiceNote.size, type: uploads.voiceNote.type } : null,
        pdf: uploads.pdf ? { name: uploads.pdf.name, size: uploads.pdf.size, type: uploads.pdf.type } : null,
        images: uploads.images.map(f => ({ name: f.name, size: f.size, type: f.type })),
        video: uploads.video ? { name: uploads.video.name, size: uploads.video.size, type: uploads.video.type } : null,
      },
    }
    sessionStorage.setItem('pending_doubt_uploads', JSON.stringify(uploadData))

    if (onUploadComplete) {
      onUploadComplete(uploadData)
    } else {
      navigate('/guru-hub/post-doubt')
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const hasAnyUpload = uploads.voiceNote || uploads.pdf || uploads.images.length > 0 || uploads.video

  return (
    <div style={{
      background: 'var(--color-surface, #FFFFFF)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: '1px solid var(--color-border, #E2E8F0)',
    }}>
      <h3 style={{
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--color-text, #1E293B)',
        marginBottom: 8,
        fontFamily: 'Poppins,sans-serif',
      }}>
        🤔 Ask a Doubt to Your Mentor
      </h3>
      <p style={{
        fontSize: 13,
        color: 'var(--color-text-secondary, #64748B)',
        marginBottom: 20,
        fontFamily: 'Poppins,sans-serif',
      }}>
        Attach voice notes, PDFs, images, or videos to help your mentor understand better
      </p>

      {/* Question Input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Describe your doubt in detail..."
        rows={3}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 10,
          border: '1px solid var(--color-border, #E2E8F0)',
          background: 'var(--color-background, #F8FAFC)',
          color: 'var(--color-text, #1E293B)',
          fontSize: 14,
          fontFamily: 'Poppins,sans-serif',
          resize: 'vertical',
          marginBottom: 12,
          outline: 'none',
        }}
      />

      {/* Subject Input */}
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject / Topic (e.g., Calculus, Indian Polity)"
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 10,
          border: '1px solid var(--color-border, #E2E8F0)',
          background: 'var(--color-background, #F8FAFC)',
          color: 'var(--color-text, #1E293B)',
          fontSize: 14,
          fontFamily: 'Poppins,sans-serif',
          marginBottom: 20,
          outline: 'none',
        }}
      />

      {/* Upload Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20,
      }}>
        {UPLOAD_TYPES.map((type) => (
          <div
            key={type.id}
            onClick={() => fileInputRefs.current[type.id]?.click()}
            style={{
              border: '2px dashed var(--color-border, #CBD5E1)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'var(--color-background, #F8FAFC)',
              minHeight: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent, #C9A84C)'
              e.currentTarget.style.background = 'var(--color-accent-light, rgba(201,168,76,0.05))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border, #CBD5E1)'
              e.currentTarget.style.background = 'var(--color-background, #F8FAFC)'
            }}
          >
            <span style={{ fontSize: 28 }}>{type.icon}</span>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text, #1E293B)',
              fontFamily: 'Poppins,sans-serif',
            }}>
              {type.label}
            </span>
            <span style={{
              fontSize: 11,
              color: 'var(--color-text-secondary, #94A3B8)',
              fontFamily: 'Poppins,sans-serif',
            }}>
              {type.desc}
            </span>
            <input
              ref={(el) => (fileInputRefs.current[type.id] = el)}
              type="file"
              accept={type.accept}
              multiple={type.multiple || false}
              onChange={(e) => handleFileSelect(type.id, e)}
              style={{ display: 'none' }}
            />
          </div>
        ))}
      </div>

      {/* Uploaded Files Preview */}
      {hasAnyUpload && (
        <div style={{
          background: 'var(--color-background, #F8FAFC)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: '1px solid var(--color-border, #E2E8F0)',
        }}>
          <h4 style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text, #1E293B)',
            marginBottom: 10,
            fontFamily: 'Poppins,sans-serif',
          }}>
            📎 Attached Files
          </h4>

          {/* Voice Note */}
          {uploads.voiceNote && (
            <FileChip
              icon="🎙️"
              name={uploads.voiceNote.name}
              size={formatSize(uploads.voiceNote.size)}
              onRemove={() => removeFile('voiceNote')}
              onPreview={() => showPreview('voiceNote', uploads.voiceNote)}
            />
          )}

          {/* PDF */}
          {uploads.pdf && (
            <FileChip
              icon="📑"
              name={uploads.pdf.name}
              size={formatSize(uploads.pdf.size)}
              onRemove={() => removeFile('pdf')}
              onPreview={() => showPreview('pdf', uploads.pdf)}
            />
          )}

          {/* Images */}
          {uploads.images.map((img, idx) => (
            <FileChip
              key={idx}
              icon="🖼️"
              name={img.name}
              size={formatSize(img.size)}
              onRemove={() => removeFile('images', idx)}
              onPreview={() => showPreview('images', img)}
            />
          ))}

          {/* Video */}
          {uploads.video && (
            <FileChip
              icon="🎬"
              name={uploads.video.name}
              size={formatSize(uploads.video.size)}
              onRemove={() => removeFile('video')}
              onPreview={() => showPreview('video', uploads.video)}
            />
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div
          onClick={() => { setPreviewUrl(null); setPreviewType(null) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              borderRadius: 16,
              padding: 20,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={() => { setPreviewUrl(null); setPreviewType(null) }}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.5)', color: '#FFF',
                border: 'none', borderRadius: '50%', width: 32, height: 32,
                cursor: 'pointer', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
            {previewType === 'images' && (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
            )}
            {previewType === 'video' && (
              <video src={previewUrl} controls style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} />
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: 12,
          border: 'none',
          background: hasAnyUpload
            ? 'linear-gradient(135deg, var(--color-accent, #C9A84C), var(--color-accent-dark, #B8942E))'
            : 'var(--color-border, #CBD5E1)',
          color: hasAnyUpload ? 'var(--color-primary, #1E3A5F)' : 'var(--color-text-secondary, #94A3B8)',
          fontSize: 15,
          fontWeight: 700,
          cursor: hasAnyUpload ? 'pointer' : 'not-allowed',
          fontFamily: 'Poppins,sans-serif',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        📤 Submit Doubt to Mentor
      </button>
    </div>
  )
}

// Reusable file chip component
function FileChip({ icon, name, size, onRemove, onPreview }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      background: 'var(--color-surface, #FFFFFF)',
      borderRadius: 8,
      marginBottom: 6,
      border: '1px solid var(--color-border, #E2E8F0)',
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text, #1E293B)',
          margin: 0,
          fontFamily: 'Poppins,sans-serif',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </p>
        <p style={{
          fontSize: 11,
          color: 'var(--color-text-secondary, #94A3B8)',
          margin: 0,
          fontFamily: 'Poppins,sans-serif',
        }}>
          {size}
        </p>
      </div>
      {onPreview && (
        <button
          onClick={onPreview}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, padding: 4, color: 'var(--color-accent, #C9A84C)',
          }}
          title="Preview"
        >
          👁️
        </button>
      )}
      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 16, padding: 4, color: '#EF4444',
        }}
        title="Remove"
      >
        🗑️
      </button>
    </div>
  )
}