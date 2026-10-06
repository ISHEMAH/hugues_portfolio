import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'contact', title: 'Contact & socials'},
    {name: 'navigation', title: 'Navigation & footer'},
    {name: 'effects', title: 'Effects'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'name', title: 'Full name', type: 'string', group: 'identity', validation: (rule) => rule.required()}),
    defineField({name: 'roleTitle', title: 'Role title', type: 'string', group: 'identity', description: 'e.g. Product Designer & Mobile Developer'}),
    defineField({name: 'availabilityEnabled', title: 'Show availability badge', type: 'boolean', group: 'identity', initialValue: true}),
    defineField({name: 'availabilityLabel', title: 'Availability label', type: 'string', group: 'identity', initialValue: 'Available for freelance'}),
    defineField({name: 'resumeFile', title: 'Resume (PDF)', type: 'file', group: 'identity', options: {accept: '.pdf'}}),
    defineField({name: 'resumeUrl', title: 'Resume link (used if no file)', type: 'url', group: 'identity'}),

    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (rule) => rule.email()}),
    defineField({name: 'phone', title: 'Phone', type: 'string', group: 'contact'}),
    defineField({name: 'whatsapp', title: 'WhatsApp link', type: 'url', group: 'contact'}),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'contact'}),
    defineField({name: 'socials', title: 'Social links', type: 'array', group: 'contact', of: [defineArrayMember({type: 'socialLink'})]}),

    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'cta'})],
      validation: (rule) => rule.max(4),
    }),
    defineField({name: 'footerPrefix', title: 'Footer headline start', type: 'string', group: 'navigation', initialValue: "Let's"}),
    defineField({
      name: 'footerCycleWords',
      title: 'Footer cycling words',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({name: 'footerSuffix', title: 'Footer headline end', type: 'string', group: 'navigation', initialValue: 'incredible work together.'}),
    defineField({name: 'footerLinks', title: 'Footer links', type: 'array', group: 'navigation', of: [defineArrayMember({type: 'cta'})]}),
    defineField({name: 'copyright', title: 'Copyright line', type: 'string', group: 'navigation'}),

    defineField({name: 'filmGrain', title: 'Film grain overlay', type: 'boolean', group: 'effects', initialValue: true}),
    defineField({name: 'smoothScroll', title: 'Smooth scrolling', type: 'boolean', group: 'effects', initialValue: true}),
    defineField({
      name: 'mascotEnabled',
      title: 'Robot mascot',
      type: 'boolean',
      group: 'effects',
      initialValue: true,
      description:
        'Shows the animated 3D robot in the hero, beside the contact form and on the 404 page. It waves, follows the cursor and reacts to clicks. Visitors who prefer reduced motion, or whose device cannot run it, see the hero photo instead.',
    }),
    defineField({
      name: 'mascotOnMobile',
      title: 'Show the robot on phones',
      type: 'boolean',
      group: 'effects',
      initialValue: true,
      description: 'The model is small (under 200 KB) and reacts to taps. Turn off to show the hero photo on phones instead.',
    }),

    defineField({name: 'seo', title: 'Default SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
