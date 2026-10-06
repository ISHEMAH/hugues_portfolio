import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const roleEntry = defineType({
  name: 'roleEntry',
  title: 'Role',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({name: 'title', title: 'Role title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'period', title: 'Period', type: 'string', description: 'e.g. Jan 2024 - Jan 2025', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'title', subtitle: 'period'}},
})
