import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagsIcon} from '@sanity/icons/Tags'

export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Skill group',
  type: 'object',
  icon: TagsIcon,
  fields: [
    defineField({name: 'title', title: 'Group title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'items',
      title: 'Skills',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare: ({title, items}) => ({title, subtitle: `${items?.length ?? 0} skills`}),
  },
})
