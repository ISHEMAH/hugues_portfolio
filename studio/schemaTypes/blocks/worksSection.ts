import {defineArrayMember, defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'
import {anchorField, enabledField} from '../shared/fields'

export const worksSection = defineType({
  name: 'worksSection',
  title: 'Selected works',
  type: 'object',
  icon: FolderIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'label', title: 'Small label', type: 'string', initialValue: 'Portfolio'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Selected Works', validation: (rule) => rule.required()}),
    defineField({
      name: 'projects',
      title: 'Featured projects (drag to reorder)',
      type: 'array',
      description: 'Up to 6 stacked cards. Leave empty to show featured projects automatically.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
      validation: (rule) => rule.max(6),
    }),
    defineField({name: 'cta', title: 'Button', type: 'cta', initialValue: {label: 'More Case Studies', href: '/works'}}),
  ],
  preview: {
    select: {title: 'heading', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title: title || 'Selected works', subtitle: `Works${enabled === false ? ' · hidden' : ''}`}),
  },
})
