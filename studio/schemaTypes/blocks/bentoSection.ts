import {defineArrayMember, defineField, defineType} from 'sanity'
import {DashboardIcon} from '@sanity/icons/Dashboard'
import {anchorField, enabledField} from '../shared/fields'

export const bentoSection = defineType({
  name: 'bentoSection',
  title: 'Bento grid',
  type: 'object',
  icon: DashboardIcon,
  groups: [
    {name: 'thinking', title: 'Design thinking'},
    {name: 'craft', title: 'Craftsmanship'},
    {name: 'experience', title: 'Experience'},
    {name: 'collab', title: 'Collaboration'},
    {name: 'shipped', title: 'Shipped'},
    {name: 'languages', title: 'Languages'},
    {name: 'process', title: 'Process'},
  ],
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'thinkingTitle', title: 'Title', type: 'string', group: 'thinking', initialValue: 'Design Thinking & Craft'}),
    defineField({
      name: 'principles',
      title: 'Principles (scrolling row)',
      type: 'array',
      group: 'thinking',
      of: [defineArrayMember({type: 'designTag'})],
    }),
    defineField({name: 'showThinking', title: 'Show card', type: 'boolean', group: 'thinking', initialValue: true}),

    defineField({name: 'craftTitle', title: 'Title', type: 'string', group: 'craft', initialValue: 'Craftmanship'}),
    defineField({name: 'craftQuote', title: 'Statement', type: 'text', rows: 2, group: 'craft'}),
    defineField({name: 'showCraft', title: 'Show card', type: 'boolean', group: 'craft', initialValue: true}),

    defineField({name: 'experienceLabel', title: 'Label', type: 'string', group: 'experience', initialValue: 'Experience'}),
    defineField({name: 'experienceMetric', title: 'Big number', type: 'metric', group: 'experience'}),
    defineField({name: 'experienceTitle', title: 'Title', type: 'string', group: 'experience'}),
    defineField({name: 'experienceText', title: 'Description', type: 'text', rows: 3, group: 'experience'}),
    defineField({name: 'showExperience', title: 'Show card', type: 'boolean', group: 'experience', initialValue: true}),

    defineField({name: 'collabLabel', title: 'Label', type: 'string', group: 'collab', initialValue: 'Collaboration'}),
    defineField({name: 'collabTitle', title: 'Title', type: 'string', group: 'collab'}),
    defineField({name: 'collabText', title: 'Description', type: 'text', rows: 2, group: 'collab'}),
    defineField({
      name: 'collaborators',
      title: 'Floating cursor names',
      type: 'array',
      group: 'collab',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.max(3),
    }),
    defineField({name: 'showCollab', title: 'Show card', type: 'boolean', group: 'collab', initialValue: true}),

    defineField({name: 'shippedTitle', title: 'Title', type: 'string', group: 'shipped', initialValue: 'Projects Shipped'}),
    defineField({name: 'shippedText', title: 'Description', type: 'text', rows: 2, group: 'shipped'}),
    defineField({name: 'shippedMetric', title: 'Big number (optional)', type: 'metric', group: 'shipped'}),
    defineField({name: 'showShipped', title: 'Show card', type: 'boolean', group: 'shipped', initialValue: true}),

    defineField({name: 'languagesTitle', title: 'Label', type: 'string', group: 'languages', initialValue: 'Languages'}),
    defineField({name: 'languages', title: 'Languages', type: 'array', group: 'languages', of: [defineArrayMember({type: 'languageSkill'})]}),
    defineField({name: 'showLanguages', title: 'Show card', type: 'boolean', group: 'languages', initialValue: true}),

    defineField({name: 'processTitle', title: 'Label', type: 'string', group: 'process', initialValue: 'My Design Process'}),
    defineField({name: 'processSteps', title: 'Steps', type: 'array', group: 'process', of: [defineArrayMember({type: 'processStep'})], validation: (rule) => rule.max(6)}),
    defineField({name: 'showProcess', title: 'Show card', type: 'boolean', group: 'process', initialValue: true}),
  ],
  preview: {
    select: {enabled: 'enabled'},
    prepare: ({enabled}) => ({title: 'Bento grid', subtitle: `Design thinking, experience, languages, process${enabled === false ? ' · hidden' : ''}`}),
  },
})
