import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Contact submission',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'subject', title: 'Subject', type: 'string'}),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 6}),
    defineField({name: 'receivedAt', title: 'Received at', type: 'datetime'}),
    defineField({name: 'emailSent', title: 'Email delivered', type: 'boolean'}),
    defineField({name: 'userAgent', title: 'Browser', type: 'string'}),
  ],
  preview: {
    select: {title: 'subject', name: 'name', receivedAt: 'receivedAt'},
    prepare: ({title, name, receivedAt}) => ({
      title: title || '(no subject)',
      subtitle: `${name ?? ''} · ${receivedAt ? new Date(receivedAt).toLocaleString() : ''}`,
    }),
  },
})
