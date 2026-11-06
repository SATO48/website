import { config, fields, collection } from '@keystatic/core';

export default config({
  // Production edits commit to GitHub, which triggers a Cloudflare rebuild. Locally, edits
  // write straight to disk; set PUBLIC_KEYSTATIC_STORAGE=github in .env to try GitHub mode
  // in dev (also how you create the Keystatic GitHub App the first time).
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: 'SATO48/website' }
      : { kind: 'local' },
  collections: {
    inspirationPackages: collection({
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
    }),
  },
});
