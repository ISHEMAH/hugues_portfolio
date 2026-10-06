import {defineArrayMember, defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'
import {anchorField, enabledField} from '../shared/fields'

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Testimonials'}),
    defineField({name: 'subheading', title: 'Big statement', type: 'string', description: 'e.g. Design That Delivers - Globally'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials (drag to reorder)',
      type: 'array',
      description: 'Leave empty to show all enabled testimonials.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'flags',
      title: 'Floating flags / logos',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})]})],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: {title: 'heading', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title: title || 'Testimonials', subtitle: `Testimonials${enabled === false ? ' · hidden' : ''}`}),
  },
})
