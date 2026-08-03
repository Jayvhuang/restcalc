# Bing Webmaster Tools — 提交步骤（手动，一次性）

按哥飞/蓝星空文章《Google没排名也能月入千刀》的打法，新站早期要让 Bing 先给反馈。
restcalc 已经准备好了两样东西：

- `indexnow.txt`（根目录）— IndexNow key，已就位。
- `submit-indexnow.js` — 部署后运行即可主动通知 Bing 新页面。

下面是你（owner）需要在 Bing 后台点一下的步骤。**不需要写代码**，照做即可。

## 1. 添加站点

1. 打开 https://www.bing.com/webmasters/
2. 用 Microsoft 账号登录（没有就注册一个）。
3. 添加站点：`https://restcalc.vercel.app`（以后买了自定义域名，再添加一次 `https://restcalc.com`）。
4. 验证方式选 **「上传文件」或「元标记」**：
   - 上传文件：把 `indexnow.txt` 的内容就是验证 key 之一，但 Bing 要的是它自己生成的 `BingSiteAuth.xml` 风格文件。最简单是「元标记」——把 Bing 给的 `<meta>` 粘到 `index.html` 的 `<head>` 里（和已有的 GSC `<meta>` 放一起），重新部署即可。
   - 或者选「API」方式用 IndexNow key 验证（与 `indexnow.txt` 一致）。

## 2. 提交 sitemap

1. 左侧菜单 → **Sitemaps**。
2. 提交 `https://restcalc.vercel.app/sitemap.xml`。
3. 等 Bing 抓取（通常几分钟到几小时）。

## 3. 看 Recommendations（修基础问题）

1. 左侧菜单 → **Site Scan / Recommendations**。
2. 它会列出标题、描述、页面质量、链接结构、收录状态等问题。
3. 这些问题多数**不只影响 Bing，也影响 Google**——早修早好。
4. 修完在 restcalc 代码里改好，重新部署，再跑 `node submit-indexnow.js`。

## 4. 部署后自动通知（你这边要做的）

每次 restcalc 部署完，运行：

```bash
cd /Users/jayv/CCAI/网站/restcalc
node submit-indexnow.js            # 默认 HOST=restcalc.vercel.app
# 以后换了自定义域名：
HOST=restcalc.com node submit-indexnow.js
```

`--dry-run` 只打印要提交的 URL、不真正发请求，部署前想确认可以用。

## 5. 验证 IndexNow key 可访问

浏览器打开 `https://restcalc.vercel.app/indexnow.txt`，应只显示一行 32 位十六进制字符串，无任何多余字符。

## 如果 Bing 一直不收录，按顺序排查

1. 内容太少 → 补文章（见 `learn/` 下的教程）。
2. 低质量/批量生成页面太多 → 删掉一批。
3. 域名历史有问题 → 换域名更省时间。
4. 方向本身不合规 → 别靠技巧绕，先合规。

> 参考：哥飞《Google没排名也能月入千刀，蓝星空讲新站怎么找用户》
