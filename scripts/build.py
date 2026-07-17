#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build config.json from content/*.md (single source of truth).

Run:  python scripts/build.py
Reads content/site.md, content/band.md, content/works.md, content/shows.md
and optional content/lyrics/<BV号>.md, then writes config.json at repo root.
movies / news / live / biography.history are DERIVED so contributors edit one place.
"""
import os, re, json, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
LYRICS = os.path.join(CONTENT, "lyrics")


def read_lines(name):
    p = os.path.join(CONTENT, name)
    if not os.path.exists(p):
        return []
    with open(p, encoding="utf-8-sig") as f:
        return f.read().splitlines()


def sections(lines):
    secs = {}
    cur = None
    for ln in lines:
        m = re.match(r"^(#{1,6})\s+(.*)$", ln)
        if m:
            cur = m.group(2).strip()
            secs[cur] = []
        elif cur is not None:
            secs[cur].append(ln)
    return secs


def body(secs, name):
    b = secs.get(name, [])
    b = list(b)
    while b and not b[0].strip():
        b.pop(0)
    while b and not b[-1].strip():
        b.pop()
    return b


def parse_kv(lines):
    d = {}
    for ln in lines:
        ln = ln.rstrip()
        if not ln.strip() or ln.strip().startswith("|"):
            continue
        if ":" in ln:
            k, v = ln.split(":", 1)
        elif "：" in ln:
            k, v = ln.split("：", 1)
        else:
            continue
        d[k.strip()] = v.strip()
    return d


def parse_table(lines):
    header = None
    rows = []
    for ln in lines:
        ln = ln.strip()
        if not ln.startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip("|").split("|")]
        if header is None:
            header = cells
            continue
        if all(re.match(r"^:?-+:?$", c or "") for c in cells):
            continue
        rows.append(dict(zip(header, cells)))
    return rows


def join_nonempty(lines):
    return "\n".join(l.rstrip() for l in lines if l.strip())


def date_parts(d):
    out = []
    for x in (d or "").split("."):
        out.append(int(x) if x.isdigit() else 0)
    while len(out) < 3:
        out.append(0)
    return out  # [y, m, day]


def md_prefix(d):
    y, m, day = date_parts(d)
    if day:
        return f"{m}月{day}日"
    return f"{m}月" if m else ""


def lyrics_for(bvid):
    if not bvid:
        return ""
    p = os.path.join(LYRICS, bvid + ".md")
    if not os.path.exists(p):
        return ""
    with open(p, encoding="utf-8-sig") as f:
        lines = f.read().splitlines()
    # drop a leading title if it is a markdown heading
    while lines and (lines[0].strip().startswith("#") or not lines[0].strip()):
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def warn(msg):
    print("  [warn] " + msg, file=sys.stderr)


def main():
    # ---- site ----
    ssecs = sections(read_lines("site.md"))
    basic = parse_kv(body(ssecs, "基本信息"))
    bili = parse_kv(body(ssecs, "B站官方账号"))
    ctct = parse_kv(body(ssecs, "联系方式"))
    footer_rows = parse_table(body(ssecs, "页脚友链"))

    site = {
        "name": basic.get("名称", "夏夜将终 OFFICIAL SITE"),
        "nameJP": basic.get("日文名", "夏夜の終へ"),
        "nameCN": basic.get("中文名", "夏夜将终"),
        "description": basic.get("描述", ""),
        "color": basic.get("主色", "#3D2B5F"),
        "colorAccent": basic.get("强调色", "#8B7AB8"),
        "colorTeal": basic.get("第三色", "#6B5B95"),
    }
    social = {
        "bilibili": bili.get("链接", ""),
        "bilibiliName": bili.get("名称", ""),
    }
    contact = {
        "bilibili": ctct.get("链接", social["bilibili"]),
        "bilibiliName": ctct.get("名称", social["bilibiliName"]),
    }
    footerBanners = [
        {"img": r.get("图片", ""), "alt": r.get("名称", ""), "link": r.get("链接", ""), "target": "_blank"}
        for r in footer_rows
    ]

    # ---- band ----
    bsecs = sections(read_lines("band.md"))
    photo_body = body(bsecs, "简介图")
    photo = photo_body[0].strip() if photo_body else ""
    intro = join_nonempty(body(bsecs, "简介"))
    members = [
        {"role": r.get("担当", ""), "name": r.get("成员", "")}
        for r in parse_table(body(bsecs, "成员"))
    ]
    formed = join_nonempty(body(bsecs, "结成备忘"))

    # ---- works ----
    wsecs = sections(read_lines("works.md"))
    wrows = parse_table(body(wsecs, "作品 / 翻唱"))
    works = []
    for r in wrows:
        bvid = r.get("BV号", "").strip()
        cover = r.get("封面", "").strip()
        if cover and not os.path.exists(os.path.join(ROOT, cover)):
            warn("作品封面文件不存在: " + cover + " (BV " + bvid + ")")
        if not bvid:
            warn("作品缺 BV号: " + r.get("标题", ""))
        item = {
            "title": r.get("标题", "").strip(),
            "date": r.get("日期", "").strip(),
            "category": r.get("类别", "翻唱").strip(),
            "original": r.get("原唱", "").strip(),
            "cover": cover,
            "bvid": bvid,
        }
        lyr = lyrics_for(bvid)
        if lyr:
            item["lyrics"] = lyr
        works.append(item)
    works.sort(key=lambda x: date_parts(x["date"]), reverse=True)

    # ---- shows ----
    shsecs = sections(read_lines("shows.md"))
    srows = parse_table(body(shsecs, "演出时间线"))
    shows = []
    for r in srows:
        shows.append({
            "date": r.get("日期", "").strip(),
            "week": r.get("星期", "").strip(),
            "title": r.get("标题", "").strip(),
            "venue": r.get("场地", "").strip(),
            "host": r.get("主办", "").strip(),
            "lineup": r.get("阵容", "").strip(),
            "category": r.get("类别", "LIVE").strip() or "LIVE",
            "bvid": r.get("BV号", "").strip(),
            "note": r.get("备注", "").strip(),
        })
    shows.sort(key=lambda x: date_parts(x["date"]))  # asc for timeline

    # ---- derived: discography ----
    discography = [
        {k: w[k] for k in ("title", "date", "category", "original", "cover", "bvid")}
        for w in works
    ]
    # keep lyrics too for detail-render.js
    for w, d in zip(works, discography):
        if "lyrics" in w:
            d["lyrics"] = w["lyrics"]

    # ---- derived: movies (from works; all have bvid) ----
    movies = [
        {"title": w["title"], "bvid": w["bvid"], "date": w["date"], "cover": w["cover"]}
        for w in works if w["bvid"]
    ]

    work_bvids = {w["bvid"] for w in works if w["bvid"]}
    show_bvids = {s["bvid"] for s in shows if s["bvid"]}

    def composed(s):
        return s["title"] + (" @ " + s["venue"] if s["venue"] else "")

    # ---- derived: news (works + shows, dedup by bvid) ----
    news = []
    for w in works:
        news.append({"date": w["date"], "category": w["category"], "title": w["title"], "bvid": w["bvid"]})
    for s in shows:
        if s["bvid"] and s["bvid"] in work_bvids:
            continue  # the work release already covers this video
        news.append({"date": s["date"], "category": s["category"], "title": composed(s), "bvid": s["bvid"]})
    news.sort(key=lambda x: date_parts(x["date"]), reverse=True)

    # ---- derived: live (all shows, desc) ----
    live = [
        {"date": s["date"], "week": s["week"], "title": composed(s), "bvid": s["bvid"]}
        for s in sorted(shows, key=lambda x: date_parts(x["date"]), reverse=True)
    ]

    # ---- derived: biography.history (year-grouped, works+shows, dedup) ----
    entries = []  # (year, (m,d), line)
    if formed:
        entries.append((2023, (0, 0), formed))
    for w in works:
        if w["bvid"] and w["bvid"] in show_bvids:
            continue  # the show entry already covers this
        y, m, d = date_parts(w["date"])
        md = md_prefix(w["date"])
        if w["category"] == "翻唱":
            line = f"{md} 《{w['title']}》翻唱发布"
        else:
            line = f"{md} {w['title']}"
        entries.append((y, (m, d), line))
    for s in shows:
        y, m, d = date_parts(s["date"])
        md = md_prefix(s["date"])
        line = f"{md} {s['title']}" + (f" @ {s['venue']}" if s["venue"] else "")
        entries.append((y, (m, d), line))

    by_year = {}
    for y, key, line in entries:
        by_year.setdefault(y, []).append((key, line))
    history = []
    for y in sorted(by_year):
        lines = [ln for _, ln in sorted(by_year[y], key=lambda t: t[0])]
        history.append({"year": f"{y}年", "text": "\n".join(lines)})

    biography = {
        "photo": photo,
        "intro": intro,
        "members": members,
        "history": history,
    }

    config = {
        "_meta": {
            "generatedBy": "scripts/build.py",
            "source": "content/",
            "doNotEdit": "直接改 content/*.md 后重新运行 scripts/build.py",
        },
        "site": site,
        "social": social,
        "footerBanners": footerBanners,
        "biography": biography,
        "news": news,
        "live": live,
        "discography": discography,
        "movies": movies,
        "works": [],
        "contact": contact,
    }

    out = os.path.join(ROOT, "config.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print("wrote " + out)
    print("works=%d shows=%d discography=%d movies=%d news=%d live=%d history_years=%d"
          % (len(works), len(shows), len(discography), len(movies), len(news), len(live), len(history)))


if __name__ == "__main__":
    main()
