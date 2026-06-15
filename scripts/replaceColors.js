const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', 'src')
const exts = ['.js', '.jsx', '.ts', '.tsx']

const mapping = {
  '#1E3A5F': 'var(--color-primary, #1E3A5F)',
  '#0F2140': 'var(--color-primary-dark, #0F2140)',
  '#D4AF37': 'var(--color-accent, #D4AF37)',
  '#E8C84A': 'var(--color-accent-light, #E8C84A)',
  '#64748B': 'var(--color-muted, #64748B)',
  '#E2E8F0': 'var(--color-border, #E2E8F0)',
  '#F1F5F9': 'var(--color-bg-muted-2, #F1F5F9)',
  '#EFF6FF': 'var(--color-bg-muted, #EFF6FF)',
  '#EF4444': 'var(--color-error, #EF4444)',
  '#22C55E': 'var(--color-success, #22C55E)',
  'rgba(255,255,255,0.6)': 'rgba(var(--color-surface-rgb, 255,255,255), 0.6)',
  'rgba(255,255,255,0.88)': 'rgba(var(--color-surface-rgb, 255,255,255), 0.88)'
}

function walk(dir){
  const files = fs.readdirSync(dir)
  for(const f of files){
    const full = path.join(dir,f)
    const stat = fs.statSync(full)
    if(stat.isDirectory()) walk(full)
    else if(exts.includes(path.extname(full))){
      processFile(full)
    }
  }
}

function processFile(file){
  let s = fs.readFileSync(file,'utf8')
  const orig = s
  const lines = s.split(/\r?\n/)
  for(let i=0;i<lines.length;i++){
    let line = lines[i]
    // skip lines that already use var(...)
    if(line.includes('var(') || line.includes('var(--')) continue
    for(const [k,v] of Object.entries(mapping)){
      if(line.includes(k)){
        line = line.split(k).join(v)
      }
    }
    lines[i]=line
  }
  s = lines.join('\n')
  if(s !== orig){
    fs.writeFileSync(file, s, 'utf8')
    console.log('Patched', file)
  }
}

console.log('Scanning', root)
walk(root)
console.log('Done')
