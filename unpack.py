import re, os, sys
raw = open(sys.argv[1]).read()
pattern = re.compile(r'//\s*TARGET_FILE:\s*(\S+)\s*\n```[\w]*\n(.*?)```', re.DOTALL)
matches = pattern.findall(raw)
for path, code in matches:
    os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
    open(path,'w').write(code.strip()+'\n')
    print(f'✅  wrote  {path}')
print(f'\nDone — {len(matches)} files written')
