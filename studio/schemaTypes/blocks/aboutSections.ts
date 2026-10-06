import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {BookIcon} from '@sanity/icons/Book'
import {StarFilledIcon} from '@sanity/icons/StarFilled'
import {TagsIcon} from '@sanity/icons/Tags'
import {HeartIcon} from '@sanity/icons/Heart'
import {enabledField} from '../shared/fields'

const hiddenSuffix = (enabled?: boolean) => (enabled === false ? ' · hidden' : '')

export const experienceSection = defineType({
  name: 'experienceSection',
  title: 'Work experience',
  type: 'object',
  icon: CaseIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Work Experience'}),
    defineField({
      name: 'items',
      title: 'Experiences (drag to reorder)',
      type: 'array',
      description: 'Leave empty to show all enabled experiences ordered by their display order.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    }),
  ],
  preview: {select: {title: 'heading', enabled: 'enabled'}, prepare: ({title, enabled}) => ({title: title || 'Work experience', subtitle: `Experience${hiddenSuffix(enabled)}`})},
})

export const educationSection = defineType({
  name: 'educationSection',
  title: 'Education',
  type: 'object',
  icon: BookIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Education'}),
    defineField({
      name: 'items',
      title: 'Education (drag to reorder)',
      type: 'array',
      description: 'Leave empty to show all enabled entries.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'education'}]})],
    }),
  ],
  preview: {select: {title: 'heading', enabled: 'enabled'}, prepare: ({title, enabled}) => ({title: title || 'Education', subtitle: `Education${hiddenSuffix(enabled)}`})},
})

export const certificationsSection = defineType({
  name: 'certificationsSection',
  title: 'Certifications & courses',
  type: 'object',
  icon: StarFilledIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Certifications & Courses'}),
    defineField({
      name: 'items',
      title: 'Certifications (drag to reorder)',
      type: 'array',
      description: 'Leave empty to show all enabled certifications.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'certification'}]})],
    }),
  ],
  preview: {select: {title: 'heading', enabled: 'enabled'}, prepare: ({title, enabled}) => ({title: title || 'Certifications', subtitle: `Certifications${hiddenSuffix(enabled)}`})},
})

export const skillGroupsSection = defineType({
  name: 'skillGroupsSection',
  title: 'Core skills',
  type: 'object',
  icon: TagsIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Core Skills'}),
    defineField({name: 'groups', title: 'Skill groups (accordion)', type: 'array', of: [defineArrayMember({type: 'skillGroup'})]}),
  ],
  preview: {select: {title: 'heading', groups: 'groups', enabled: 'enabled'}, prepare: ({title, groups, enabled}) => ({title: title || 'Core skills', subtitle: `${groups?.length ?? 0} groups${hiddenSuffix(enabled)}`})},
})

export const hobbiesSection = defineType({
  name: 'hobbiesSection',
  title: 'Hobbies',
  type: 'object',
  icon: HeartIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'My Hobbies'}),
    defineField({name: 'items', title: 'Hobbies', type: 'array', of: [defineArrayMember({type: 'hobby'})]}),
  ],
  preview: {select: {title: 'heading', items: 'items', enabled: 'enabled'}, prepare: ({title, items, enabled}) => ({title: title || 'Hobbies', subtitle: `${items?.length ?? 0} hobbies${hiddenSuffix(enabled)}`})},
})
