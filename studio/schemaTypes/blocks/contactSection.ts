import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {enabledField} from '../shared/fields'

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    enabledField,
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Ready to Elevate Your Product Experience?'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'submitLabel', title: 'Submit button label', type: 'string', initialValue: 'Submit'}),
    defineField({name: 'successMessage', title: 'Success message', type: 'string', initialValue: "Thanks! Your message is on its way. I'll get back to you soon."}),
  ],
  preview: {
    select: {title: 'heading', enabled: 'enabled'},
    prepare: ({title, enabled}) => ({title: title || 'Contact', subtitle: `Contact form${enabled === false ? ' · hidden' : ''}`}),
  },
})
