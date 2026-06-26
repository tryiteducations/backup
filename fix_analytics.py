src = open("index.html", encoding="utf-8").read()

GTAG = """  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FPVK6NQ94R"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FPVK6NQ94R');
  </script>"""

if "G-FPVK6NQ94R" in src:
    print("Analytics already added")
else:
    src = src.replace("<head>", "<head>\n" + GTAG)
    open("index.html", "w", encoding="utf-8").write(src)
    print("Google Analytics added")
