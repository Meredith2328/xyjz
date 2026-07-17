# -*- coding: utf-8 -*-
import json, os, time
import requests
d = json.load(open('reports/_crawl_raw.json', encoding='utf-8'))
H = {"User-Agent":"Mozilla/5.0","Referer":"https://mp.weixin.qq.com/"}
# download all images for poster-based articles and a sample for big ones
targets_all = ['02_z3KOgpPN1W7G8lGplIHdQw','03_D1cLYvya4OkuIAfYjSq_Ag','04_-rhBmaOi7fHCAYuO7UA8-A','05_oNUWJYcZQQhPUjEfsVWMxg','08_-FmuePlL1iop3fob_4JHAg']
# big ones: download first 12 images
big_sample = {'01_M-c3a7kDjPoSfAkM3FJmZQ':12,'07_SLrLxkWJ315OgIcrN7-fpA':12}
base = 'reports/_images'
os.makedirs(base, exist_ok=True)
for r in d:
    sid = r['sid']
    # find folder name prefix by index
    idx = next((i for i,x in enumerate(d,1) if x['sid']==sid), 0)
    folder = os.path.join(base, f'{idx:02d}_{sid}')
    os.makedirs(folder, exist_ok=True)
    imgs = r.get('images') or []
    if f'{idx:02d}_{sid}' in targets_all:
        keep = imgs
    elif f'{idx:02d}_{sid}' in big_sample:
        keep = imgs[:big_sample[f'{idx:02d}_{sid}']]
    else:
        keep = []
    for j, url in enumerate(keep, 1):
        ext = '.jpg'
        if 'png' in url or 'wx_fmt=png' in url:
            ext = '.png'
        fn = os.path.join(folder, f'{j:02d}{ext}')
        if os.path.exists(fn) and os.path.getsize(fn) > 1000:
            continue
        try:
            rr = requests.get(url, headers=H, timeout=30)
            if rr.status_code == 200 and len(rr.content) > 500:
                with open(fn, 'wb') as f:
                    f.write(rr.content)
                print('ok', folder, j, len(rr.content))
            else:
                print('bad', folder, j, rr.status_code, len(rr.content))
        except Exception as e:
            print('err', folder, j, repr(e))
        time.sleep(0.3)
print('done download')
