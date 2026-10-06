import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES, structure} from './structure'
import {resolve} from './presentation/resolve'

const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Hugues Portfolio',
  projectId: 'rnc8k23w',
  dataset: 'production',
  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Singletons should not appear in the "create new document" menu
    templates: (templates) => templates.filter((t) => !SINGLETON_TYPES.includes(t.schemaType)),
  },
  document: {
    // Singletons cannot be deleted, duplicated or unpublished
    actions: (actions, context) =>
      SINGLETON_TYPES.includes(context.schemaType)
        ? actions.filter((a) => !['unpublish', 'delete', 'duplicate'].includes(a.action ?? ''))
        : actions,
  },
})
