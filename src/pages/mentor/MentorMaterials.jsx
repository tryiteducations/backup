// src/pages/mentor/MentorMaterials.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MATERIALS = [
  {id:1,title:'UPSC Polity Master Notes 2026',type:'pdf',price:0,isFree:true,
   exam:'UPSC',subject:'Polity',downloads:234,rating:4.8,revenue:0,
   desc:'Complete Polity notes covering Constitution, Amendments, Bodies. 120 pages.'},
  {id:2,title:'SSC CGL Maths Shortcut Bible',type:'pdf',price:149,isFree:false,
   exam:'SSC CGL',subject:'Maths',downloads:89,rating:4.9,revenue:13261,
   desc:'60 shortcut techniques for Time-Work, Percentages, Profit-Loss. Exam-ready.'},
  {id:3,title:'TNPSC Tamil History Audio Series',type:'audio',price:0,isFree:true,
   exam:'TNPSC',subject:'History',downloads:156,rating:4.7,revenue:0,
   desc:'5 audio episodes covering Ancient Tamil kingdoms, Sangam age, Chola empire.'},
]

const BOOKS = [
  {id:4,title:'Zero to UPSC - The 12-Month Blueprint',type:'book',price:299,
   exam:'UPSC',pages:280,sold:42,rating:4.9,revenue:10626,
   desc:'Step-by-step 12-month UPSC preparation strategy with daily schedules, topic weightage and model answers.'},
  {id:5,title:'SSC CGL Complete Crash Course',type:'book',price:199,
   exam:'SSC CGL',pages:160,sold:31,rating:4.8,revenue:4907,
   desc:'All 4 tiers covered. Previous year analysis, topic-wise questions, full mock tests.'},
]

const SHARE_PLATFORMS = [
  {name:'WhatsApp', icon:'💬', color:'#25D366'},
  {name:'Twitter',  icon:'🐦', color:'#1DA1F2'},
  {name:'Telegram', icon:'✈️', color:'#0088CC'},
  {name:'Copy Link',icon:'🔗', color:'var(--color-text-light,#64748B)'},
]

export default function MentorMaterials() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [tab, setTab] = useState('materials')
  const [shareItem, setShareItem] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title:'', type:'pdf', price:'0', isFree:true, exam:'', subject:'', desc:''
  })

  const totalRevenue = [...MATERIALS,...BOOKS].reduce((s,x)=>s+x.revenue,0)
  const totalDownloads = MATERIALS.reduce((s,x)=>s+x.downloads,0)
  const totalSold = BOOKS.reduce((s,x)=>s+x.sold,0)

  const ShareModal = ({item}) => (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:999,
      display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
      onClick={()=>setShareItem(null)}>
      <div style={{background:c,borderRadius:20,padding:24,width:'100%',maxWidth:360,
        boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}
        onClick={e=>e.stopPropagation()}>
        <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 4px'}}>
          Share Material
        </p>
        <p style={{color:m,fontSize:12,margin:'0 0 16px'}}>{item.title}</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
          {SHARE_PLATFORMS.map((pl,i)=>(
            <button key={i}
              style={{background:pl.color+'15',border:'1.5px solid '+pl.color+'30',
                borderRadius:14,padding:'12px',display:'flex',alignItems:'center',
                gap:8,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}
              onClick={()=>{
                if(pl.name==='Copy Link'){
                  navigator.clipboard.writeText('https://tryiteducations.net/material/'+item.id)
                }
                setShareItem(null)
              }}>
              <span style={{fontSize:20}}>{pl.icon}</span>
              <span style={{color:t,fontWeight:600,fontSize:12}}>{pl.name}</span>
            </button>
          ))}
        </div>
        <div style={{background:bg,borderRadius:10,padding:'10px 14px',
          border:'1px solid '+b,marginBottom:12}}>
          <p style={{color:m,fontSize:10,margin:'0 0 4px'}}>Share link:</p>
          <p style={{color:t,fontSize:11,fontWeight:600,margin:0,wordBreak:'break-all'}}>
            https://tryiteducations.net/material/{item.id}
          </p>
        </div>
        <button onClick={()=>setShareItem(null)}
          style={{width:'100%',background:'transparent',border:'1px solid '+b,
            borderRadius:12,padding:'10px',color:m,fontWeight:600,
            fontSize:13,cursor:'pointer'}}>
          Close
        </button>
      </div>
    </div>
  )

  const MaterialCard = ({item}) => (
    <div style={{background:c,border:'1px solid '+b,borderRadius:18,
      padding:'18px',marginBottom:12,
      boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:48,height:60,borderRadius:10,flexShrink:0,
          background:'linear-gradient(135deg,'+p+','+a+')',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>
          {item.type==='pdf'?'📄':item.type==='audio'?'🎙️':item.type==='video'?'🎬':'📗'}
        </div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{item.title}</p>
            {item.isFree
              ? <span style={{background:'#22C55E15',color:'#22C55E',fontSize:9,
                  fontWeight:700,padding:'2px 8px',borderRadius:20}}>FREE</span>
              : <span style={{color:a,fontWeight:800,fontSize:14}}>₹{item.price}</span>
            }
          </div>
          <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{item.desc}</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
            <span style={{background:p+'10',color:p,fontSize:9,fontWeight:700,
              padding:'2px 8px',borderRadius:20}}>{item.exam}</span>
            <span style={{background:a+'15',color:a,fontSize:9,fontWeight:700,
              padding:'2px 8px',borderRadius:20}}>{item.subject}</span>
            <span style={{color:m,fontSize:10}}>
              ★ {item.rating} · {item.downloads} downloads
            </span>
            {item.revenue > 0 && (
              <span style={{color:'#22C55E',fontWeight:700,fontSize:10}}>
                ₹{item.revenue.toLocaleString('en-IN')} earned
              </span>
            )}
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setShareItem(item)}
              style={{background:a+'15',border:'1px solid '+a+'30',borderRadius:10,
                padding:'6px 14px',color:a,fontWeight:700,fontSize:12,cursor:'pointer',
                display:'flex',alignItems:'center',gap:4}}>
              📤 Share
            </button>
            <button style={{background:'transparent',border:'1px solid '+b,
              borderRadius:10,padding:'6px 14px',color:m,fontWeight:600,
              fontSize:12,cursor:'pointer'}}>
              Edit
            </button>
            <button style={{background:'transparent',border:'1px solid #EF444430',
              borderRadius:10,padding:'6px 14px',color:'#EF4444',fontWeight:600,
              fontSize:12,cursor:'pointer'}}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const BookCard = ({item}) => (
    <div style={{background:c,border:'1px solid '+b,borderRadius:18,
      padding:'18px',marginBottom:12,
      boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',gap:14}}>
        <div style={{width:56,height:72,borderRadius:8,flexShrink:0,
          background:'linear-gradient(160deg,'+p+','+a+')',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:24,boxShadow:'2px 4px 12px rgba(0,0,0,0.2)'}}>
          📗
        </div>
        <div style={{flex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <p style={{color:t,fontWeight:700,fontSize:14,margin:0}}>{item.title}</p>
            <p style={{color:a,fontWeight:900,fontSize:16,margin:0}}>₹{item.price}</p>
          </div>
          <p style={{color:m,fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{item.desc}</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:10}}>
            <span style={{background:p+'10',color:p,fontSize:9,fontWeight:700,
              padding:'2px 8px',borderRadius:20}}>{item.exam}</span>
            <span style={{color:m,fontSize:10}}>📄 {item.pages} pages</span>
            <span style={{color:m,fontSize:10}}>★ {item.rating}</span>
            <span style={{color:'#22C55E',fontSize:10,fontWeight:700}}>
              {item.sold} sold
            </span>
          </div>
          <div style={{background:'#22C55E08',border:'1px solid #22C55E20',
            borderRadius:10,padding:'8px 12px',marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <span style={{color:m,fontSize:11}}>Total Revenue</span>
              <span style={{color:'#22C55E',fontWeight:700,fontSize:13}}>
                ₹{item.revenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{color:m,fontSize:10}}>Your share (85%)</span>
              <span style={{color:t,fontWeight:600,fontSize:12}}>
                ₹{Math.round(item.revenue*0.85).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setShareItem(item)}
              style={{background:a+'15',border:'1px solid '+a+'30',borderRadius:10,
                padding:'6px 14px',color:a,fontWeight:700,fontSize:12,cursor:'pointer'}}>
              📤 Share & Sell
            </button>
            <button style={{background:'transparent',border:'1px solid '+b,
              borderRadius:10,padding:'6px 14px',color:m,fontWeight:600,
              fontSize:12,cursor:'pointer'}}>
              Edit Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      {shareItem && <ShareModal item={shareItem}/>}

      {/* Header */}
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/mentor-hub')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>
            📁 Materials & Books
          </h1>
          <p style={{color:m,fontSize:11,margin:0}}>
            Upload · Sell · Share · Track revenue
          </p>
        </div>
        <button onClick={()=>setShowUpload(!showUpload)}
          style={{background:'linear-gradient(135deg,'+p+','+a+')',border:'none',
            borderRadius:12,padding:'9px 18px',color:'#fff',
            fontWeight:700,fontSize:13,cursor:'pointer'}}>
          + Upload
        </button>
      </div>

      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>

        {/* Revenue summary */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:10,marginBottom:20}}>
          {[
            {l:'Total Revenue',     v:'₹'+totalRevenue.toLocaleString('en-IN'), e:'💰', c:'#22C55E'},
            {l:'Your Share (85%)',  v:'₹'+Math.round(totalRevenue*0.85).toLocaleString('en-IN'), e:'🏆', c:a},
            {l:'Free Downloads',   v:totalDownloads, e:'📥', c:'#3B82F6'},
            {l:'Books Sold',       v:totalSold, e:'📗', c:'#8B5CF6'},
          ].map((s,i)=>(
            <div key={i} style={{background:c,border:'1px solid '+b,borderRadius:14,
              padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:20,marginBottom:4}}>{s.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{s.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* IP notice */}
        <div style={{background:p+'08',border:'1px solid '+p+'20',
          borderRadius:12,padding:'12px 16px',marginBottom:16}}>
          <p style={{color:p,fontWeight:700,fontSize:11,margin:'0 0 2px'}}>
            📋 IP Rights Notice
          </p>
          <p style={{color:m,fontSize:11,margin:0,lineHeight:1.6}}>
            All materials uploaded to TryIT are assigned to TryIT Educations permanently.
            They may be used in tests, quizzes, and course content even after you leave
            the platform. Materials will never be sold to third parties.
          </p>
        </div>

        {/* Upload form */}
        {showUpload && (
          <div style={{background:c,border:'1.5px solid '+a,borderRadius:18,
            padding:'20px',marginBottom:20}}>
            <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 14px'}}>
              New Upload
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:11,marginBottom:6}}>
                  Title *
                </label>
                <input value={uploadForm.title}
                  onChange={e=>setUploadForm({...uploadForm,title:e.target.value})}
                  placeholder="e.g. UPSC Polity Notes 2026"
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:11,marginBottom:6}}>
                  Type
                </label>
                <select value={uploadForm.type}
                  onChange={e=>setUploadForm({...uploadForm,type:e.target.value})}
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',cursor:'pointer'}}>
                  {['pdf','audio','video','book'].map(t=>(
                    <option key={t} value={t}>
                      {t==='pdf'?'📄 PDF Notes':t==='audio'?'🎙️ Audio':
                       t==='video'?'🎬 Video':'📗 Book / Course'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:11,marginBottom:6}}>
                  Exam
                </label>
                <input value={uploadForm.exam}
                  onChange={e=>setUploadForm({...uploadForm,exam:e.target.value})}
                  placeholder="e.g. UPSC, SSC CGL, TNPSC"
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:11,marginBottom:6}}>
                  Price (₹) - 0 for free
                </label>
                <input value={uploadForm.price} type="number" min="0"
                  onChange={e=>setUploadForm({...uploadForm,
                    price:e.target.value,
                    isFree:parseInt(e.target.value)===0})}
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+b,background:bg,color:t,
                    fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:11,marginBottom:6}}>
                Description
              </label>
              <textarea value={uploadForm.desc}
                onChange={e=>setUploadForm({...uploadForm,desc:e.target.value})}
                placeholder="Describe what this material covers, who it's for, and what students will gain..."
                rows={3}
                style={{width:'100%',padding:'10px 12px',borderRadius:10,
                  border:'1.5px solid '+b,background:bg,color:t,
                  fontSize:13,outline:'none',resize:'vertical',
                  fontFamily:'Poppins,sans-serif',boxSizing:'border-box'}}/>
            </div>
            <div style={{border:'2px dashed '+b,borderRadius:12,padding:'20px',
              textAlign:'center',cursor:'pointer',marginBottom:12,background:bg}}>
              <div style={{fontSize:28,marginBottom:6}}>📁</div>
              <p style={{color:t,fontWeight:600,fontSize:13,margin:'0 0 4px'}}>
                Click to select file
              </p>
              <p style={{color:m,fontSize:11,margin:0}}>
                PDF · MP3 · MP4 · Max 200MB
              </p>
            </div>
            {parseInt(uploadForm.price) > 0 && (
              <div style={{background:'#22C55E08',border:'1px solid #22C55E20',
                borderRadius:10,padding:'10px 14px',marginBottom:12}}>
                <p style={{color:'#22C55E',fontWeight:700,fontSize:11,margin:'0 0 2px'}}>
                  Revenue Preview
                </p>
                <p style={{color:m,fontSize:11,margin:0}}>
                  Student pays ₹{uploadForm.price} →
                  TryIT takes 15% (₹{Math.round(parseInt(uploadForm.price||0)*0.15)}) →
                  You earn ₹{Math.round(parseInt(uploadForm.price||0)*0.85)} per sale
                </p>
              </div>
            )}
            <div style={{display:'flex',gap:8}}>
              <button style={{flex:1,background:'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:12,padding:'12px',color:'#fff',
                fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Upload & Publish
              </button>
              <button onClick={()=>setShowUpload(false)}
                style={{background:'transparent',border:'1px solid '+b,
                  borderRadius:12,padding:'12px 20px',color:m,fontWeight:600,
                  fontSize:13,cursor:'pointer'}}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab selector */}
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {['materials','books'].map(tab2=>(
            <button key={tab2} onClick={()=>setTab(tab2)}
              style={{padding:'8px 20px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:13,fontWeight:700,transition:'all 0.2s',
                background:tab===tab2?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                color:tab===tab2?'#fff':m}}>
              {tab2==='materials'?'📄 Study Materials':'📗 Books & Courses'}
            </button>
          ))}
        </div>

        {tab === 'materials'
          ? MATERIALS.map(item=><MaterialCard key={item.id} item={item}/>)
          : BOOKS.map(item=><BookCard key={item.id} item={item}/>)
        }

        <div style={{height:40}}/>
      </div>
    </div>
  )
}
