import {defineField, defineType} from 'sanity'
import {TranslateIcon} from '@sanity/icons/Translate'

export const languageSkill = defineType({
  name: 'languageSkill',
  title: 'Language',
  type: 'object',
  icon: TranslateIcon,
  fields: [
    defineField({name: 'name', title: 'Language', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'level',
      title: 'Proficiency (0-100)',
      type: 'number',
      initialValue: 80,
      validation: (rule) => rule.required().min(0).max(100),
    }),
  ],
  preview: {select: {title: 'name', level: 'level'}, prepare: ({title, level}) => ({title, subtitle: `${level ?? 0}%`})},
})
