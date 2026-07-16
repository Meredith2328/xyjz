# 夏夜将终 OFFICIAL SITE

基于 Yorushika 官网模板复刻的"夏夜将终"校园乐队官网。

## 本地运行

```powershell
python -m http.server 8080
```

浏览器打开 http://localhost:8080/

## 内容管理

所有动态内容（News、Live、Discography、Biography等）都在 **config.json** 中管理。
修改 config.json 后刷新页面即可生效，无需改 HTML。

### config.json 结构

- `site`: 站点名称、配色
- `social`: B站官方账号链接
- `footerBanners`: 页脚三张横幅图及链接
- `biography`: 乐队简介、成员、年表
- `news`: 新闻条目（日期、分类、标题、B站视频ID）
- `live`: 演出日程
- `discography`: 作品列表（封面、翻唱日期、原唱、B站视频ID）
- `movies`: MV/视频列表
- `works`: 商业合作（目前为空）
- `contact`: 联系方式

### 添加 News 条目

在 config.json 的 `news` 数组中添加：
```json
{ "date": "2025.05.01", "category": "翻唱", "title": "新翻唱标题", "bvid": "BVxxxxxxxx" }
```

### 添加 Live 日程

在 `live` 数组中添加：
```json
{ "date": "2025.06.01", "week": "SAT", "title": "演出名称@场地", "bvid": "" }
```

### 添加 Discography

在 `discography` 数组中添加：
```json
{ "title": "曲名", "date": "2025.06.01", "category": "翻唱", "original": "原唱", "cover": "/assets/img/banner/xxx.jpg", "bvid": "BVxxxxxxxx" }
```

## 页面列表

| 文件 | 内容 |
|------|------|
| index.html | 首页（主视觉、Banner轮播、NEWS、MOVIE） |
| news.html | NEWS列表 |
| live.html | LIVE列表 |
| movie.html | MOVIE列表 |
| discography.html | DISCOGRAPHY |
| lyrics.html | LYRICS列表 |
| disco-detail.html | 作品详情（通过?bvid=参数指定） |
| lyrics-detail.html | 歌词详情（通过?bvid=参数指定） |
| biography.html | BIOGRAPHY |
| special.html | SPECIAL |
| works.html | WORKS |
| contact.html | CONTACT |
| app.html | APP |
| fanletter.html | FAN LETTER |

## 配色

深蓝紫色调：主色 #6B5B95，强调色 #8B7AB8，深色 #3D2B5F
