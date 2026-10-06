import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {enabledField, imageWithAlt, orderField} from '../shared/fields'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'overview', title: 'Case overview'},
    {name: 'content', title: 'Case study content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'basics', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'basics', options: {source: 'title', maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      group: 'basics',
      options: {list: [{title: 'Case study (has its own page)', value: 'caseStudy'}, {title: 'Other work (links out or shows a summary)', value: 'project'}], layout: 'radio'},
      initialValue: 'caseStudy',
    }),
    enabledField,
    defineField({name: 'featured', title: 'Featured on home page', type: 'boolean', group: 'basics', initialValue: false}),
    orderField,
    defineField({name: 'category', title: 'Category', type: 'string', group: 'basics', description: 'Short label, e.g. Mobile App or SaaS Platform'}),
    defineField({name: 'timeline', title: 'Timeline', type: 'string', group: 'basics', description: 'e.g. 4 Months'}),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 3, group: 'basics', validation: (rule) => rule.max(220).warning('Keep it short for cards')}),
    defineField({
      name: 'tags',
      title: 'Tags (pills on cards)',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.max(4),
    }),
    imageWithAlt('thumbnail', 'Card image', 'Used on the home page stacked cards. Portrait or square works best.'),
    imageWithAlt('cover', 'Cover image', 'Wide image (16:9) used on the works page and at the top of the case study.'),
    defineField({name: 'externalUrl', title: 'Live link', type: 'url', group: 'basics'}),
    defineField({name: 'externalLabel', title: 'Live link label', type: 'string', group: 'basics', initialValue: 'Visit live site'}),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      group: 'basics',
      of: [defineArrayMember({type: 'string'})],
      options: {list: [
        {title: 'Product design', value: 'product-design'},
        {title: 'UI/UX', value: 'ui-ux'},
        {title: 'Mobile development', value: 'mobile-development'},
        {title: 'Web development', value: 'web-development'},
        {title: 'Branding', value: 'branding'},
        {title: 'Motion', value: 'motion'},
        {title: '3D', value: '3d'},
      ]},
    }),

    defineField({name: 'role', title: 'Role', type: 'string', group: 'overview'}),
    defineField({name: 'duration', title: 'Duration', type: 'string', group: 'overview'}),
    defineField({name: 'tools', title: 'Tools', type: 'string', group: 'overview', description: 'e.g. Figma, Flutter, Firebase'}),
    defineField({name: 'team', title: 'Team', type: 'string', group: 'overview'}),
    defineField({name: 'client', title: 'Client', type: 'string', group: 'overview'}),
    defineField({name: 'year', title: 'Year', type: 'string', group: 'overview'}),

    defineField({name: 'body', title: 'Case study content', type: 'caseStudyBody', group: 'content'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', kind: 'kind', enabled: 'enabled', featured: 'featured', media: 'thumbnail', cover: 'cover'},
    prepare: ({title, kind, enabled, featured, media, cover}) => ({
      title,
      subtitle: `${kind === 'project' ? 'Other work' : 'Case study'}${featured ? ' · featured' : ''}${enabled === false ? ' · hidden' : ''}`,
      media: media ?? cover,
    }),
  },
})
