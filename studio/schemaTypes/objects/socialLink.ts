import {defineField, defineType} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'

export const SOCIAL_PLATFORMS = [
  {title: 'Behance', value: 'behance'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'GitHub', value: 'github'},
  {title: 'Dribbble', value: 'dribbble'},
  {title: 'X (Twitter)', value: 'x'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Email', value: 'email'},
]

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {list: SOCIAL_PLATFORMS},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']})}),
  ],
  preview: {select: {title: 'platform', subtitle: 'url'}},
})
