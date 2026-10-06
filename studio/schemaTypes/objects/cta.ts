import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const cta = defineType({
  name: 'cta',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'Use /about for internal pages, #contact-form for anchors or https://... for external links.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'newTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
