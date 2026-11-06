// Field helpers shared by the Keystatic singletons and collections.
import { fields } from '@keystatic/core';

/** One-line text that must be filled in. */
export const text = (label: string, description?: string) =>
  fields.text({ label, description, validation: { isRequired: true } });

/** Optional one-line text. */
export const optionalText = (label: string, description?: string) => fields.text({ label, description });

/** Multi-line plain text (a paragraph without formatting). */
export const paragraph = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true, validation: { isRequired: true } });

/**
 * A display heading. Line breaks are kept, and *asterisks* mark the words drawn in the
 * accent color (see `heading()` in src/lib/content.ts).
 */
export const heading = (label: string, description = 'New lines become line breaks. Wrap words in *asterisks* to show them in the accent color.') =>
  fields.text({ label, description, multiline: true, validation: { isRequired: true } });

/** Rich text with bold, italic, links and lists; stored as Markdoc inside the entry's YAML. */
export const richText = (label: string, description?: string) =>
  fields.markdoc.inline({
    label,
    description,
    options: {
      heading: false,
      blockquote: false,
      code: false,
      codeBlock: false,
      divider: false,
      image: false,
      table: false,
    },
  });

export const href = (label = 'Link', description = 'A full URL (https://…), an email (mailto:…), or a page on this site starting with / (e.g. /film-challenge/).') =>
  fields.text({ label, description, validation: { isRequired: true } });

export const link = (label = 'Link') =>
  fields.object(
    {
      label: text('Label'),
      href: href('URL'),
    },
    { label },
  );

/** A link with an option to open in a new tab. */
export const navLink = (label = 'Link') =>
  fields.object(
    {
      label: text('Label'),
      href: href('URL'),
      newTab: fields.checkbox({ label: 'Open in a new tab', defaultValue: false }),
    },
    { label },
  );

export const seo = () =>
  fields.object(
    {
      title: text('Page title', 'Shown in the browser tab and in search results.'),
      description: fields.text({
        label: 'Description',
        description: 'One or two sentences for search results and link previews.',
        multiline: true,
        validation: { isRequired: true, length: { max: 200 } },
      }),
    },
    { label: 'Search & sharing' },
  );

/**
 * An image in public/images/<folder>. Keystatic names the file after the field's path, e.g.
 * home/archive/posters/0/image.jpg, and renames it if the field moves (say, a reordered list),
 * so use one folder per singleton.
 */
export const image = (label: string, folder: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/images/${folder}`,
    publicPath: `/images/${folder}/`,
    validation: { isRequired: true },
  });

export const accent = (label = 'Accent color', defaultValue: 'blue' | 'orange' | 'white' = 'blue') =>
  fields.select({
    label,
    options: [
      { label: 'Blue', value: 'blue' },
      { label: 'Orange', value: 'orange' },
      { label: 'White', value: 'white' },
    ],
    defaultValue,
  });

/** A list of label/value rows, e.g. event dates. */
export const facts = (label: string, description?: string) =>
  fields.array(
    fields.object({
      label: text('Label', 'e.g. Kickoff'),
      value: text('Value', 'e.g. Friday, April 23'),
    }),
    { label, description, itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}` },
  );

/** A simple list of one-line items. */
export const bullets = (label = 'Bullet points') =>
  fields.array(text('Bullet'), { label, itemLabel: (p) => p.value });
