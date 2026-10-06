import {defineField} from 'sanity'

/** Visibility toggle shared by sections and list documents. */
export const enabledField = defineField({
  name: 'enabled',
  title: 'Show on site',
  type: 'boolean',
  initialValue: true,
  description: 'Turn off to hide this item without deleting it.',
})

/** Manual ordering for list documents. */
export const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers are shown first.',
})

/** Optional HTML id so the section can be linked with #anchor. */
export const anchorField = defineField({
  name: 'anchor',
  title: 'Anchor id',
  type: 'string',
  description: 'Optional. Lets you link to this section with #your-anchor.',
  validation: (rule) =>
    rule.custom((value) =>
      !value || /^[a-z0-9-]+$/.test(value) ? true : 'Use lowercase letters, numbers and hyphens only',
    ),
})

export const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        validation: (rule) => rule.warning('Alt text helps accessibility and SEO'),
      }),
    ],
  })
