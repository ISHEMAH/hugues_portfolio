import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      message: 'This document controls the home page',
      locations: [{title: 'Home', href: '/'}],
    }),
    aboutPage: defineLocations({
      message: 'This document controls the about page',
      locations: [{title: 'About', href: '/about'}],
    }),
    worksPage: defineLocations({
      message: 'This document controls the works page',
      locations: [{title: 'Works', href: '/works'}],
    }),
    siteSettings: defineLocations({
      message: 'Used on every page',
      locations: [
        {title: 'Home', href: '/'},
        {title: 'About', href: '/about'},
        {title: 'Works', href: '/works'},
      ],
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled project', href: `/works/${doc?.slug}`},
          {title: 'All works', href: '/works'},
          {title: 'Home', href: '/'},
        ],
      }),
    }),
    service: defineLocations({locations: [{title: 'Home', href: '/'}]}),
    tool: defineLocations({locations: [{title: 'Home', href: '/'}]}),
    testimonial: defineLocations({locations: [{title: 'Home', href: '/'}]}),
    experience: defineLocations({locations: [{title: 'About', href: '/about'}]}),
    education: defineLocations({locations: [{title: 'About', href: '/about'}]}),
    certification: defineLocations({locations: [{title: 'About', href: '/about'}]}),
  },
}
