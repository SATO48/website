// Read content edited in Keystatic (see keystatic.config.ts). Pages are prerendered, so this
// runs at build time (and on every request in dev, so Keystatic edits show on reload).
import { createReader } from '@keystatic/core/reader';
import type { Node } from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';
import { renderMarkdoc } from './markdoc';

const reader = createReader(process.cwd(), keystaticConfig);

type Config = typeof keystaticConfig;
type SingletonKey = keyof NonNullable<Config['singletons']>;
type CollectionKey = keyof NonNullable<Config['collections']>;

/**
 * Keystatic data with every Markdoc field rendered to an HTML string. (Keystatic bundles its
 * own Markdoc version, so match its nodes structurally.)
 */
export type Rendered<T> = T extends { node: { $$mdtype: 'Node' } }
  ? string
  : T extends readonly (infer U)[]
    ? Rendered<U>[]
    : T extends object
      ? { [K in keyof T]: Rendered<T[K]> }
      : T;

function render<T>(value: T): Rendered<T> {
  if (Array.isArray(value)) return value.map(render) as Rendered<T>;
  if (value && typeof value === 'object') {
    if ('node' in value && Object.keys(value).length === 1) return renderMarkdoc(value.node as Node) as Rendered<T>;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, render(v)])) as Rendered<T>;
  }
  return value as Rendered<T>;
}

export async function getSingleton<K extends SingletonKey>(key: K) {
  const data = await reader.singletons[key].readOrThrow({ resolveLinkedFiles: true });
  return render(data);
}

export async function getCollection<K extends CollectionKey>(key: K) {
  const entries = await reader.collections[key].all({ resolveLinkedFiles: true });
  return entries.map(({ slug, entry }) => Object.assign({ slug }, render(entry)));
}

/** The site-wide settings, read once per build. */
export const getSettings = () => getSingleton('settings');

/** Escape text for use inside set:html. */
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * HTML for a display heading field: line breaks become <br>, and *starred* words are wrapped
 * in a span with the given style (each page has its own accent treatment).
 */
export function heading(text: string, accentStyle = 'color: #FF6C00'): string {
  return escape(text.trim())
    .replace(/\*([^*]+)\*/g, `<span style="${accentStyle}">$1</span>`)
    .replace(/\r?\n/g, '<br>');
}

/** Rich text rendered for use inside an existing paragraph: drops a lone wrapping <p>. */
export function inline(html: string): string {
  const m = /^<p>([\s\S]*)<\/p>$/.exec(html.trim());
  return m && !m[1].includes('<p>') ? m[1] : html;
}

/** Hex colors for the `accent` select fields. */
export const accentColor = { blue: '#3996B1', orange: '#FF6C00', white: '#FFFFFF' } as const;
