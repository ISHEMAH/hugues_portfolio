import {defineField, defineType} from 'sanity'
import {HeartIcon} from '@sanity/icons/Heart'

export const hobby = defineType({
  name: 'hobby',
  title: 'Hobby',
  type: 'object',
  icon: HeartIcon,
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'image', title: 'Illustration', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'label', media: 'image'}},
})
