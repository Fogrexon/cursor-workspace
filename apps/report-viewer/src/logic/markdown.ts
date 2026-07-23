import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import { slugifyHeading } from './slug';

let hooksInstalled = false;

function ensurePurifyHooks(): void {
  if (hooksInstalled) return;
  // DOMPurify 3 は DOM clobbering 対策で id を落とす。見出し TOC 用に限って許可する。
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName === 'id' && /^H[1-6]$/.test(node.tagName)) {
      data.forceKeepAttr = true;
    }
  });
  hooksInstalled = true;
}

/**
 * Markdown をサニタイズ済み HTML にする。
 * 見出しには TOC と揃えた id を付与する。
 */
export function renderMarkdown(markdown: string): string {
  ensurePurifyHooks();
  const used = new Map<string, number>();
  const marked = new Marked();

  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens);
        const id = slugifyHeading(token.text, used);
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
      },
    },
  });

  const dirty = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
}
