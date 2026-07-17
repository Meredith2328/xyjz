import io
p = 'scripts/build.py'
s = open(p, encoding='utf-8').read()
s = s.replace('with open(p, encoding="utf-8") as f:', 'with open(p, encoding="utf-8-sig") as f:')
open(p, 'w', encoding='utf-8').write(s)
print('patched:', 'utf-8-sig' in s)
