import {defineArrayMember, defineField, defineType} from 'sanity'
import {ArrowRightIcon} from '@sanity/icons/ArrowRight'
import {enabledField} from '../shared/fields'

export const tickerSection = defineType({
  name: 'tickerSection',
  title: 'Scrolling ticker',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    enabledField,
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.min(3),
    }),
  ],
  preview: {
    select: {items: 'items', enabled: 'enabled'},
    prepare: ({items, enabled}) => ({title: 'Scrolling ticker', subtitle: `${(items ?? []).slice(0, 4).join(' · ')}${enabled === false ? ' · hidden' : ''}`}),
  },
})
