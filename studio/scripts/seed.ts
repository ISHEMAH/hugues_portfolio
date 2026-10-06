/**
 * Seeds the Sanity dataset with the portfolio content from ../web/src/data/fallback.ts.
 *
 *   cd studio
 *   npx sanity login            # once
 *   npm run seed                # = sanity exec scripts/seed.ts --with-user-token
 *
 * The script is idempotent: documents are matched by slug / name and updated in
 * place, images are uploaded once and reused. Singletons use fixed ids.
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'
import {
  fallbackAbout,
  fallbackCertifications,
  fallbackEducation,
  fallbackExperiences,
  fallbackHome,
  fallbackProjects,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
  fallbackTools,
  fallbackWorks,
} from '../../web/src/data/fallback'
import type {Img} from '../../web/src/lib/types'

const client = getCliClient({apiVersion: '2026-09-26'})
const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../web/public')

let keyCounter = 0
const key = () => `seed${(keyCounter++).toString(36)}`

/* ---------------- images ---------------- */
const assetCache = new Map<string, string>()

async function uploadImage(img?: Img) {
  if (!img) return undefined
  if (assetCache.has(img.src)) return imageRef(assetCache.get(img.src)!, img.alt)
  const filePath = path.join(PUBLIC_DIR, img.src)
  if (!existsSync(filePath)) {
    console.warn(`  ! image missing on disk, skipped: ${img.src}`)
    return undefined
  }
  const filename = path.basename(filePath)
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )
  let id = existing
  if (!id) {
    console.log(`  ↑ uploading ${img.src}`)
    const asset = await client.assets.upload('image', createReadStream(filePath), {filename})
    id = asset._id
  }
  assetCache.set(img.src, id)
  return imageRef(id, img.alt)
}

function imageRef(assetId: string, alt?: string) {
  return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, ...(alt ? {alt} : {})}
}

/* ---------------- upsert helpers ---------------- */
type Doc = Record<string, unknown> & {_type: string}

async function upsert(type: string, matchField: string, matchValue: string, doc: Doc): Promise<string> {
  const existingId = await client.fetch<string | null>(`*[_type == $type && ${matchField} == $value][0]._id`, {
    type,
    value: matchValue,
  })
  if (existingId) {
    await client.patch(existingId).set(doc).commit()
    console.log(`  ✓ updated ${type} "${matchValue}"`)
    return existingId
  }
  const created = await client.create(doc)
  console.log(`  + created ${type} "${matchValue}"`)
  return created._id
}

async function upsertSingleton(id: string, doc: Doc) {
  await client.createOrReplace({_id: id, ...doc})
  console.log(`  ✓ singleton ${id}`)
}

const ref = (id: string) => ({_type: 'reference', _ref: id, _key: key()})
const cta = (l?: {label: string; href: string; newTab?: boolean}) => (l ? {_type: 'cta', label: l.label, href: l.href, newTab: l.newTab ?? false} : undefined)
const metric = (m?: {value: string; suffix?: string; label: string}) => (m ? {_type: 'metric', value: m.value, suffix: m.suffix, label: m.label} : undefined)

async function main() {
  console.log(`Seeding project ${client.config().projectId} / ${client.config().dataset}\n`)

  console.log('Services')
  const serviceIds = new Map<string, string>()
  for (const [i, s] of fallbackServices.entries()) {
    serviceIds.set(s.id, await upsert('service', 'title', s.title, {_type: 'service', title: s.title, description: s.description, icon: s.icon, enabled: true, order: i + 1}))
  }

  console.log('Tools')
  const toolIds = new Map<string, string>()
  for (const [i, t] of fallbackTools.entries()) {
    toolIds.set(t.id, await upsert('tool', 'name', t.name, {_type: 'tool', name: t.name, description: t.description, category: t.category, enabled: true, order: i + 1, logo: await uploadImage(t.logo)}))
  }

  console.log('Testimonials')
  const testimonialIds = new Map<string, string>()
  for (const [i, t] of fallbackTestimonials.entries()) {
    testimonialIds.set(t.id, await upsert('testimonial', 'name', t.name, {_type: 'testimonial', name: t.name, role: t.role, quote: t.quote, enabled: true, order: i + 1, avatar: await uploadImage(t.avatar)}))
  }

  console.log('Experience')
  const experienceIds = new Map<string, string>()
  for (const [i, e] of fallbackExperiences.entries()) {
    experienceIds.set(e.id, await upsert('experience', 'company', e.company, {
      _type: 'experience',
      company: e.company,
      period: e.period,
      employmentType: e.employmentType,
      location: e.location,
      highlights: e.highlights,
      roles: e.roles.map((r) => ({_type: 'roleEntry', _key: key(), title: r.title, period: r.period})),
      enabled: true,
      order: i + 1,
      logo: await uploadImage(e.logo),
    }))
  }

  console.log('Education')
  const educationIds = new Map<string, string>()
  for (const [i, e] of fallbackEducation.entries()) {
    educationIds.set(e.id, await upsert('education', 'degree', e.degree, {_type: 'education', degree: e.degree, institution: e.institution, period: e.period, description: e.description, enabled: true, order: i + 1, logo: await uploadImage(e.logo)}))
  }

  console.log('Certifications')
  const certificationIds = new Map<string, string>()
  for (const [i, c] of fallbackCertifications.entries()) {
    certificationIds.set(c.id, await upsert('certification', 'title', c.title, {_type: 'certification', title: c.title, issuer: c.issuer, duration: c.duration, credentialUrl: c.credentialUrl, enabled: true, order: i + 1, logo: await uploadImage(c.logo)}))
  }

  console.log('Projects')
  const projectIds = new Map<string, string>()
  for (const p of fallbackProjects) {
    projectIds.set(p.id, await upsert('project', 'slug.current', p.slug, {
      _type: 'project',
      title: p.title,
      slug: {_type: 'slug', current: p.slug},
      kind: p.kind,
      enabled: true,
      featured: p.featured,
      order: p.order,
      category: p.category,
      timeline: p.timeline,
      shortDescription: p.shortDescription,
      tags: p.tags,
      disciplines: p.disciplines,
      externalUrl: p.externalUrl,
      externalLabel: p.externalLabel,
      role: p.role,
      duration: p.duration,
      tools: p.tools,
      team: p.team,
      client: p.client,
      year: p.year,
      body: p.body,
      thumbnail: await uploadImage(p.thumbnail),
      cover: await uploadImage(p.cover),
    }))
  }

  console.log('Site settings')
  const s = fallbackSettings
  await upsertSingleton('siteSettings', {
    _type: 'siteSettings',
    name: s.name,
    roleTitle: s.roleTitle,
    availabilityEnabled: s.availability.enabled,
    availabilityLabel: s.availability.label,
    resumeUrl: s.resumeUrl,
    email: s.email,
    phone: s.phone,
    whatsapp: s.whatsapp,
    location: s.location,
    socials: s.socials.map((x) => ({_type: 'socialLink', _key: key(), platform: x.platform, url: x.url})),
    navLinks: s.navLinks.map((l) => ({...cta(l), _key: key()})),
    footerPrefix: s.footer.prefix,
    footerCycleWords: s.footer.cycleWords,
    footerSuffix: s.footer.suffix,
    footerLinks: s.footer.links.map((l) => ({...cta(l), _key: key()})),
    filmGrain: s.effects.filmGrain,
    smoothScroll: s.effects.smoothScroll,
    mascotEnabled: s.mascot.enabled,
    mascotOnMobile: s.mascot.showOnMobile,
    seo: {_type: 'seo', title: s.seo?.title, description: s.seo?.description},
  })

  console.log('Home page')
  const homeSections: Doc[] = []
  for (const section of fallbackHome.sections) {
    const base = {_key: key(), enabled: section.enabled, anchor: section.anchor}
    switch (section.type) {
      case 'hero':
        homeSections.push({
          ...base,
          _type: 'heroSection',
          eyebrow: section.eyebrow,
          headline: section.headline,
          typewriterWords: section.typewriterWords,
          intro: section.intro,
          ctaMode: 'resume',
          ctaLabel: section.cta?.label ?? 'Download Resume',
          portrait: await uploadImage(section.portrait),
          metrics: section.metrics.map((m) => ({...metric(m), _key: key()})),
        })
        break
      case 'ticker':
        homeSections.push({_type: 'tickerSection', _key: key(), enabled: section.enabled, items: section.items})
        break
      case 'services':
        homeSections.push({...base, _type: 'servicesSection', label: section.label, heading: section.heading, showShapes: section.showShapes, services: section.services.map((x) => ref(serviceIds.get(x.id)!))})
        break
      case 'works':
        homeSections.push({...base, _type: 'worksSection', label: section.label, heading: section.heading, cta: cta(section.cta), projects: section.projects.map((x) => ref(projectIds.get(x.id)!))})
        break
      case 'skills':
        homeSections.push({...base, _type: 'skillsSection', label: section.label, heading: section.heading, tools: section.tools.map((x) => ref(toolIds.get(x.id)!))})
        break
      case 'bento':
        homeSections.push({
          ...base,
          _type: 'bentoSection',
          showThinking: Boolean(section.thinking),
          thinkingTitle: section.thinking?.title,
          principles: section.thinking?.principles.map((p) => ({_type: 'designTag', _key: key(), label: p.label, icon: p.icon})),
          showCraft: Boolean(section.craft),
          craftTitle: section.craft?.title,
          craftQuote: section.craft?.quote,
          showExperience: Boolean(section.experience),
          experienceLabel: section.experience?.label,
          experienceMetric: metric(section.experience?.metric),
          experienceTitle: section.experience?.title,
          experienceText: section.experience?.text,
          showCollab: Boolean(section.collaboration),
          collabLabel: section.collaboration?.label,
          collabTitle: section.collaboration?.title,
          collabText: section.collaboration?.text,
          collaborators: section.collaboration?.collaborators,
          showShipped: Boolean(section.shipped),
          shippedTitle: section.shipped?.title,
          shippedText: section.shipped?.text,
          shippedMetric: metric(section.shipped?.metric),
          showLanguages: Boolean(section.languages),
          languagesTitle: section.languages?.title,
          languages: section.languages?.items.map((l) => ({_type: 'languageSkill', _key: key(), name: l.name, level: l.level})),
          showProcess: Boolean(section.process),
          processTitle: section.process?.title,
          processSteps: section.process?.steps.map((p) => ({_type: 'processStep', _key: key(), label: p.label, state: p.state})),
        })
        break
      case 'testimonials': {
        const flags = []
        for (const f of section.flags) {
          const uploaded = await uploadImage(f)
          if (uploaded) flags.push({...uploaded, _key: key()})
        }
        homeSections.push({...base, _type: 'testimonialsSection', heading: section.heading, subheading: section.subheading, description: section.description, testimonials: section.testimonials.map((x) => ref(testimonialIds.get(x.id)!)), flags})
        break
      }
      case 'faq':
        homeSections.push({...base, _type: 'faqSection', heading: section.heading, description: section.description, items: section.items.map((i) => ({_type: 'faqItem', _key: key(), question: i.question, answer: i.answer}))})
        break
      case 'contact':
        homeSections.push({_type: 'contactSection', _key: key(), enabled: section.enabled, heading: section.heading, description: section.description, submitLabel: section.submitLabel, successMessage: section.successMessage})
        break
    }
  }
  await upsertSingleton('homePage', {_type: 'homePage', sections: homeSections, seo: {_type: 'seo', title: fallbackHome.seo?.title, description: fallbackHome.seo?.description}})

  console.log('About page')
  const aboutSections: Doc[] = []
  for (const section of fallbackAbout.sections) {
    const base = {_key: key(), enabled: section.enabled, heading: section.heading}
    switch (section.type) {
      case 'experience':
        aboutSections.push({...base, _type: 'experienceSection', items: section.items.map((x) => ref(experienceIds.get(x.id)!))})
        break
      case 'education':
        aboutSections.push({...base, _type: 'educationSection', items: section.items.map((x) => ref(educationIds.get(x.id)!))})
        break
      case 'certifications':
        aboutSections.push({...base, _type: 'certificationsSection', items: section.items.map((x) => ref(certificationIds.get(x.id)!))})
        break
      case 'skillGroups':
        aboutSections.push({...base, _type: 'skillGroupsSection', groups: section.groups.map((g) => ({_type: 'skillGroup', _key: key(), title: g.title, items: g.items}))})
        break
      case 'hobbies': {
        const items = []
        for (const h of section.items) items.push({_type: 'hobby', _key: key(), label: h.label, image: await uploadImage(h.image)})
        aboutSections.push({...base, _type: 'hobbiesSection', items})
        break
      }
      case 'contact':
        aboutSections.push({_type: 'contactSection', _key: key(), enabled: section.enabled, heading: section.heading, description: section.description, submitLabel: section.submitLabel, successMessage: section.successMessage})
        break
    }
  }
  await upsertSingleton('aboutPage', {
    _type: 'aboutPage',
    greeting: fallbackAbout.greeting,
    headline: fallbackAbout.headline,
    subheadline: fallbackAbout.subheadline,
    intro: fallbackAbout.intro,
    sections: aboutSections,
    seo: {_type: 'seo', title: fallbackAbout.seo?.title, description: fallbackAbout.seo?.description},
  })

  console.log('Works page')
  await upsertSingleton('worksPage', {
    _type: 'worksPage',
    heading: fallbackWorks.heading,
    subheading: fallbackWorks.subheading,
    showOtherWorks: fallbackWorks.showOtherWorks,
    otherWorksHeading: fallbackWorks.otherWorksHeading,
    otherWorksSubheading: fallbackWorks.otherWorksSubheading,
    showContact: fallbackWorks.showContact,
    seo: {_type: 'seo', title: fallbackWorks.seo?.title, description: fallbackWorks.seo?.description},
  })

  console.log('\nDone. Open the Studio and publish or refine the content.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
