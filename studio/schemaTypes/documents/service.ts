import {defineField, defineType} from 'sanity'
import {ComponentIcon} from '@sanity/icons/Component'
import {enabledField, orderField} from '../shared/fields'

export const SERVICE_ICONS = [
  {title: 'Pen (UI/UX)', value: 'pen'},
  {title: 'Cursor (Product)', value: 'cursor'},
  {title: 'Palette (Design system)', value: 'palette'},
  {title: 'Branch (Prototyping)', value: 'branch'},
  {title: 'Book (Research)', value: 'book'},
  {title: 'Brush (Brand)', value: 'brush'},
  {title: 'Smartphone (Mobile)', value: 'smartphone'},
  {title: 'Code (Web)', value: 'code'},
  {title: 'Layers', value: 'layers'},
  {title: 'Zap (Motion)', value: 'zap'},
  {title: 'Cube (3D)', value: 'cube'},
  {title: 'Sparkles (AI)', value: 'sparkles'},
]

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: SERVICE_ICONS}, initialValue: 'pen'}),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', icon: 'icon', enabled: 'enabled'},
    prepare: ({title, icon, enabled}) => ({title, subtitle: `${icon ?? ''}${enabled === false ? ' · hidden' : ''}`}),
  },
})
