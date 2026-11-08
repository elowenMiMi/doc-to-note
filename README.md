# 文献转笔记 · Doc to Note

把本地的 **PDF / Word(.docx) / PPT(.pptx) / 纯文本 / 图片** 拖进来，一键抽正文生成 Obsidian 笔记，原文件一起入库，笔记落到指定文件夹（默认收件箱），方便后续分类。

## 功能

- 拖放或点选文件，支持批量
- 自动抽取正文：PDF（逐页）、Word（含标题层级与表格）、PPT（按幻灯片）
- 原文件复制进库并嵌入笔记，随时对照
- 新笔记带 frontmatter（来源文件 / 转换方式 / 导入时间）
- 转换过程有日志，失败不会丢文件（仍会生成带附件的笔记）

## 依赖

- **桌面版 Obsidian**（需要调用本地进程）
- **Python 3** 及以下库：
  - `pdfplumber`（PDF）
  - `python-docx`（Word）
  - `python-pptx`（PPT）

  安装：`pip install pdfplumber python-docx python-pptx`

## 安装

- 社区插件市场搜索 **文献转笔记**（上架后）
- 或用 BRAT 添加本仓库
- 手动：把 `main.js`、`manifest.json`、`styles.css` 放进 `<vault>/.obsidian/plugins/doc2note/`

## 用法

1. 命令面板 →「导入文献（PDF/Word/PPT/图片）并转为笔记」
2. 把文件拖进虚线框
3. 点「转换成 OB 笔记」

## 设置

| 项 | 说明 |
| --- | --- |
| 笔记放到 | 生成笔记的位置，默认 `Inbox` |
| 原文件放到 | 附件位置，默认 `Inbox/assets` |
| Python 路径 | 留空则依次尝试 `python3` / `python` / `py` |
| 转换完自动打开笔记 | 开关 |

## 已知限制

- 扫描版 PDF（整页图片）抽不出文字，会生成带附件和提示的笔记
- 图片不做 OCR
- 旧版 `.doc` 不支持，请另存为 `.docx`

## 许可

MIT
