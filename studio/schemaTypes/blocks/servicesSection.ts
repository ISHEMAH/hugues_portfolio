import {defineArrayMember, defineField, defineType} from 'sanity'
import {ComponentIcon} from '@sanity/icons/Component'
import {anchorField, enabledField} from '../shared/fields'

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    enabledField,
    anchorField,
    defineField({name: 'label', title: 'Small label', type: 'string', initialValue: 'What I Do'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'services',
      title: 'Services (drag to reorder)',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({name: 'showShapes', title: 'Show 3D shapes decoration', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {title: 'heading', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title: title || 'Services', subtitle: `Services${enabled === false ? ' · hidden' : ''}`}),
  },
})
