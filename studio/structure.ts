import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {UserIcon} from '@sanity/icons/User'
import {FolderIcon} from '@sanity/icons/Folder'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

export const SINGLETON_TYPES = ['siteSettings', 'homePage', 'aboutPage', 'worksPage']
const HIDDEN_FROM_GENERIC = [...SINGLETON_TYPES, 'contactSubmission']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
      S.divider(),
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home Page')),
      S.listItem()
        .title('About Page')
        .icon(UserIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page')),
      S.listItem()
        .title('Works Page')
        .icon(FolderIcon)
        .child(S.document().schemaType('worksPage').documentId('worksPage').title('Works Page')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects & Case Studies'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('tool').title('Tools & Skills'),
      S.divider(),
      S.documentTypeListItem('experience').title('Work Experience'),
      S.documentTypeListItem('education').title('Education'),
      S.documentTypeListItem('certification').title('Certifications'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.divider(),
      S.listItem()
        .title('Contact Inbox')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Inbox')
            .defaultOrdering([{field: 'receivedAt', direction: 'desc'}]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_FROM_GENERIC.includes(item.getId() as string) &&
          !['project', 'service', 'tool', 'experience', 'education', 'certification', 'testimonial'].includes(item.getId() as string),
      ),
    ])
