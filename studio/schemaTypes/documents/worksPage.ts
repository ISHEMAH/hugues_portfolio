import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'

export const worksPage = defineType({
  name: 'worksPage',
  title: 'Works Page',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'All Case Studies'}),
    defineField({name: 'subheading', title: 'Sub heading', type: 'string', initialValue: 'Research to Design to Code'}),
    defineField({name: 'showOtherWorks', title: 'Show "other works" section', type: 'boolean', initialValue: true}),
    defineField({name: 'otherWorksHeading', title: 'Other works heading', type: 'string', initialValue: 'Multidisciplinary Showcase'}),
    defineField({name: 'otherWorksSubheading', title: 'Other works sub heading', type: 'string'}),
    defineField({name: 'showContact', title: 'Show contact form', type: 'boolean', initialValue: true}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Works Page'})},
})
