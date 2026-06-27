src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# The grid container was replaced with mockup — restore it
old_broken = """                {/* Theme grid */}
                <div style={{
                          height:115, overflow:'hidden', position:'relative',
                          borderRadius:'12px 12px 0 0',
                          background:t.bg||'#F8FAFC',
                          fontFamily:'Inter,sans-serif',
                        }}>
                          {/* shimmer */}
                          <div style={{
                            position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
                            background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%"""

# Find exact start
idx = src.find("{/* Theme grid */}")
grid_section_start = idx
# Find where the broken block ends - after </div> that closes it
# Look for filteredThemes.map which should come after grid div opens
map_idx = src.find("filteredThemes.map")
print(f"Grid section at: {grid_section_start}")
print(f"filteredThemes.map at: {map_idx}")
print(repr(src[grid_section_start:grid_section_start+200]))
print("\n---")
print(repr(src[map_idx-100:map_idx+100]))
