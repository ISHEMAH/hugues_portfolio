import {defineField, defineType} from 'sanity'
import {CodeIcon} from '@sanity/icons/Code'
import {enabledField, orderField} from '../shared/fields'

export const tool = defineType({
  name: 'tool',
  title: 'Tool / Skill',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'What I do with it', type: 'text', rows: 2}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: false}, description: 'Square logo, SVG or PNG'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: [
        {title: 'Design', value: 'design'},
        {title: 'Web development', value: 'development'},
        {title: 'Mobile development', value: 'mobile'},
        {title: 'Motion & 3D', value: 'motion'},
        {title: 'Productivity & AI', value: 'productivity'},
      ]},
      initialValue: 'design',
    }),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'logo', enabled: 'enabled'},
    prepare: ({title, subtitle, media, enabled}) => ({title, subtitle: `${subtitle ?? ''}${enabled === false ? ' · hidden' : ''}`, media}),
  },
})
