import {defineField, defineType} from 'sanity'
import {StarFilledIcon} from '@sanity/icons/StarFilled'
import {enabledField, orderField} from '../shared/fields'

export const certification = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: StarFilledIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'issuer', title: 'Issuer', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'duration', title: 'Duration / date', type: 'string'}),
    defineField({name: 'credentialUrl', title: 'Credential link', type: 'url'}),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'issuer', media: 'logo'}},
})
