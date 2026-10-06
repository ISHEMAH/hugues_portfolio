import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {anchorField, enabledField} from '../shared/fields'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Frequently Asked Questions'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'items', title: 'Questions', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
  ],
  preview: {
    select: {title: 'heading', items: 'items', enabled: 'enabled'},
    prepare: ({title, items, enabled}) => ({title: title || 'FAQ', subtitle: `${items?.length ?? 0} questions${enabled === false ? ' · hidden' : ''}`}),
  },
})
