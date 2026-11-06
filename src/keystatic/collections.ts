// Repeatable content: Inspiration Packages and the long-form rules documents.
import { collection, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';
import { text } from './fields';

export const inspirationPackages = collection({
  label: 'Inspiration Packages',
  slugField: 'year',
  path: 'src/content/inspiration-packages/*',
  format: 'yaml',
  columns: ['year', 'theme'],
  schema: {
    year: fields.slug({
      name: {
        label: 'Year',
        description: 'The SATO48 year, e.g. 2026.',
        validation: { isRequired: true, pattern: { regex: /^\d{4}$/, message: 'Use a four-digit year.' } },
      },
    }),
    theme: fields.text({
      label: 'Theme',
      description: 'Short caption shown under the package on the Resources page.',
      validation: { isRequired: true },
    }),
    thumbnail: fields.image({
      label: 'Thumbnail',
      description: 'Cover image shown in the Resources grid (portrait, 17:22).',
      directory: 'public/images/inspiration-packages',
      publicPath: '/images/inspiration-packages/',
      validation: { isRequired: true },
    }),
    fullSize: fields.image({
      label: 'Full-size package',
      description: 'Opened in a new tab when someone selects the thumbnail.',
      directory: 'public/images/inspiration-packages',
      publicPath: '/images/inspiration-packages/',
      validation: { isRequired: true },
    }),
  },
});

/** Content components available in document bodies; rendered by src/lib/markdoc.ts. */
export const documentComponents = {
  callout: wrapper({
    label: 'Boxed section',
    description: 'A white box, e.g. for a form letter.',
    schema: {},
  }),
  sponsor: block({
    label: 'Sponsor line',
    description: 'Small caps “Sponsored by …” line under a prize name.',
    schema: { name: fields.text({ label: 'Sponsor', validation: { isRequired: true } }) },
    ContentView: ({ value }) => `Sponsored by ${value.name}`,
  }),
};

export const documents = collection({
  label: 'Documents',
  slugField: 'title',
  path: 'src/content/documents/*',
  format: { contentField: 'body' },
  entryLayout: 'content',
  previewUrl: '/resources/{slug}/',
  columns: ['title', 'year', 'program'],
  schema: {
    title: fields.slug({
      name: { label: 'Title', description: 'e.g. Challenge Guidelines', validation: { isRequired: true } },
      slug: {
        label: 'URL',
        description: 'The page lives at /resources/<this>/. Changing it breaks existing links.',
      },
    }),
    year: fields.text({
      label: 'Year',
      validation: { isRequired: true, pattern: { regex: /^\d{4}$/, message: 'Use a four-digit year.' } },
    }),
    program: fields.select({
      label: 'Program',
      options: [
        { label: 'Film Challenge', value: 'Film Challenge' },
        { label: 'FiveFest', value: 'FiveFest' },
      ],
      defaultValue: 'Film Challenge',
    }),
    eyebrow: text('Label above the title', 'e.g. Film Challenge · SATO48-2026'),
    intro: fields.markdoc.inline({
      label: 'Intro',
      description: 'Shown under the title.',
      options: { heading: false, blockquote: false, code: false, codeBlock: false, divider: false, image: false, table: false },
    }),
    summary: text('Summary', 'One sentence for the card on the Resources page.'),
    description: fields.text({
      label: 'Search description',
      description: 'One or two sentences for search results and link previews.',
      multiline: true,
      validation: { isRequired: true, length: { max: 200 } },
    }),
    showOnResources: fields.checkbox({ label: 'Show on the Resources page', defaultValue: true }),
    order: fields.integer({
      label: 'Order on the Resources page',
      description: 'Lower numbers come first.',
      defaultValue: 10,
      validation: { isRequired: true },
    }),
    body: fields.markdoc({
      label: 'Body',
      components: documentComponents,
      options: { image: false },
    }),
  },
});
