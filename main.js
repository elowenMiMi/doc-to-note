const obsidian = require("obsidian");

let fs = null;
let nodePath = null;
let execFile = null;
try {
  fs = require("fs");
  nodePath = require("path");
  execFile = require("child_process").execFile;
} catch (e) {
  console.error("[文献转笔记] 无法加载 Node 模块（需要桌面版 Obsidian）", e);
}

const DEFAULT_SETTINGS = {
  inboxFolder: "Inbox",
  assetFolder: "Inbox/assets",
  pythonPath: "",
  openAfter: true
};

const PY_B64 = "IyAtKi0gY29kaW5nOiB1dGYtOCAtKi0KIiIi5oqKIFBERiAvIERPQ1ggLyBQUFRYIC8gVFhUIOaKveaIkOaWh+acrO+8jOi+k+WHuiBKU09OIOe7mSBPYnNpZGlhbiDmj5Lku7bnlKjjgIIKCueUqOazlTogcHl0aG9uIGNvbnZlcnRfbGliLnB5IDzmlofku7bnu53lr7not6/lvoQ+Cui+k+WHujog5LiA6KGMIEpTT04geyJvayI6dHJ1ZSwia2luZCI6InBkZiIsImNoYXJzIjoxMjM0LCJwYWdlcyI6NDAsInRleHQiOiIuLi4ifQoiIiIKaW1wb3J0IHN5cwppbXBvcnQgb3MKaW1wb3J0IGpzb24KaW1wb3J0IHJlCgojIOWFgeiuuOS9v+eUqOijheWcqOWIq+WkhOeahCBwZGZwbHVtYmVyCkVYVFJBX1BBVEhTID0gWwogICAgciJDOlxVc2Vyc1x3YW5ndG9uZ3J1aVxEZXNrdG9wXERlZXBTZWVr5bel5L2c5Yy6XG9ic2lkaWFuLW9yZ1xweWxpYnMiLAogICAgb3MucGF0aC5qb2luKG9zLnBhdGguZGlybmFtZShvcy5wYXRoLmFic3BhdGgoX19maWxlX18pKSwgInB5bGlicyIpLApdCmZvciBfcCBpbiBFWFRSQV9QQVRIUzoKICAgIGlmIG9zLnBhdGguaXNkaXIoX3ApIGFuZCBfcCBub3QgaW4gc3lzLnBhdGg6CiAgICAgICAgc3lzLnBhdGguaW5zZXJ0KDAsIF9wKQoKCmRlZiBjbGVhbih0KToKICAgIGlmIG5vdCB0OgogICAgICAgIHJldHVybiAiIgogICAgdCA9IHQucmVwbGFjZSgiXHJcbiIsICJcbiIpLnJlcGxhY2UoIlxyIiwgIlxuIikKICAgIHQgPSByZS5zdWIociJbIFx0XStcbiIsICJcbiIsIHQpCiAgICB0ID0gcmUuc3ViKHIiXG57Myx9IiwgIlxuXG4iLCB0KQogICAgcmV0dXJuIHQuc3RyaXAoKQoKCmRlZiBmcm9tX3BkZihwYXRoKToKICAgIGltcG9ydCBwZGZwbHVtYmVyCiAgICBjaHVua3MgPSBbXQogICAgbiA9IDAKICAgIHdpdGggcGRmcGx1bWJlci5vcGVuKHBhdGgpIGFzIHBkZjoKICAgICAgICBuID0gbGVuKHBkZi5wYWdlcykKICAgICAgICBmb3IgaSwgcGFnZSBpbiBlbnVtZXJhdGUocGRmLnBhZ2VzLCAxKToKICAgICAgICAgICAgdHJ5OgogICAgICAgICAgICAgICAgdCA9IHBhZ2UuZXh0cmFjdF90ZXh0KHhfdG9sZXJhbmNlPTEuNiwgeV90b2xlcmFuY2U9Mi41KSBvciAiIgogICAgICAgICAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgICAgICAgICAgdCA9ICIiCiAgICAgICAgICAgIHQgPSBjbGVhbih0KQogICAgICAgICAgICBpZiB0OgogICAgICAgICAgICAgICAgY2h1bmtzLmFwcGVuZCgiIyMjIOesrCAlZCDpobVcblxuJXMiICUgKGksIHQpKQogICAgcmV0dXJuICJcblxuIi5qb2luKGNodW5rcyksIG4KCgpkZWYgZnJvbV9kb2N4KHBhdGgpOgogICAgaW1wb3J0IGRvY3gKICAgIGQgPSBkb2N4LkRvY3VtZW50KHBhdGgpCiAgICBvdXQgPSBbXQogICAgZm9yIHAgaW4gZC5wYXJhZ3JhcGhzOgogICAgICAgIHQgPSAocC50ZXh0IG9yICIiKS5zdHJpcCgpCiAgICAgICAgaWYgbm90IHQ6CiAgICAgICAgICAgIGNvbnRpbnVlCiAgICAgICAgc3R5bGUgPSAocC5zdHlsZS5uYW1lIG9yICIiKS5sb3dlcigpIGlmIHAuc3R5bGUgaXMgbm90IE5vbmUgZWxzZSAiIgogICAgICAgIGlmIHN0eWxlLnN0YXJ0c3dpdGgoImhlYWRpbmciKToKICAgICAgICAgICAgbHZsID0gcmUuc3ViKHIiXEQiLCAiIiwgc3R5bGUpIG9yICIyIgogICAgICAgICAgICB0cnk6CiAgICAgICAgICAgICAgICBsdmwgPSBtaW4oaW50KGx2bCkgKyAxLCA2KQogICAgICAgICAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgICAgICAgICAgbHZsID0gMgogICAgICAgICAgICBvdXQuYXBwZW5kKCIjIiAqIGx2bCArICIgIiArIHQpCiAgICAgICAgZWxzZToKICAgICAgICAgICAgb3V0LmFwcGVuZCh0KQogICAgZm9yIHRpLCB0YWJsZSBpbiBlbnVtZXJhdGUoZC50YWJsZXMsIDEpOgogICAgICAgIHJvd3MgPSBbXQogICAgICAgIGZvciByaSwgcm93IGluIGVudW1lcmF0ZSh0YWJsZS5yb3dzKToKICAgICAgICAgICAgY2VsbHMgPSBbKGMudGV4dCBvciAiIikuc3RyaXAoKS5yZXBsYWNlKCJcbiIsICIgIikgZm9yIGMgaW4gcm93LmNlbGxzXQogICAgICAgICAgICByb3dzLmFwcGVuZCgifCAiICsgIiB8ICIuam9pbihjZWxscykgKyAiIHwiKQogICAgICAgICAgICBpZiByaSA9PSAwOgogICAgICAgICAgICAgICAgcm93cy5hcHBlbmQoInwiICsgIiAtLS0gfCIgKiBsZW4oY2VsbHMpKQogICAgICAgIGlmIHJvd3M6CiAgICAgICAgICAgIG91dC5hcHBlbmQoIiMjIyDooajmoLwgJWRcblxuJXMiICUgKHRpLCAiXG4iLmpvaW4ocm93cykpKQogICAgcmV0dXJuICJcblxuIi5qb2luKG91dCksIE5vbmUKCgpkZWYgZnJvbV9wcHR4KHBhdGgpOgogICAgZnJvbSBwcHR4IGltcG9ydCBQcmVzZW50YXRpb24KICAgIHBycyA9IFByZXNlbnRhdGlvbihwYXRoKQogICAgb3V0ID0gW10KICAgIG4gPSAwCiAgICBmb3IgaSwgc2xpZGUgaW4gZW51bWVyYXRlKHBycy5zbGlkZXMsIDEpOgogICAgICAgIG4gPSBpCiAgICAgICAgdGV4dHMgPSBbXQogICAgICAgIGZvciBzaGFwZSBpbiBzbGlkZS5zaGFwZXM6CiAgICAgICAgICAgIGlmIGdldGF0dHIoc2hhcGUsICJoYXNfdGV4dF9mcmFtZSIsIEZhbHNlKSBhbmQgc2hhcGUuaGFzX3RleHRfZnJhbWU6CiAgICAgICAgICAgICAgICB0ID0gKHNoYXBlLnRleHRfZnJhbWUudGV4dCBvciAiIikuc3RyaXAoKQogICAgICAgICAgICAgICAgaWYgdDoKICAgICAgICAgICAgICAgICAgICB0ZXh0cy5hcHBlbmQodCkKICAgICAgICBpZiB0ZXh0czoKICAgICAgICAgICAgb3V0LmFwcGVuZCgiIyMjIOW5u+eBr+eJhyAlZFxuXG4lcyIgJSAoaSwgIlxuXG4iLmpvaW4odGV4dHMpKSkKICAgIHJldHVybiAiXG5cbiIuam9pbihvdXQpLCBuCgoKZGVmIGZyb21fdGV4dChwYXRoKToKICAgIHdpdGggb3BlbihwYXRoLCAiciIsIGVuY29kaW5nPSJ1dGYtOCIsIGVycm9ycz0icmVwbGFjZSIpIGFzIGY6CiAgICAgICAgcmV0dXJuIGYucmVhZCgpLCBOb25lCgoKZGVmIG1haW4oKToKICAgICMgV2luZG93cyDmjqfliLblj7Dpu5jorqQgR0JL77yM5Lya5Zug55Sf5YO756ym5Y+3L+engeeUqOWMuuWtl+espuaKpemUme+8m+W8uuWItiBVVEYtOCDovpPlh7oKICAgIHRyeToKICAgICAgICBzeXMuc3Rkb3V0LnJlY29uZmlndXJlKGVuY29kaW5nPSJ1dGYtOCIsIGVycm9ycz0icmVwbGFjZSIpCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIHBhc3MKICAgIGlmIGxlbihzeXMuYXJndikgPCAyOgogICAgICAgIHByaW50KGpzb24uZHVtcHMoeyJvayI6IEZhbHNlLCAiZXJyb3IiOiAi57y65bCR5paH5Lu26Lev5b6EIn0sIGVuc3VyZV9hc2NpaT1GYWxzZSkpCiAgICAgICAgcmV0dXJuCiAgICBwID0gc3lzLmFyZ3ZbMV0KICAgIGlmIG5vdCBvcy5wYXRoLmlzZmlsZShwKToKICAgICAgICBwcmludChqc29uLmR1bXBzKHsib2siOiBGYWxzZSwgImVycm9yIjogIuaWh+S7tuS4jeWtmOWcqDogIiArIHB9LCBlbnN1cmVfYXNjaWk9RmFsc2UpKQogICAgICAgIHJldHVybgogICAgZXh0ID0gb3MucGF0aC5zcGxpdGV4dChwKVsxXS5sb3dlcigpCiAgICB0cnk6CiAgICAgICAgaWYgZXh0ID09ICIucGRmIjoKICAgICAgICAgICAgdGV4dCwgbiA9IGZyb21fcGRmKHApCiAgICAgICAgICAgIGtpbmQgPSAicGRmIgogICAgICAgIGVsaWYgZXh0ID09ICIuZG9jeCI6CiAgICAgICAgICAgIHRleHQsIG4gPSBmcm9tX2RvY3gocCkKICAgICAgICAgICAga2luZCA9ICJkb2N4IgogICAgICAgIGVsaWYgZXh0ID09ICIucHB0eCI6CiAgICAgICAgICAgIHRleHQsIG4gPSBmcm9tX3BwdHgocCkKICAgICAgICAgICAga2luZCA9ICJwcHR4IgogICAgICAgIGVsaWYgZXh0IGluICgiLnR4dCIsICIubWQiLCAiLmNzdiIpOgogICAgICAgICAgICB0ZXh0LCBuID0gZnJvbV90ZXh0KHApCiAgICAgICAgICAgIGtpbmQgPSAidGV4dCIKICAgICAgICBlbGlmIGV4dCBpbiAoIi5qcGciLCAiLmpwZWciLCAiLnBuZyIsICIud2VicCIsICIuZ2lmIiwgIi5ibXAiLCAiLnRpZiIsICIudGlmZiIpOgogICAgICAgICAgICB0ZXh0LCBuID0gIiIsIE5vbmUKICAgICAgICAgICAga2luZCA9ICJpbWFnZSIKICAgICAgICBlbGlmIGV4dCA9PSAiLmRvYyI6CiAgICAgICAgICAgIHByaW50KGpzb24uZHVtcHMoeyJvayI6IEZhbHNlLCAiZXJyb3IiOiAi5LiN5pSv5oyB5pen54mIIC5kb2PvvIzor7flj6blrZjkuLogLmRvY3gifSwgZW5zdXJlX2FzY2lpPUZhbHNlKSkKICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgZWxzZToKICAgICAgICAgICAgcHJpbnQoanNvbi5kdW1wcyh7Im9rIjogRmFsc2UsICJlcnJvciI6ICLmmoLkuI3mlK/mjIEgIiArIGV4dH0sIGVuc3VyZV9hc2NpaT1GYWxzZSkpCiAgICAgICAgICAgIHJldHVybgogICAgICAgIHByaW50KGpzb24uZHVtcHMoewogICAgICAgICAgICAib2siOiBUcnVlLCAia2luZCI6IGtpbmQsICJjaGFycyI6IGxlbih0ZXh0KSwgInBhZ2VzIjogbiwgInRleHQiOiB0ZXh0CiAgICAgICAgfSwgZW5zdXJlX2FzY2lpPUZhbHNlKSkKICAgIGV4Y2VwdCBFeGNlcHRpb24gYXMgZToKICAgICAgICBwcmludChqc29uLmR1bXBzKHsib2siOiBGYWxzZSwgImVycm9yIjogIiVzOiAlcyIgJSAodHlwZShlKS5fX25hbWVfXywgZSl9LCBlbnN1cmVfYXNjaWk9RmFsc2UpKQoKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICBtYWluKCkK";

const ACCEPT = [".pdf", ".docx", ".pptx", ".txt", ".md", ".csv", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"];

function extOf(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function safeName(name) {
  return String(name).replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim();
}

/* ============================================================
 * 导入弹窗
 * ============================================================ */

class ImportModal extends obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.files = [];
    this.busy = false;
  }

  onOpen() {
    const c = this.contentEl;
    c.addClass("d2n-modal");
    c.createEl("h3", { text: "导入文献 → Obsidian 笔记" });
    c.createEl("p", {
      cls: "d2n-hint",
      text: "支持 PDF / Word(.docx) / PPT(.pptx) / 图片 / 纯文本。原文件会复制进库，正文抽出来写成笔记，笔记落到收件箱，之后用「收件箱自动整理」分类。"
    });

    const drop = c.createDiv({ cls: "d2n-drop" });
    drop.createDiv({ cls: "d2n-drop-main", text: "把文件拖到这里" });
    drop.createDiv({ cls: "d2n-drop-sub", text: "或点下面的「选择文件」" });

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ACCEPT.join(",");
    input.style.display = "none";
    c.appendChild(input);

    input.onchange = () => {
      this.addFiles(Array.from(input.files || []));
      input.value = "";
    };

    drop.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      drop.addClass("is-over");
    });
    drop.addEventListener("dragleave", () => drop.removeClass("is-over"));
    drop.addEventListener("drop", (ev) => {
      ev.preventDefault();
      drop.removeClass("is-over");
      const dt = ev.dataTransfer;
      if (dt && dt.files) this.addFiles(Array.from(dt.files));
    });
    drop.addEventListener("click", () => input.click());

    this.listEl = c.createDiv({ cls: "d2n-list" });
    this.renderList();

    new obsidian.Setting(c)
      .setName("笔记放到")
      .setDesc("生成笔记落在这个文件夹，默认 Inbox；之后可用分类插件整理")
      .addText((t) =>
        t.setValue(this.plugin.settings.inboxFolder).onChange(async (v) => {
          this.plugin.settings.inboxFolder = v.trim() || DEFAULT_SETTINGS.inboxFolder;
          await this.plugin.saveSettings();
        })
      );

    const bar = c.createDiv({ cls: "d2n-bar" });
    const pick = bar.createEl("button", { text: "选择文件" });
    pick.onclick = () => input.click();

    this.convertBtn = bar.createEl("button", { text: "转换成 OB 笔记", cls: "mod-cta" });
    this.convertBtn.onclick = () => this.run();

    const close = bar.createEl("button", { text: "关闭" });
    close.onclick = () => this.close();

    this.logEl = c.createEl("pre", { cls: "d2n-log" });
    this.logEl.setText("等待选择文件…");
  }

  addFiles(files) {
    for (const f of files) {
      if (!ACCEPT.includes(extOf(f.name))) {
        this.log("跳过不支持的类型：" + f.name);
        continue;
      }
      if (!this.files.some((x) => x.name === f.name && x.size === f.size)) this.files.push(f);
    }
    this.renderList();
  }

  renderList() {
    if (!this.listEl) return;
    this.listEl.empty();
    if (!this.files.length) {
      this.listEl.createDiv({ cls: "d2n-empty", text: "还没有选择文件" });
      return;
    }
    for (const f of this.files) {
      const row = this.listEl.createDiv({ cls: "d2n-item" });
      row.createSpan({ cls: "d2n-item-name", text: f.name });
      row.createSpan({ cls: "d2n-item-size", text: " " + this.human(f.size) });
      const rm = row.createEl("button", { text: "×", cls: "d2n-remove" });
      rm.onclick = () => {
        this.files = this.files.filter((x) => x !== f);
        this.renderList();
      };
    }
  }

  human(n) {
    if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
    if (n > 1024) return (n / 1024).toFixed(0) + " KB";
    return n + " B";
  }

  log(msg) {
    if (!this.logEl) return;
    const old = this.logEl.getText ? this.logEl.getText() : "";
    console.log("[文献转笔记]", msg);
    this.logEl.setText(msg.startsWith("等待") ? msg : old + "\n" + msg);
    if (this.logEl.scrollTop !== undefined) this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  async run() {
    if (this.busy) return;
    if (!this.files.length) {
      new obsidian.Notice("先选择文件");
      return;
    }
    this.busy = true;
    this.convertBtn.disabled = true;
    this.convertBtn.setText("转换中…");
    this.logEl.setText("");
    this.log("开始转换 " + this.files.length + " 个文件");

    let ok = 0;
    for (const f of this.files) {
      try {
        const r = await this.plugin.convertOne(f, (m) => this.log(m));
        if (r && r.notePath) {
          ok++;
          this.log("✓ " + f.name + " → " + r.notePath + (r.res && r.res.chars ? "（" + r.res.chars + " 字）" : ""));
        }
      } catch (e) {
        this.log("✗ " + f.name + "：" + (e && e.message ? e.message : e));
      }
    }
    this.log("完成：成功 " + ok + " / " + this.files.length);
    new obsidian.Notice("已生成 " + ok + " 篇笔记，放在收件箱");
    this.busy = false;
    this.convertBtn.disabled = false;
    this.convertBtn.setText("转换成 OB 笔记");
    this.files = [];
    this.renderList();
  }

  onClose() {
    this.contentEl.empty();
  }
}

/* ============================================================
 * 设置页
 * ============================================================ */

class D2nSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const el = this.containerEl;
    el.empty();
    const ver = (this.plugin.manifest && this.plugin.manifest.version) || "";
    el.createEl("h2", { text: "文献转笔记" + (ver ? "  v" + ver : "") });

    new obsidian.Setting(el)
      .setName("笔记放到")
      .setDesc("生成的新笔记落在这个文件夹（默认收件箱，交给「收件箱自动整理」分类）")
      .addText((t) => t.setValue(this.plugin.settings.inboxFolder).onChange(async (v) => {
        this.plugin.settings.inboxFolder = v.trim() || DEFAULT_SETTINGS.inboxFolder;
        await this.plugin.saveSettings();
      }));

    new obsidian.Setting(el)
      .setName("原文件放到")
      .setDesc("PDF/Word 等原文件复制到这里，供笔记嵌入")
      .addText((t) => t.setValue(this.plugin.settings.assetFolder).onChange(async (v) => {
        this.plugin.settings.assetFolder = v.trim() || DEFAULT_SETTINGS.assetFolder;
        await this.plugin.saveSettings();
      }));

    new obsidian.Setting(el)
      .setName("Python 路径")
      .setDesc("留空自动探测。抽正文需要 python（含 pdfplumber / python-docx / python-pptx）")
      .addText((t) => t.setValue(this.plugin.settings.pythonPath).onChange(async (v) => {
        this.plugin.settings.pythonPath = v.trim();
        await this.plugin.saveSettings();
      }));

    new obsidian.Setting(el)
      .setName("转换完自动打开笔记")
      .addToggle((t) => t.setValue(this.plugin.settings.openAfter).onChange(async (v) => {
        this.plugin.settings.openAfter = v;
        await this.plugin.saveSettings();
      }));

    new obsidian.Setting(el)
      .setName("环境自检")
      .setDesc("检查 python、pdfplumber、转换脚本是否就绪")
      .addButton((b) => b.setButtonText("运行自检").onClick(() => this.plugin.selfCheck()));
  }
}

/* ============================================================
 * 插件主体
 * ============================================================ */

class Doc2NotePlugin extends obsidian.Plugin {
  async onload() {
    try {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
      this.addRibbonIcon("import", "导入文献转笔记", () => this.openImport());
      this.addCommand({ id: "d2n-import", name: "导入文献（PDF/Word/PPT/图片）并转为笔记", callback: () => this.openImport() });
      this.addCommand({ id: "d2n-check", name: "环境自检（python / 转换脚本）", callback: () => this.selfCheck() });
      this.addSettingTab(new D2nSettingTab(this.app, this));
    } catch (e) {
      console.error("[文献转笔记] onload 失败", e);
      new obsidian.Notice("文献转笔记启动失败：" + (e && e.message ? e.message : e));
      throw e;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  openImport() {
    new ImportModal(this.app, this).open();
  }

  /* ---------- 路径工具 ---------- */

  basePath() {
    try {
      const adapter = this.app.vault.adapter;
      if (adapter && typeof adapter.getBasePath === "function") return adapter.getBasePath();
    } catch (e) { /* ignore */ }
    return "";
  }

  abs(p) {
    return nodePath ? nodePath.join(this.basePath(), p) : p;
  }

  pluginFile(name) {
    const dir = (this.manifest && this.manifest.dir) || ".obsidian/plugins/doc2note";
    return this.abs(dir + "/" + name);
  }

  async ensureFolder(folder) {
    if (!folder) return;
    const parts = folder.split("/").filter(Boolean);
    let cur = "";
    for (const p of parts) {
      cur = cur ? cur + "/" + p : p;
      if (!this.app.vault.getAbstractFileByPath(cur)) {
        try {
          await this.app.vault.createFolder(cur);
        } catch (e) { /* 并发或已存在 */ }
      }
    }
  }

  async uniquePath(want) {
    if (!this.app.vault.getAbstractFileByPath(want)) return want;
    const dot = want.lastIndexOf(".");
    const stem = dot > 0 ? want.slice(0, dot) : want;
    const ext = dot > 0 ? want.slice(dot) : "";
    let n = 2;
    while (this.app.vault.getAbstractFileByPath(stem + " (" + n + ")" + ext)) n++;
    return stem + " (" + n + ")" + ext;
  }

  /* ---------- python ---------- */

  pythonCandidates() {
    const list = [];
    if (this.settings.pythonPath) list.push(this.settings.pythonPath);
    for (const c of ["python3", "python", "py"]) if (!list.includes(c)) list.push(c);
    return list;
  }

  pickPython() {
    const list = this.pythonCandidates();
    for (const c of list) {
      try {
        if (fs && nodePath && fs.existsSync(c)) return c;
      } catch (e) { /* ignore */ }
    }
    return list[list.length - 1];
  }

  ensureScript() {
    try {
      if (!fs || !nodePath) return null;
      const p = this.pluginFile("convert_lib.py");
      if (fs.existsSync(p)) return p;
      fs.mkdirSync(nodePath.dirname(p), { recursive: true });
      fs.writeFileSync(p, Buffer.from(PY_B64, "base64"));
      return p;
    } catch (e) {
      console.error("[文献转笔记] 写入转换脚本失败", e);
      return null;
    }
  }

  tryPython(py, script, absFile) {
    return new Promise((resolve, reject) => {
      execFile(
        py,
        [script, absFile],
        { maxBuffer: 64 * 1024 * 1024, windowsHide: true, encoding: "utf8", timeout: 180000 },
        (err, stdout, stderr) => {
          const out = String(stdout || "").trim();
          const last = out.split("\n").filter(Boolean).pop() || "";
          if (last) {
            try {
              return resolve(JSON.parse(last));
            } catch (e) { /* 落到下面 */ }
          }
          const msg = String(stderr || "").trim() || (err && err.message) || "转换进程没有输出";
          reject(new Error(msg.slice(0, 300)));
        }
      );
    });
  }

  async runConvert(absFile) {
    if (!execFile) throw new Error("当前环境不能调用本地进程（需要桌面版 Obsidian）");
    const script = this.ensureScript();
    if (!script) throw new Error("无法准备 convert_lib.py");

    let lastErr = null;
    for (const py of this.pythonCandidates()) {
      try {
        return await this.tryPython(py, script, absFile);
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("找不到可用的 python，请在插件设置里指定路径");
  }

  async selfCheck() {
    const lines = [];
    lines.push("python: " + this.pickPython());
    lines.push("脚本: " + (this.pluginFile("convert_lib.py") ? "已找到" : "缺失"));
    try {
      const r = await new Promise((resolve, reject) => {
        if (!execFile) return reject(new Error("无 execFile"));
        execFile(this.pickPython(), ["-c", "import sys,json;print(json.dumps({'v':sys.version.split()[0]}))"], { windowsHide: true, encoding: "utf8", timeout: 20000 }, (err, so, se) => {
          if (err) return reject(new Error(String(se || err.message).slice(0, 200)));
          resolve(so.trim());
        });
      });
      lines.push("python 版本: " + r);
    } catch (e) {
      lines.push("python 调用失败: " + (e.message || e));
    }
    const msg = lines.join("\n");
    console.log("[文献转笔记·自检]\n" + msg);
    new obsidian.Notice(msg, 12000);
  }

  /* ---------- 转换主流程 ---------- */

  async convertOne(file, log) {
    const inbox = this.settings.inboxFolder || DEFAULT_SETTINGS.inboxFolder;
    const assetDir = this.settings.assetFolder || DEFAULT_SETTINGS.assetFolder;
    const say = log || (() => { });

    await this.ensureFolder(assetDir);
    await this.ensureFolder(inbox);

    const buf = await file.arrayBuffer();
    const assetPath = await this.uniquePath(assetDir + "/" + safeName(file.name));
    await this.app.vault.createBinary(assetPath, buf);
    say("已复制原文件 → " + assetPath);

    let res = { ok: false, kind: "", text: "", chars: 0, error: "" };
    try {
      res = await this.runConvert(this.abs(assetPath));
      say("抽取完成：" + (res.ok ? (res.kind + "，" + (res.chars || 0) + " 字") : ("失败 " + res.error)));
    } catch (e) {
      res = { ok: false, text: "", chars: 0, error: e.message || String(e) };
      say("抽取失败：" + res.error);
    }

    const title = safeName(file.name).replace(/\.[^.]+$/, "");
    const notePath = await this.uniquePath(inbox + "/" + title + " - 导入.md");
    const md = this.buildNote({ title, fileName: file.name, assetPath, res });
    await this.app.vault.create(notePath, md);

    if (this.settings.openAfter) {
      const f = this.app.vault.getAbstractFileByPath(notePath);
      if (f) {
        try {
          await this.app.workspace.getLeaf(true).openFile(f);
        } catch (e) { /* ignore */ }
      }
    }
    return { notePath, res };
  }

  buildNote({ title, fileName, assetPath, res }) {
    const now = new Date().toLocaleString();
    const kind = res && res.kind ? res.kind : "未知";
    let body;
    if (res && res.ok && res.text && res.text.trim()) {
      body = res.text.trim();
    } else if (kind === "image") {
      body = "（图片文件，未做 OCR。）\n\n可以先对照图片手工摘录，或用系统截图工具转文字后粘贴到这里。";
    } else {
      body = "（没能抽出正文：" + ((res && res.error) || "未知原因") + "）\n\n原文件已附在下方，可对照阅读。";
    }

    const lines = [
      "---",
      'tags: ["类型/导入", "待分类"]',
      '来源文件: "' + fileName.replace(/"/g, "'") + '"',
      '转换方式: "' + kind + '"',
      '导入时间: "' + now + '"',
      "---",
      "",
      "# " + title,
      "",
      "> 📎 原文件",
      "> ![[".concat(assetPath, "]]"),
      "",
      "## 正文",
      "",
      body,
      "",
      "---",
      "",
      "> 这篇是导入稿：标题/标签还很粗，用命令「扫描收件箱，生成整理方案」把它归到合适目录。"
    ];
    return lines.join("\n");
  }
}

module.exports = Doc2NotePlugin;
module.exports.__test = { safeName, extOf };
