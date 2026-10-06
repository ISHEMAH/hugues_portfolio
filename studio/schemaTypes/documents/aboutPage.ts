import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'hero', title: 'Intro', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'greeting',
      title: 'Speech bubble',
      type: 'string',
      group: 'hero',
      initialValue: 'Hello!',
      description: 'Shown above the robot mascot in the intro card.',
    }),
    defineField({name: 'headline', title: 'Headline', type: 'string', group: 'hero', description: 'e.g. This is Ishema Hugues.'}),
    defineField({name: 'subheadline', title: 'Sub headline', type: 'string', group: 'hero', description: 'e.g. A Product Designer & Developer'}),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 5, group: 'hero'}),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Drag to reorder. Toggle "Show on site" inside each section to hide it.',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({type: 'experienceSection'}),
        defineArrayMember({type: 'educationSection'}),
        defineArrayMember({type: 'certificationsSection'}),
        defineArrayMember({type: 'skillGroupsSection'}),
        defineArrayMember({type: 'hobbiesSection'}),
        defineArrayMember({type: 'contactSection'}),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About Page'})},
})
