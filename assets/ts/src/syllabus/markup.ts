// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: the document and its output formats   │
// ╰───────────────────────────────────────────────────────────────╯
// The generator builds the syllabus as a list of blocks. Text inside blocks uses a small inline
// markup, which is also Markdown:
//   **bold**, *italic*, ***both***, [text](https://url), and \x for a literal character x. Bare web and email
//   addresses become links.
//   {{Label}} is a placeholder for information that the instructor hasn't entered yet. It is
//   highlighted in the preview and in copied HTML, and written as [Label] in Markdown.
// The blocks are rendered as HTML for the preview, as HTML with inline styles for pasting into a
// learning management system (which strips <style> elements), and as Markdown.

export type Item = string | { text: string; items: Item[] };

export type Block =
  | { t: "h1" | "h2" | "h3" | "h4"; text: string; src?: string }
  | { t: "p"; text: string; src?: string; indent?: boolean }
  | { t: "ul" | "ol"; items: Item[]; src?: string }
  | { t: "kv"; rows: [string, Block[]][]; src?: string }            // A two-column table of labels and values
  | { t: "table"; head: string[]; rows: string[][]; src?: string };

// A Markdown link: [text](url). The URL may contain balanced parentheses, as in Wikipedia links.
const LINK_SOURCE = String.raw`\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)`;
const LINK = new RegExp(LINK_SOURCE, "g");

function escapeMarkup(text: string): string {
  return text.replace(/([\\*[\]{}`])/g, "\\$1");
}

// Escapes user text so that it is shown literally, except for Markdown links ([text](url)), which
// stay links, so that instructors can add links to any text they write.
export function esc(text: string): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    out += escapeMarkup(text.slice(last, m.index));
    out += `[${escapeMarkup(m[1])}](${m[2]})`;
    last = m.index! + m[0].length;
  }
  return out + escapeMarkup(text.slice(last));
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Only web and email links; an address that starts with "www." gets "https://".
function safeUrl(url: string): string | null {
  if (/^www\./i.test(url)) return `https://${url}`;
  return /^(https?:|mailto:)/i.test(url) ? url : null;
}

// Bold, italic, or both. An escaped character inside counts as one character, so "\*" doesn't
// end the emphasis. The content stays on one line.
const EMPH = String.raw`((?:\\.|[^\\\n])+?)`;
const EMPHASIS = String.raw`\\(.)|\*\*\*${EMPH}\*\*\*|\*\*${EMPH}\*\*|\*${EMPH}\*`;
const PLACEHOLDER = String.raw`\{\{(.+?)\}\}`;
// A bare web address, which may contain balanced parentheses (as in Wikipedia addresses) but
// doesn't end with punctuation, so "(see https://a.org/x)." links only https://a.org/x.
const BARE_URL = String.raw`(https?:\/\/(?:[^\s<>()]|\([^\s<>()]*\))*(?:[^\s<>().,;:!?'"]|\([^\s<>()]*\)))`;
const EMAIL = String.raw`([\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,})`;

// Groups: literal, bold italic, bold, italic, link text, link URL, placeholder, bare URL, email.
const INLINE = new RegExp([EMPHASIS, LINK_SOURCE, PLACEHOLDER, BARE_URL, EMAIL].join("|"), "g");
// Groups: literal, bold italic, bold, italic, link text, link URL, placeholder.
const PLAIN = new RegExp([EMPHASIS, LINK_SOURCE, PLACEHOLDER].join("|"), "g");

export type Flavor = "preview" | "lms";

export function inlineHtml(text: string, flavor: Flavor): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    out += escapeHtml(text.slice(last, m.index));
    last = m.index! + m[0].length;
    const [, literal, boldItalic, bold, italic, linkText, linkUrl, placeholder, bareUrl, email] = m;
    if (literal !== undefined) out += escapeHtml(literal);
    else if (boldItalic !== undefined) out += `<strong><em>${inlineHtml(boldItalic, flavor)}</em></strong>`;
    else if (bold !== undefined) out += `<strong>${inlineHtml(bold, flavor)}</strong>`;
    else if (italic !== undefined) out += `<em>${inlineHtml(italic, flavor)}</em>`;
    else if (linkText !== undefined) {
      const url = safeUrl(linkUrl);
      out += url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${inlineHtml(linkText, flavor).replace(/<\/?a\b[^>]*>/g, "")}</a>` : inlineHtml(linkText, flavor);
    } else if (placeholder !== undefined) {
      out += flavor === "preview"
        ? `<mark class="syl-ph">${escapeHtml(placeholder)}</mark>`
        : `<mark style="background: #fff3a8;">[${escapeHtml(placeholder)}]</mark>`;
    } else if (bareUrl !== undefined) {
      out += `<a href="${escapeHtml(bareUrl)}" target="_blank" rel="noopener">${escapeHtml(bareUrl)}</a>`;
    } else if (email !== undefined) {
      out += `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`;
    }
  }
  return out + escapeHtml(text.slice(last));
}

export function inlinePlain(text: string): string {
  return text.replace(PLAIN, (_, literal, boldItalic, bold, italic, linkText, linkUrl, placeholder) => {
    if (literal !== undefined) return literal;
    const emphasized = boldItalic ?? bold ?? italic;
    if (emphasized !== undefined) return inlinePlain(emphasized);
    if (linkText !== undefined) return `${inlinePlain(linkText)} (${linkUrl})`;
    return `[${placeholder}]`;
  });
}

function inlineMarkdown(text: string): string {
  return text.replace(/\{\{(.+?)\}\}/g, "\\[$1\\]");
}

// ⋘──────── HTML ────────⋙

const S = {
  th: "padding: 8px; text-align: right; vertical-align: top; background-color: #eeeeee; width: 30%; border: 1px solid #dddddd;",
  td: "padding: 8px; text-align: left; vertical-align: top; border: 1px solid #dddddd;",
  head: "padding: 8px; text-align: left; background-color: #eeeeee; border: 1px solid #dddddd;",
  table: "width: 100%; margin: 1em 0; border-collapse: collapse;",
};

function itemsHtml(tag: "ul" | "ol", items: Item[], flavor: Flavor): string {
  const lis = items.map(item => typeof item === "string"
    ? `<li>${inlineHtml(item, flavor)}</li>`
    : `<li>${inlineHtml(item.text, flavor)}${item.items.length ? itemsHtml("ul", item.items, flavor) : ""}</li>`);
  return `<${tag}>${lis.join("")}</${tag}>`;
}

function blockHtml(b: Block, flavor: Flavor): string {
  const lms = flavor === "lms";
  const src = !lms && b.src ? ` data-src="${b.src}"` : "";
  switch (b.t) {
    case "h1": case "h2": case "h3": case "h4":
      return `<${b.t}${src}>${inlineHtml(b.text, flavor)}</${b.t}>`;
    case "p":
      return `<p${src}${b.indent ? ` style="padding-left: 40px;"` : ""}>${inlineHtml(b.text, flavor)}</p>`;
    case "ul": case "ol":
      return itemsHtml(b.t, b.items, flavor).replace(/^<(ul|ol)>/, `<$1${src}>`);
    case "kv": {
      const rows = b.rows.map(([label, value]) => {
        const body = value.map(v => blockHtml(v, flavor)).join("");
        return lms
          ? `<tr><th style="${S.th}">${inlineHtml(label, flavor)}</th><td style="${S.td}">${body}</td></tr>`
          : `<tr><th>${inlineHtml(label, flavor)}</th><td>${body}</td></tr>`;
      });
      return lms
        ? `<table style="${S.table}"><tbody>${rows.join("")}</tbody></table>`
        : `<table class="syl-kv"${src}><tbody>${rows.join("")}</tbody></table>`;
    }
    case "table": {
      const head = b.head.map(h => lms ? `<th style="${S.head}">${inlineHtml(h, flavor)}</th>` : `<th>${inlineHtml(h, flavor)}</th>`).join("");
      const rows = b.rows.map(r => `<tr>${r.map(c => lms ? `<td style="${S.td}">${inlineHtml(c, flavor)}</td>` : `<td>${inlineHtml(c, flavor)}</td>`).join("")}</tr>`).join("");
      return lms
        ? `<table style="${S.table}"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`
        : `<table class="syl-table"${src}><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  }
}

export function toHtml(blocks: Block[], flavor: Flavor): string {
  return blocks.map(b => blockHtml(b, flavor)).join("\n");
}

// ⋘──────── Markdown ────────⋙

function itemsMarkdown(items: Item[], ordered: boolean, depth: number): string[] {
  const pad = "  ".repeat(depth);
  return items.flatMap((item, i) => {
    const marker = ordered ? `${i + 1}.` : "-";
    if (typeof item === "string") return [`${pad}${marker} ${inlineMarkdown(item)}`];
    return [`${pad}${marker} ${inlineMarkdown(item.text)}`, ...itemsMarkdown(item.items, false, depth + 1)];
  });
}

function cell(text: string): string {
  return inlineMarkdown(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function blockMarkdown(b: Block): string {
  switch (b.t) {
    case "h1": return `# ${inlineMarkdown(b.text)}`;
    case "h2": return `## ${inlineMarkdown(b.text)}`;
    case "h3": return `### ${inlineMarkdown(b.text)}`;
    case "h4": return `#### ${inlineMarkdown(b.text)}`;
    case "p": return inlineMarkdown(b.text);
    case "ul": case "ol": return itemsMarkdown(b.items, b.t === "ol", 0).join("\n");
    case "kv":
      return b.rows.map(([label, value]) => {
        if (value.length === 1 && value[0].t === "p") return `**${inlineMarkdown(label)}:** ${inlineMarkdown(value[0].text)}`;
        return [`**${inlineMarkdown(label)}:**`, ...value.map(blockMarkdown)].join("\n\n");
      }).join("\n\n");
    case "table":
      return [
        `| ${b.head.map(cell).join(" | ")} |`,
        `| ${b.head.map(() => "---").join(" | ")} |`,
        ...b.rows.map(r => `| ${r.map(cell).join(" | ")} |`),
      ].join("\n");
  }
}

export function toMarkdown(blocks: Block[]): string {
  return blocks.map(blockMarkdown).join("\n\n") + "\n";
}

// ⋘──────── Plain text (for the clipboard's plain-text copy) ────────⋙

function itemsPlain(items: Item[], ordered: boolean, depth: number): string[] {
  const pad = "  ".repeat(depth);
  return items.flatMap((item, i) => {
    const marker = ordered ? `${i + 1}.` : "•";
    if (typeof item === "string") return [`${pad}${marker} ${inlinePlain(item)}`];
    return [`${pad}${marker} ${inlinePlain(item.text)}`, ...itemsPlain(item.items, false, depth + 1)];
  });
}

function blockPlain(b: Block): string {
  switch (b.t) {
    case "h1": case "h2": return inlinePlain(b.text).toUpperCase();
    case "h3": case "h4": return inlinePlain(b.text);
    case "p": return inlinePlain(b.text);
    case "ul": case "ol": return itemsPlain(b.items, b.t === "ol", 0).join("\n");
    case "kv": return b.rows.map(([label, value]) => `${inlinePlain(label)}: ${value.map(blockPlain).join("\n")}`).join("\n");
    case "table": return [b.head, ...b.rows].map(r => r.map(inlinePlain).join("\t")).join("\n");
  }
}

export function toPlain(blocks: Block[]): string {
  return blocks.map(blockPlain).join("\n\n") + "\n";
}

// ⋘──────── Text that instructors write ────────⋙
// Paragraphs are separated by blank lines; lines starting with "- ", "* ", or "• " are bullets,
// and lines starting with a number and a period or parenthesis ("1. " or "1) ") are numbered.

export function textBlocks(text: string, src?: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of text.trim().split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    let para: string[] = [];
    let list: string[] = [];
    let listType: "ul" | "ol" = "ul";
    const flushPara = () => { if (para.length) blocks.push({ t: "p", text: para.join(" "), src }); para = []; };
    const flushList = () => { if (list.length) blocks.push({ t: listType, items: list, src }); list = []; };
    for (const line of lines) {
      const bullet = /^[-*•]\s+(.*)$/.exec(line);
      const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
      const item = bullet ?? numbered;
      if (item) {
        const type = bullet ? "ul" : "ol";
        flushPara();
        if (type !== listType) flushList();
        listType = type;
        list.push(item[1]);
      } else {
        flushList();
        para.push(line);
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}
