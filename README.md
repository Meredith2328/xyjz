# 夏夜将终 OFFICIAL SITE

校园乐队"夏夜将终"官网，复刻自 Yorushika 官网模板。

## 内容怎么改

所有动态内容（新闻、演出、作品、成员、年表、联系方式）以 `content/*.md` 为唯一来源。
推送后 GitHub Action 自动运行 `scripts/build.py` 生成 `config.json` 并部署到 GitHub Pages，无需手改 HTML/JS/JSON。

- 改乐队简介/成员/结成备忘 → `content/band.md`
- 加翻唱作品（自动进 DISCOGRAPHY/MOVIE/NEWS）→ `content/works.md`
- 加演出（自动进 LIVE/NEWS/年表）→ `content/shows.md`
- 改站点名/配色/B站账号/友链/联系方式 → `content/site.md`
- 加歌词 → 在 `content/lyrics/` 新建 `<BV号>.md`

详细做法见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 本地预览

在项目根目录下运行：

```powershell
python scripts/build.py        # 从 content/*.md 生成 config.json
python -m http.server 8080
```
浏览器打开 http://localhost:8080/（必须起本地服务器，直接双击 HTML 会因跨域加载不到 config.json）。

## 首次启用 GitHub Pages（一次性）

仓库 Settings → Pages → Source 选 **GitHub Actions**。之后每次推送到 master，`.github/workflows/deploy.yml` 会自动构建并部署。

## 结构

| 路径 | 作用 |
|---|---|
| `content/*.md` | 内容唯一来源（人改这里） |
| `scripts/build.py` | 把 markdown 编译成 `config.json`（机器跑） |
| `config.json` | 生成产物，已 gitignore，勿手改 |
| `assets/js/render.js` | 读 config.json 渲染各列表页 |
| `index.html` 等 | 页面骨架，一般不动 |
| `reports/` | 人工确认用的整理报告（演出时间线、代码问题等） |

## 配色

深紫主色 `#3D2B5F`，强调 `#8B7AB8`，第三色 `#6B5B95`（在 `content/site.md` 改）。
