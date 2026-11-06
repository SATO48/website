import { config } from '@keystatic/core';
import { documents, inspirationPackages } from './src/keystatic/collections';
import { announcement, filmChallenge, fivefest, home, notFound, resources, settings } from './src/keystatic/singletons';

export default config({
  // Production edits commit to GitHub, which triggers a Cloudflare rebuild. Locally, edits
  // write straight to disk; set PUBLIC_KEYSTATIC_STORAGE=github in .env to try GitHub mode
  // in dev (also how you create the Keystatic GitHub App the first time).
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: 'SATO48/website' }
      : { kind: 'local' },
  ui: {
    brand: { name: 'SATO48' },
    navigation: {
      Pages: ['home', 'filmChallenge', 'fivefest', 'resources', 'notFound'],
      'Rules & history': ['documents', 'inspirationPackages'],
      Site: ['announcement', 'settings'],
    },
  },
  singletons: { settings, announcement, home, filmChallenge, fivefest, resources, notFound },
  collections: { documents, inspirationPackages },
});
