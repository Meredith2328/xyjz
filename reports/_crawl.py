# -*- coding: utf-8 -*-
import re, json, sys, time, datetime
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
}

links = [
    ("M-c3a7kDjPoSfAkM3FJmZQ", "11.19兆丰广场(纯鹿人时期)"),
    ("z3KOgpPN1W7G8lGplIHdQw", "本周日晚叶楼多功能厅"),
    ("D1cLYvya4OkuIAfYjSq_Ag", "5月5日相辉堂北堂五月雨"),
    ("-rhBmaOi7fHCAYuO7UA8-A", "未知推送A"),
    ("oNUWJYcZQQhPUjEfsVWMxg", "明天晚上叶楼102"),
    ("mHRFFLg8OjsLKELZqNolSA", "这周六迎新"),
    ("SLrLxkWJ315OgIcrN7-fpA", "未知推送B"),
    ("-FmuePlL1iop3fob_4JHAg", "沸点纪第一次正式组合名"),
    ("Z7CDi8bkos8f3nKB4sRDiw", "本周日晚的live"),
]

def parse_one(sid, note):
    url = "https://mp.weixin.qq.com/s/" + sid
    out = {"sid": sid, "note": note, "url": url}
    try:
        r = requests.get(url, headers=HEADERS, timeout=25)
    except Exception as e:
        out["error"] = "request: " + repr(e)
        return out
    out["status"] = r.status_code
    html = r.text
    out["html_len"] = len(html)
    soup = BeautifulSoup(html, "lxml")

    # title
    title = None
    el = soup.find(id="activity-name")
    if el:
        title = el.get_text(strip=True)
    if not title:
        m = re.search(r"<title>(.*?)</title>", html, re.S)
        if m:
            title = m.group(1).strip()
    out["title"] = title

    # account
    acc = None
    el = soup.find(id="js_name")
    if el:
        acc = el.get_text(strip=True)
    out["account"] = acc

    # author
    au = None
    el = soup.find(id="js_author_name") or soup.find(class_=re.compile("rich_media_meta_text"))
    out["author_raw"] = au.get_text(strip=True) if au else None

    # publish time
    ct = None
    m = re.search(r'var\s+ct\s*=\s*["\'](\d+)["\']', html)
    if m:
        ct = int(m.group(1))
        out["publish_ts"] = ct
        try:
            out["publish_time"] = datetime.datetime.fromtimestamp(ct).strftime("%Y-%m-%d %H:%M")
        except Exception:
            pass
    el = soup.find(id="publish_time")
    if el:
        out["publish_time_text"] = el.get_text(strip=True)

    # content
    content_el = soup.find(id="js_content")
    text_parts = []
    images = []
    if content_el:
        for node in content_el.descendants:
            name = getattr(node, "name", None)
            if name in ("img",):
                src = node.get("data-src") or node.get("src") or ""
                if src and src.startswith("http"):
                    images.append(src)
            if name in ("p","section","span","strong","b","h1","h2","h3","h4","li","div"):
                txt = node.get_text(strip=True)
        # better: walk block-level
        text_parts = []
        for el2 in content_el.find_all(["p","section","li","h1","h2","h3","h4","h5","blockquote"]):
            txt = el2.get_text(strip=True)
            if txt:
                text_parts.append(txt)
        # also gather plain text for fallback
        full_text = content_el.get_text("\n", strip=True)
        out["content_text"] = full_text
        out["content_blocks"] = text_parts
        out["images"] = images
    else:
        out["content_text"] = None
        # check for environment / verify warning
        warn = soup.find(id="js_warning")
        if warn:
            out["warning"] = warn.get_text(" ", strip=True)
        env = soup.find(class_=re.compile("weui-msg__title"))
        if env:
            out["env_msg"] = env.get_text(" ", strip=True)
        body_text = soup.get_text(" ", strip=True)
        out["page_text_snippet"] = body_text[:400]
    return out

results = []
for sid, note in links:
    print("fetching", sid, note, file=sys.stderr)
    res = parse_one(sid, note)
    results.append(res)
    time.sleep(1.5)

with open(r"C:\Users\10pi\Documents\natsuyoru\reports\_crawl_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

# also dump human readable
with open(r"C:\Users\10pi\Documents\natsuyoru\reports\_crawl_raw.txt", "w", encoding="utf-8") as f:
    for r in results:
        f.write("="*80 + "\n")
        f.write("SID: " + r["sid"] + "  | note: " + r["note"] + "\n")
        f.write("URL: " + r["url"] + "\n")
        f.write("status: " + str(r.get("status")) + "  html_len: " + str(r.get("html_len")) + "\n")
        f.write("title: " + str(r.get("title")) + "\n")
        f.write("account: " + str(r.get("account")) + "\n")
        f.write("publish_time: " + str(r.get("publish_time")) + " (" + str(r.get("publish_time_text")) + ")\n")
        if r.get("warning"):
            f.write("WARNING: " + r["warning"] + "\n")
        if r.get("env_msg"):
            f.write("ENV: " + r["env_msg"] + "\n")
        ct = r.get("content_text")
        if ct:
            f.write("\n--- CONTENT TEXT ---\n")
            f.write(ct + "\n")
        else:
            f.write("\n--- NO CONTENT (snippet) ---\n")
            f.write(str(r.get("page_text_snippet")) + "\n")
        if r.get("images"):
            f.write("\n--- IMAGES (" + str(len(r["images"])) + ") ---\n")
            for im in r["images"]:
                f.write(im + "\n")
        f.write("\n")
print("done")
