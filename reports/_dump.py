# -*- coding: utf-8 -*-
import json, os
d = json.load(open('reports/_crawl_raw.json', encoding='utf-8'))
outdir = 'reports/_articles'
os.makedirs(outdir, exist_ok=True)
for i, r in enumerate(d, 1):
    fn = os.path.join(outdir, f'{i:02d}_{r["sid"]}.txt')
    with open(fn, 'w', encoding='utf-8') as f:
        f.write('SID: ' + r['sid'] + '\n')
        f.write('NOTE: ' + r['note'] + '\n')
        f.write('URL: ' + r['url'] + '\n')
        f.write('TITLE: ' + str(r.get('title')) + '\n')
        f.write('ACCOUNT: ' + str(r.get('account')) + '\n')
        f.write('PUBLISH: ' + str(r.get('publish_time')) + ' | ' + str(r.get('publish_time_text')) + '\n')
        f.write('IMAGES: ' + str(len(r.get('images') or [])) + '\n')
        f.write('----CONTENT----\n')
        ct = r.get('content_text')
        if ct:
            f.write(ct + '\n')
        else:
            f.write('(no extractable text - likely image/poster based)\n')
        f.write('----BLOCKS----\n')
        for b in (r.get('content_blocks') or []):
            f.write(b + '\n')
        f.write('----IMAGES----\n')
        for im in (r.get('images') or []):
            f.write(im + '\n')
print('dumped', len(d))
