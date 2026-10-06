import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Drag to reorder. Open a section to edit it or toggle "Show on site".',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroSection'}),
        defineArrayMember({type: 'tickerSection'}),
        defineArrayMember({type: 'servicesSection'}),
        defineArrayMember({type: 'worksSection'}),
        defineArrayMember({type: 'skillsSection'}),
        defineArrayMember({type: 'bentoSection'}),
        defineArrayMember({type: 'testimonialsSection'}),
        defineArrayMember({type: 'faqSection'}),
        defineArrayMember({type: 'contactSection'}),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home Page'})},
})
