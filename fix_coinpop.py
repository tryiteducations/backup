with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# CoinPop function body was deleted - restore it
bad = """function CoinPop({ amount, onDone }) {
  )
}"""

good = """function CoinPop({ amount, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{position:'fixed',bottom:100,right:24,zIndex:9998,
      background:'linear-gradient(135deg,#C9A84C,#E8C44A)',
      borderRadius:20,padding:'10px 18px',
      boxShadow:'0 8px 32px rgba(201,168,76,0.4)',
      display:'flex',alignItems:'center',gap:8,
      animation:'slideUp 0.3s ease',fontFamily:'Poppins,sans-serif'}}>
      <span style={{fontSize:20}}>🪙</span>
      <span style={{color:'#1E3A5F',fontWeight:800,fontSize:15}}>+{amount}</span>
    </div>
  )
}"""

if bad in c:
    c = c.replace(bad, good)
    print('OK CoinPop restored')
else:
    print('Pattern not found - checking...')
    idx = c.find('function CoinPop')
    print(c[idx:idx+100])

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
