import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'
import {enabledField, orderField} from '../shared/fields'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'role', title: 'Role / company', type: 'string'}),
    defineField({name: 'avatar', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'avatar'}},
})
