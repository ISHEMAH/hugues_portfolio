import {defineArrayMember, defineField, defineType} from 'sanity'
import {CodeIcon} from '@sanity/icons/Code'
import {anchorField, enabledField} from '../shared/fields'

export const skillsSection = defineType({
  name: 'skillsSection',
  title: 'Tools & expertise',
  type: 'object',
  icon: CodeIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'label', title: 'Small label', type: 'string', initialValue: 'Expertise'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'tools',
      title: 'Tools (drag to reorder)',
      type: 'array',
      description: 'Leave empty to show all enabled tools.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tool'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title: title || 'Tools', subtitle: `Tools & expertise${enabled === false ? ' · hidden' : ''}`}),
  },
})
