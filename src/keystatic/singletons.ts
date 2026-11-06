// One-off content: site-wide settings and each page's copy.
import { fields, singleton, type ComponentSchema } from '@keystatic/core';
import {
  accent,
  bullets,
  facts,
  heading,
  href,
  image,
  link,
  navLink,
  optionalText,
  paragraph,
  richText,
  seo,
  text,
} from './fields';

type Fields = Record<string, ComponentSchema>;

const section = <T extends Fields>(label: string, schema: T, description?: string) =>
  fields.object(schema, { label, description });

export const settings = singleton({
  label: 'Site settings',
  path: 'src/content/site/settings',
  schema: {
    siteName: text('Site name'),
    defaultDescription: paragraph('Default description', 'Used for search results and link previews when a page has none.'),
    shareImageAlt: text('Share image description', 'Alt text for the image shown when a link is shared (public/og.jpg).'),
    logo: image('Logo', 'site', 'Shown in the menu and footer, and used as the browser tab icon.'),
    logoAlt: text('Logo description'),
    organization: section('Organization', {
      legalName: text('Full name'),
      email: text('Contact email'),
      foundingYear: text('Founded'),
      city: text('City'),
      region: text('State'),
    }, 'Used for search engines (structured data).'),
    nav: section('Top menu', {
      links: fields.array(link('Menu link'), {
        label: 'Menu links',
        itemLabel: (p) => p.fields.label.value,
      }),
      button: link('Button'),
    }),
    footer: section('Footer', {
      tagline: paragraph('Tagline'),
      columns: fields.array(
        fields.object({
          heading: text('Heading'),
          links: fields.array(navLink(), { label: 'Links', itemLabel: (p) => p.fields.label.value }),
        }),
        { label: 'Link columns', itemLabel: (p) => p.fields.heading.value },
      ),
      copyright: text('Copyright line'),
    }),
  },
});

export const announcement = singleton({
  label: 'Announcement bar',
  path: 'src/content/site/announcement',
  schema: {
    show: fields.checkbox({ label: 'Show the announcement bar', description: 'Shown above the menu on the home page.' }),
    text: text('Message'),
    button: link('Button'),
  },
});

export const home = singleton({
  label: 'Home',
  path: 'src/content/pages/home',
  schema: {
    seo: seo(),
    hero: section('Hero', {
      eyebrow: text('Label above the headline'),
      headline: heading('Headline'),
      intro: paragraph('Intro'),
      primaryButton: link('Primary button'),
      secondaryButton: link('Secondary button'),
      background: image('Background photo', 'home'),
      logo: image('Logo artwork', 'home'),
      logoAlt: text('Logo description'),
    }),
    programs: section('Programs', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      cards: fields.array(
        fields.object({
          accent: accent('Color'),
          eyebrow: optionalText('Label', 'Small label above the title. Leave empty if the card shows a logo.'),
          logo: fields.image({
            label: 'Logo',
            description: 'Optional; shown instead of the label.',
            directory: 'public/images/home',
            publicPath: '/images/home/',
          }),
          logoAlt: optionalText('Logo description'),
          title: text('Title'),
          body: paragraph('Text'),
          links: fields.array(
            fields.object({
              label: text('Label'),
              href: href('URL'),
              highlight: fields.checkbox({ label: 'Show in orange' }),
            }),
            { label: 'Links', itemLabel: (p) => p.fields.label.value },
          ),
        }),
        { label: 'Cards', itemLabel: (p) => p.fields.title.value },
      ),
    }),
    archive: section('Archive', {
      headline: heading('Headline'),
      body: paragraph('Text'),
      button: link('Button'),
      years: fields.array(text('Label'), { label: 'Year chips', itemLabel: (p) => p.value }),
      postersLink: href('Posters link', 'Where the poster collage links to.'),
      posters: fields.array(
        fields.object({
          image: image('Poster', 'home', 'Portrait, 2:3.'),
          alt: text('Description', 'e.g. Kitchen Heat poster (2026 Best Film)'),
        }),
        { label: 'Posters', description: 'Shown as a tilted collage, four per row.', itemLabel: (p) => p.fields.alt.value },
      ),
    }),
    yearRound: section('Year-round screenings', {
      headline: heading('Headline'),
      body: paragraph('Text'),
      logo: image('Logo', 'home'),
      logoAlt: text('Logo description'),
    }),
    partners: section('Partners', {
      heading: text('Heading'),
      intro: text('Intro'),
      logos: fields.array(
        fields.object({
          image: image('Logo', 'home'),
          alt: text('Partner name'),
          invert: fields.checkbox({ label: 'Invert colors', description: 'For white logos that would disappear on the white background.' }),
        }),
        { label: 'Logos', itemLabel: (p) => p.fields.alt.value },
      ),
    }),
  },
});

const pageHeader = <T extends Fields>(extra: T = {} as T) =>
  section('Page header', {
    eyebrow: text('Label above the title'),
    title: text('Title'),
    intro: paragraph('Intro'),
    ...extra,
  });

const summaryCards = (label: string) =>
  fields.array(
    fields.object({ title: text('Title'), points: bullets() }),
    { label, itemLabel: (p) => p.fields.title.value },
  );

export const filmChallenge = singleton({
  label: 'Film Challenge',
  path: 'src/content/pages/film-challenge',
  schema: {
    seo: seo(),
    header: pageHeader({ breadcrumb: text('Breadcrumb label', 'The page name in the Home / … trail.') }),
    event: section('Event card', {
      label: text('Label', 'e.g. SATO48-2027'),
      dates: facts('Dates'),
      button: link('Button'),
      guidelinesLabel: text('Guidelines link label', 'Jumps to the guidelines summary on this page.'),
    }),
    steps: section('How the weekend works', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      items: fields.array(
        fields.object({ accent: accent('Number color'), title: text('Title'), body: paragraph('Text') }),
        { label: 'Steps', description: 'Numbered in order.', itemLabel: (p) => p.fields.title.value },
      ),
    }),
    ceremony: section('Awards ceremony', {
      photo: image('Photo', 'film-challenge', 'Landscape, 4:3.'),
      photoAlt: text('Photo description'),
      eyebrow: text('Label'),
      heading: heading('Heading'),
      body: paragraph('Text'),
      date: text('Date line'),
    }),
    inspiration: section('Inspiration Package', {
      eyebrow: text('Label'),
      heading: heading('Heading'),
      body: paragraph('Text'),
      link: link('Link'),
      packageLabel: text('Package label', 'e.g. SATO48-2026 Inspiration Package'),
      packageTitle: text('Package title'),
      elements: richText('Elements', 'Use a numbered list. Bold text is highlighted.'),
      prohibition: richText('Prohibition', 'Shown under the elements, after a divider. Leave empty to hide.'),
    }),
    guidelines: section('Guidelines summary', {
      eyebrow: text('Label'),
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      cards: summaryCards('Cards'),
      links: fields.array(link(), { label: 'Links below the cards', itemLabel: (p) => p.fields.label.value }),
    }),
    awards: section('Awards', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      items: fields.array(
        fields.object({
          name: text('Award'),
          description: paragraph('Criteria'),
          color: fields.select({
            label: 'Name color',
            options: [
              { label: 'White', value: 'white' },
              { label: 'Orange', value: 'orange' },
              { label: 'Blue', value: 'blue' },
            ],
            defaultValue: 'white',
          }),
        }),
        { label: 'Awards', itemLabel: (p) => p.fields.name.value },
      ),
      link: link('Link after the awards'),
    }),
    prizes: section('Sponsored prizes', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      items: fields.array(
        fields.object({ name: text('Prize'), sponsor: text('Sponsor'), description: paragraph('Description') }),
        { label: 'Prizes', itemLabel: (p) => `${p.fields.name.value} (${p.fields.sponsor.value})` },
      ),
      link: link('Link after the prizes'),
    }),
  },
});

export const fivefest = singleton({
  label: 'FiveFest',
  path: 'src/content/pages/fivefest',
  schema: {
    seo: seo(),
    header: section('Page header', {
      logo: image('Logo', 'fivefest'),
      title: text('Title'),
      intro: paragraph('Intro'),
    }),
    status: section('Status card', {
      label: text('Status', 'e.g. 2026 submissions are closed'),
      dates: facts('Dates'),
      button: link('Button'),
      guidelinesLabel: text('Guidelines link label', 'Jumps to the guidelines on this page.'),
    }),
    photo: section('Photo', {
      image: image('Photo', 'fivefest', 'Wide, 21:9.'),
      alt: text('Description'),
      caption: optionalText('Caption'),
    }),
    stats: fields.array(
      fields.object({ value: text('Number', 'e.g. 5:00'), label: text('Text'), accent: accent('Color') }),
      { label: 'Stats', itemLabel: (p) => `${p.fields.value.value}: ${p.fields.label.value}` },
    ),
    guidelines: section('Guidelines', {
      eyebrow: text('Label'),
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      cards: summaryCards('Cards'),
    }),
    genres: section('Genres', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
      items: fields.array(
        fields.object({ name: text('Genre'), criteria: bullets('What the judges look for') }),
        { label: 'Genres', itemLabel: (p) => p.fields.name.value },
      ),
      link: link('Link after the genres'),
    }),
    tiers: section('Acceptance levels', {
      heading: heading('Heading'),
      items: fields.array(
        fields.object({
          eyebrow: text('Label'),
          title: text('Title'),
          body: paragraph('Text'),
          featured: fields.checkbox({ label: 'Highlight this level' }),
        }),
        { label: 'Levels', itemLabel: (p) => p.fields.title.value },
      ),
      note: optionalText('Note below the levels'),
    }),
    dates: section('Dates & venue', {
      heading: heading('Heading'),
      items: facts('Rows'),
    }),
    finePrint: section('Fine print', {
      heading: heading('Heading'),
      body: richText('Text', 'A bulleted list; start each item with a bold label.'),
      contact: richText('Contact line'),
      link: link('Link'),
    }),
  },
});

export const resources = singleton({
  label: 'Resources',
  path: 'src/content/pages/resources',
  schema: {
    seo: seo(),
    header: pageHeader({
      packagesLinkLabel: text('“Inspiration Packages” jump link'),
      documentsLinkLabel: text('“Documents” jump link'),
    }),
    packages: section('Inspiration Packages', {
      heading: heading('Heading'),
      intro: paragraph('Intro'),
    }),
    documents: section('Documents', {
      eyebrow: text('Label'),
      heading: heading('Heading'),
      intro: paragraph('Intro'),
    }, 'The cards list every document marked “Show on the Resources page”, in their set order.'),
  },
});

export const notFound = singleton({
  label: 'Page not found (404)',
  path: 'src/content/pages/not-found',
  schema: {
    seo: seo(),
    badge: text('Label above the headline'),
    headline: heading('Headline'),
    message: paragraph('Message'),
    primaryButton: link('Primary button'),
    secondaryButton: link('Secondary button'),
    shortcutsLabel: text('Shortcuts label', 'e.g. Or cut to:'),
    shortcuts: fields.array(link(), { label: 'Shortcuts', itemLabel: (p) => p.fields.label.value }),
    slate: section('Clapperboard', {
      production: text('Production'),
      director: text('Director'),
      status: text('Status'),
    }),
    filmStripCaption: text('Caption under the film strip'),
  },
});
