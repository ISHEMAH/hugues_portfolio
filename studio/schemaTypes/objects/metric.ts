import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({name: 'value', title: 'Value', type: 'string', description: 'e.g. 4 or 25', validation: (rule) => rule.required()}),
    defineField({name: 'suffix', title: 'Suffix', type: 'string', description: 'e.g. + or %', initialValue: '+'}),
    defineField({name: 'label', title: 'Label', type: 'string', description: 'e.g. Years', validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {value: 'value', suffix: 'suffix', label: 'label'},
    prepare: ({value, suffix, label}) => ({title: `${value ?? ''}${suffix ?? ''} ${label ?? ''}`}),
  },
})
