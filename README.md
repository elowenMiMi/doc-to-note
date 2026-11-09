# Doc to Note · 文献转笔记

Turn PDF, Word, PowerPoint, plain-text, and image files into Markdown notes. The text is extracted, the original file is copied into your vault and embedded, and the new note lands in your inbox folder.

把本地的 PDF / Word / PPT / 纯文本 / 图片拖进来，一键抽出正文生成笔记；原文件一起入库并嵌入，新笔记落到收件箱，便于后续分类。

## Features · 功能

| English | 中文 |
| --- | --- |
| Drag and drop files onto the panel, or pick them with the file dialog. Batch supported. | 支持拖放或点选，可一次处理多个文件。 |
| Text extraction: PDF page by page, Word including heading levels and tables, PowerPoint slide by slide, plain text as-is. | 抽取正文：PDF 逐页、Word 保留标题层级与表格、PPT 按幻灯片、纯文本原样。 |
| The original file is copied into the vault and embedded in the note, so you can always check the source. | 原文件复制进库并嵌入笔记，随时对照原文。 |
| Each note carries frontmatter: source file, conversion method, import time. | 新笔记带 frontmatter：来源文件、转换方式、导入时间。 |
| A live log shows every step. If extraction fails, the note is still created with the attachment. | 过程有实时日志；抽取失败也会生成带附件的笔记，不会丢文件。 |
| Target folder is configurable (default `Inbox`), ready for a sorting plugin. | 目标文件夹可配置（默认 `Inbox`），方便接后续的分类插件。 |

## Requirements · 依赖

- **Desktop only** — the plugin calls a local process, hence `isDesktopOnly: true`. · 仅桌面版（需调用本地进程）。
- **Python 3** with: · 需要 Python 3 及以下库：
  - `pdfplumber` — PDF
  - `python-docx` — Word
  - `python-pptx` — PowerPoint

```bash
pip install pdfplumber python-docx python-pptx
```

The converter script is embedded in `main.js` and written next to the plugin on first use — nothing else to download.

转换脚本已内嵌在 `main.js` 中，首次运行时自动落盘，不需要额外下载文件。

## Installation · 安装

**Community plugins** (once listed): Settings → Community plugins → Browse → search **Doc to Note**.

**BRAT** (available now): `BRAT: Add a beta plugin for testing` → `elowenMiMi/doc-to-note`.

**Manual**: copy `main.js`, `manifest.json`, `styles.css` into `<vault>/.obsidian/plugins/doc-to-note/`.

---

**社区插件市场**（上架后）：搜索 **Doc to Note**。

**BRAT**：填入 `elowenMiMi/doc-to-note`。

**手动**：三个文件放进 `<库>/.obsidian/plugins/doc-to-note/`。

## Usage · 用法

1. Command palette → **Import documents (PDF/Word/PPT/images) as notes**. · 命令面板 →「导入文献（PDF/Word/PPT/图片）并转为笔记」。
2. Drop files into the dashed area. · 把文件拖进虚线框。
3. Click **Convert to notes**. · 点「转换成 OB 笔记」。

## Settings · 设置

| English | 中文 |
| --- | --- |
| Notes go to — default `Inbox`. | 笔记放到 —— 默认 `Inbox`。 |
| Originals go to — default `Inbox/assets`. | 原文件放到 —— 默认 `Inbox/assets`。 |
| Python path — leave empty to try `python3`, `python`, `py` in order. | Python 路径 —— 留空则依次尝试 `python3` / `python` / `py`。 |
| Open note after conversion — toggle. | 转换完自动打开笔记 —— 开关。 |

## Limitations · 已知限制

- Scanned PDFs (image-only pages) produce no text; you still get a note with the file attached. · 扫描版 PDF 抽不出文字，仍会生成带附件的笔记。
- Images are imported but **not OCR'd**. · 图片只入库，**不做 OCR**。
- Old `.doc` is not supported — save as `.docx` first. · 旧版 `.doc` 不支持，请另存为 `.docx`。

## License · 许可

MIT
