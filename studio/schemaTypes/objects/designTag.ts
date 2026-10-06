import {defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons/Sparkles'

export const TAG_ICONS = [
  {title: 'Alignment', value: 'alignment'},
  {title: 'Colors', value: 'colors'},
  {title: 'Consistency', value: 'consistency'},
  {title: 'Typography', value: 'typography'},
  {title: 'Visual cues', value: 'visual-cues'},
  {title: 'Hierarchy', value: 'hierarchy'},
  {title: 'Proximity', value: 'proximity'},
  {title: 'Code', value: 'code'},
  {title: 'Mobile', value: 'mobile'},
  {title: 'Performance', value: 'performance'},
  {title: 'Accessibility', value: 'accessibility'},
  {title: 'Motion', value: 'motion'},
]

export const designTag = defineType({
  name: 'designTag',
  title: 'Principle',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: TAG_ICONS}, initialValue: 'alignment'}),
  ],
  preview: {select: {title: 'label', subtitle: 'icon'}},
})
