# 贡献内容

改 `content/` 下的 markdown，提交即可。GitHub Action 会自动重新生成 `config.json` 并提交回 master，GitHub Pages 随 master 更新。**不要手改 `config.json`**——它是生成产物。

## 本地预览

```
python scripts/build.py
python -m http.server 8080
```

打开 http://localhost:8080/ （必须起本地服务器，双击 HTML 会因跨域加载不到 config.json）。

## 改什么写哪里

| 要改 | 文件 | 说明 |
|---|---|---|
| 站点名 / 配色 / B站账号 / 友链 / 联系方式 | `content/site.md` | `key: value` 行 + 页脚友链表 |
| 乐队简介 / 成员 / 结成备忘 | `content/band.md` | 简介图、简介段落、成员表、结成备忘 |
| 翻唱 / 作品 | `content/works.md` | 一行一个；自动进 DISCOGRAPHY / MOVIE / NEWS |
| 演出 | `content/shows.md` | 一行一个；自动进 LIVE / NEWS / 年表 |
| 歌词 | `content/lyrics/<BV号>.md` | 文件名用对应作品的 BV号 |

## 图片

放进 `assets/img/banner/`（封面）、`assets/img/top/`（主视觉）等。在 markdown 里写相对路径，如 `assets/img/banner/v08_xxx.jpg`（开头不要加 `/` 或 `./`，文件名用小写英文/拼音）。

## works.md 表头

```
| 日期 | 类别 | 标题 | 原唱 | 封面 | BV号 |
```

日期 `YYYY.MM.DD`；类别 `翻唱` / `活动`；封面是 `assets/img/banner/` 下路径；BV号填 B 站视频号。

## shows.md 表头

```
| 日期 | 星期 | 标题 | 场地 | 主办 | 阵容 | 类别 | BV号 | 备注 |
```

标题只写演出名，场地、时间、票价分列填写，网站自动拼成"标题 @ 场地"展示。BV号为演出回顾视频（可选，没有就留空）。日期不完整可写 `2024.05`。星期用三字母英文（`SAT`/`SUN`…）。

## 派生规则（不用管，build.py 自动算）

- NEWS = 作品发布 + 演出（按日期倒序，BV号相同者去重）
- MOVIE = 所有有 BV号 的作品
- LIVE = 全部演出（按日期倒序）
- 年表 = 演出 + 作品按年汇总

## 提交

推送 `content/` 改动即可，Action 会自动重新生成并提交 `config.json`（你无需手动提交它）。想本地先看就跑上面两条命令。
