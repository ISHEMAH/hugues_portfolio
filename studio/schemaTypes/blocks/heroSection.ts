import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'
import {anchorField, enabledField, imageWithAlt} from '../shared/fields'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'eyebrow', title: 'Small title', type: 'string', description: 'e.g. Product Designer & Developer'}),
    defineField({name: 'headline', title: 'Headline', type: 'string', description: 'e.g. I design things that', validation: (rule) => rule.required()}),
    defineField({
      name: 'typewriterWords',
      title: 'Typewriter words',
      type: 'array',
      description: 'Words typed after the headline, one after the other.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4}),
    defineField({
      name: 'ctaMode',
      title: 'Button behaviour',
      type: 'string',
      options: {list: [{title: 'Download the resume from Site Settings', value: 'resume'}, {title: 'Custom link', value: 'custom'}, {title: 'No button', value: 'none'}], layout: 'radio'},
      initialValue: 'resume',
    }),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string', initialValue: 'Download Resume'}),
    defineField({name: 'cta', title: 'Custom link', type: 'cta', hidden: ({parent}) => parent?.ctaMode !== 'custom'}),
    imageWithAlt('portrait', 'Portrait', 'Shown on the dark right-hand panel. A cut-out or a bold portrait works best.'),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [defineArrayMember({type: 'metric'})],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {title: 'headline', enabled: 'enabled', media: 'portrait'},
    prepare: ({title, enabled, media}) => ({title: title || 'Hero', subtitle: `Hero${enabled === false ? ' · hidden' : ''}`, media}),
  },
})
