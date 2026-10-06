import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {ImagesIcon} from '@sanity/icons/Images'
import {BarChartIcon} from '@sanity/icons/BarChart'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {PlayIcon} from '@sanity/icons/Play'

const altField = defineField({
  name: 'alt',
  title: 'Alternative text',
  type: 'string',
  validation: (rule) => rule.warning('Describe the image for accessibility'),
})

export const pteImage = defineType({
  name: 'pteImage',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}, fields: [altField], validation: (rule) => rule.required()}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({
      name: 'size',
      title: 'Width',
      type: 'string',
      options: {list: [{title: 'Content width', value: 'contained'}, {title: 'Wide', value: 'wide'}], layout: 'radio'},
      initialValue: 'contained',
    }),
  ],
  preview: {select: {title: 'caption', media: 'image'}, prepare: ({title, media}) => ({title: title || 'Image', subtitle: 'Image', media})},
})

export const imageGrid = defineType({
  name: 'imageGrid',
  title: 'Image grid',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [altField]})],
      validation: (rule) => rule.min(2),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {list: [2, 3]},
      initialValue: 2,
    }),
  ],
  preview: {select: {images: 'images'}, prepare: ({images}) => ({title: `Image grid (${images?.length ?? 0})`, subtitle: 'Image grid'})},
})

export const imageStrip = defineType({
  name: 'imageStrip',
  title: 'Scrolling image strip',
  type: 'object',
  icon: ImagesIcon,
  description: 'Two rows of images that scroll horizontally (great for wireframes).',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [altField]})],
      validation: (rule) => rule.min(3),
    }),
  ],
  preview: {select: {images: 'images'}, prepare: ({images}) => ({title: `Scrolling strip (${images?.length ?? 0})`, subtitle: 'Image strip'})},
})

export const metricCards = defineType({
  name: 'metricCards',
  title: 'Metric cards',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Metrics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metricCard',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'string', description: 'e.g. 58% or 2,000+', validation: (rule) => rule.required()}),
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {select: {items: 'items'}, prepare: ({items}) => ({title: (items ?? []).map((i: {value?: string}) => i.value).join(' · ') || 'Metrics', subtitle: 'Metric cards'})},
})

export const beforeAfter = defineType({
  name: 'beforeAfter',
  title: 'Before / after slider',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({name: 'before', title: 'Before image', type: 'image', options: {hotspot: true}, fields: [altField], validation: (rule) => rule.required()}),
    defineField({name: 'after', title: 'After image', type: 'image', options: {hotspot: true}, fields: [altField], validation: (rule) => rule.required()}),
    defineField({name: 'beforeLabel', title: 'Before label', type: 'string', initialValue: 'Before'}),
    defineField({name: 'afterLabel', title: 'After label', type: 'string', initialValue: 'After'}),
  ],
  preview: {select: {media: 'after'}, prepare: ({media}) => ({title: 'Before / after', subtitle: 'Comparison slider', media})},
})

export const callout = defineType({
  name: 'callout',
  title: 'Highlight box',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {list: [{title: 'Neutral', value: 'neutral'}, {title: 'Warm', value: 'warm'}, {title: 'Success', value: 'success'}], layout: 'radio'},
      initialValue: 'neutral',
    }),
  ],
  preview: {select: {title: 'text'}, prepare: ({title}) => ({title, subtitle: 'Highlight box'})},
})

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'role', title: 'Role / company', type: 'string'}),
  ],
  preview: {select: {title: 'quote', subtitle: 'author'}},
})

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video (YouTube / Vimeo)',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({name: 'url', title: 'Video URL', type: 'url', validation: (rule) => rule.required()}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
  preview: {select: {title: 'caption', subtitle: 'url'}, prepare: ({title, subtitle}) => ({title: title || 'Video', subtitle})},
})

export const caseStudyBody = defineType({
  name: 'caseStudyBody',
  title: 'Case study content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Section heading', value: 'h2'},
        {title: 'Sub heading', value: 'h3'},
        {title: 'Small heading', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']})}),
              defineField({name: 'newTab', title: 'Open in new tab', type: 'boolean', initialValue: true}),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'pteImage'}),
    defineArrayMember({type: 'imageGrid'}),
    defineArrayMember({type: 'imageStrip'}),
    defineArrayMember({type: 'metricCards'}),
    defineArrayMember({type: 'beforeAfter'}),
    defineArrayMember({type: 'callout'}),
    defineArrayMember({type: 'pullQuote'}),
    defineArrayMember({type: 'videoEmbed'}),
  ],
})
