import {defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'

export const processStep = defineType({
  name: 'processStep',
  title: 'Process step',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({name: 'label', title: 'Step', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {list: [{title: 'Completed', value: 'done'}, {title: 'Current', value: 'current'}, {title: 'Upcoming', value: 'upcoming'}], layout: 'radio'},
      initialValue: 'done',
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'state'}},
})
