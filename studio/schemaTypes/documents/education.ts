import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'
import {enabledField, orderField} from '../shared/fields'

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({name: 'degree', title: 'Degree / programme', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'institution', title: 'Institution', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'period', title: 'Period', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'degree', subtitle: 'institution', media: 'logo'}},
})
