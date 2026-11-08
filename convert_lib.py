# -*- coding: utf-8 -*-
"""把 PDF / DOCX / PPTX / TXT 抽成文本，输出 JSON 给 Obsidian 插件用。

用法: python convert_lib.py <文件绝对路径>
输出: 一行 JSON {"ok":true,"kind":"pdf","chars":1234,"pages":40,"text":"..."}
"""
import sys
import os
import json
import re

# 允许使用装在别处的 pdfplumber
EXTRA_PATHS = [
    r"C:\Users\wangtongrui\Desktop\DeepSeek工作区\obsidian-org\pylibs",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "pylibs"),
]
for _p in EXTRA_PATHS:
    if os.path.isdir(_p) and _p not in sys.path:
        sys.path.insert(0, _p)


def clean(t):
    if not t:
        return ""
    t = t.replace("\r\n", "\n").replace("\r", "\n")
    t = re.sub(r"[ \t]+\n", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def from_pdf(path):
    import pdfplumber
    chunks = []
    n = 0
    with pdfplumber.open(path) as pdf:
        n = len(pdf.pages)
        for i, page in enumerate(pdf.pages, 1):
            try:
                t = page.extract_text(x_tolerance=1.6, y_tolerance=2.5) or ""
            except Exception:
                t = ""
            t = clean(t)
            if t:
                chunks.append("### 第 %d 页\n\n%s" % (i, t))
    return "\n\n".join(chunks), n


def from_docx(path):
    import docx
    d = docx.Document(path)
    out = []
    for p in d.paragraphs:
        t = (p.text or "").strip()
        if not t:
            continue
        style = (p.style.name or "").lower() if p.style is not None else ""
        if style.startswith("heading"):
            lvl = re.sub(r"\D", "", style) or "2"
            try:
                lvl = min(int(lvl) + 1, 6)
            except Exception:
                lvl = 2
            out.append("#" * lvl + " " + t)
        else:
            out.append(t)
    for ti, table in enumerate(d.tables, 1):
        rows = []
        for ri, row in enumerate(table.rows):
            cells = [(c.text or "").strip().replace("\n", " ") for c in row.cells]
            rows.append("| " + " | ".join(cells) + " |")
            if ri == 0:
                rows.append("|" + " --- |" * len(cells))
        if rows:
            out.append("### 表格 %d\n\n%s" % (ti, "\n".join(rows)))
    return "\n\n".join(out), None


def from_pptx(path):
    from pptx import Presentation
    prs = Presentation(path)
    out = []
    n = 0
    for i, slide in enumerate(prs.slides, 1):
        n = i
        texts = []
        for shape in slide.shapes:
            if getattr(shape, "has_text_frame", False) and shape.has_text_frame:
                t = (shape.text_frame.text or "").strip()
                if t:
                    texts.append(t)
        if texts:
            out.append("### 幻灯片 %d\n\n%s" % (i, "\n\n".join(texts)))
    return "\n\n".join(out), n


def from_text(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read(), None


def main():
    # Windows 控制台默认 GBK，会因生僻符号/私用区字符报错；强制 UTF-8 输出
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "error": "缺少文件路径"}, ensure_ascii=False))
        return
    p = sys.argv[1]
    if not os.path.isfile(p):
        print(json.dumps({"ok": False, "error": "文件不存在: " + p}, ensure_ascii=False))
        return
    ext = os.path.splitext(p)[1].lower()
    try:
        if ext == ".pdf":
            text, n = from_pdf(p)
            kind = "pdf"
        elif ext == ".docx":
            text, n = from_docx(p)
            kind = "docx"
        elif ext == ".pptx":
            text, n = from_pptx(p)
            kind = "pptx"
        elif ext in (".txt", ".md", ".csv"):
            text, n = from_text(p)
            kind = "text"
        elif ext in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"):
            text, n = "", None
            kind = "image"
        elif ext == ".doc":
            print(json.dumps({"ok": False, "error": "不支持旧版 .doc，请另存为 .docx"}, ensure_ascii=False))
            return
        else:
            print(json.dumps({"ok": False, "error": "暂不支持 " + ext}, ensure_ascii=False))
            return
        print(json.dumps({
            "ok": True, "kind": kind, "chars": len(text), "pages": n, "text": text
        }, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"ok": False, "error": "%s: %s" % (type(e).__name__, e)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
