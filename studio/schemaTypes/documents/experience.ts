import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {enabledField, orderField} from '../shared/fields'

export const experience = defineType({
  name: 'experience',
  title: 'Work experience',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({name: 'company', title: 'Company', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'logo', title: 'Company logo', type: 'image'}),
    defineField({
      name: 'roles',
      title: 'Roles',
      description: 'Add several roles to show a timeline inside the company.',
      type: 'array',
      of: [defineArrayMember({type: 'roleEntry'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({name: 'period', title: 'Overall period', type: 'string', description: 'e.g. Nov 2025 to June 2026', validation: (rule) => rule.required()}),
    defineField({name: 'employmentType', title: 'Type', type: 'string', description: 'Contract, Freelance, Internship...'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'highlights', title: 'Highlights', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    enabledField,
    orderField,
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'company', period: 'period', media: 'logo', enabled: 'enabled', roles: 'roles'},
    prepare: ({title, period, media, enabled, roles}) => ({
      title,
      subtitle: `${roles?.[0]?.title ?? ''} · ${period ?? ''}${enabled === false ? ' · hidden' : ''}`,
      media,
    }),
  },
})
