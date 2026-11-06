import Markdoc, { type Config, type Node, type RenderableTreeNode } from '@markdoc/markdoc';

// Tags available to Keystatic content components (see documentComponents in
// src/keystatic/collections.ts).
const config: Config = {
  tags: {
    callout: {
      transform: (node, cfg) => new Markdoc.Tag('div', { class: 'doc-callout' }, node.transformChildren(cfg)),
    },
    sponsor: {
      selfClosing: true,
      attributes: { name: { type: String, required: true } },
      transform: (node) => new Markdoc.Tag('p', { class: 'sponsor' }, [`Sponsored by ${node.attributes.name}`]),
    },
  },
};

/** Render a Markdoc document (as returned by the Keystatic reader) to HTML. */
export function renderMarkdoc(node: Node): string {
  const tree = Markdoc.transform(node, config);
  // Markdoc wraps documents in <article>; the pages supply their own wrapper.
  const children: RenderableTreeNode[] = Markdoc.Tag.isTag(tree) && tree.name === 'article' ? tree.children : [tree];
  return Markdoc.renderers.html(children);
}
