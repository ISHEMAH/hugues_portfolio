# Ishema Hugues Portfolio (Next.js + Sanity)

A rebuild of the Nuance Framer template in Next.js, filled with Hugues' product-design and mobile/web-development work, with every piece of content editable in Sanity Studio.

```
portfoliov1/
├── studio/   # Sanity Studio (content model, structure, seed script)
└── web/      # Next.js 16 site (App Router, Tailwind v4, motion)
```

## Requirements

- Node.js 22+ (`nvm use` picks it up from `.nvmrc`)
- A Sanity account with access to project `rnc8k23w`

## Quick start

```bash
# 1. install both apps
npm run install:all

# 2. run the site (http://localhost:3000) and the Studio (http://localhost:3333)
npm run dev
```

The site renders immediately from the local content in `web/src/data/fallback.ts`. Once Sanity has documents, the site reads from Sanity instead (and still falls back to the local content if the API is unreachable).

## Connect Sanity (one-time)

```bash
cd studio
npx sanity login                       # opens the browser
npx sanity schemas deploy              # publish the content model
npx sanity cors add http://localhost:3000 --credentials
npm run seed                           # push all local content + images into the dataset
npm run dev                            # open the Studio at http://localhost:3333
```

Then, in the Studio:

- **Home Page → Sections**: drag to reorder sections, open one and toggle **Show on site** to hide it.
- **Site Settings**: name, availability badge, resume, contact details, socials, footer words, effects (film grain / smooth scroll), default SEO.
- **Projects & Case Studies**: each project has a card (thumbnail, tags, category), a case overview (role, duration, tools, team) and a rich case-study body with image grids, metric cards, before/after sliders, quotes and video embeds. `Featured on home page` + `Display order` control the stacked cards on the home page.
- **Services, Tools & Skills, Experience, Education, Certifications, Testimonials**: independent documents with `Show on site` and `Display order`.
- **Contact Inbox**: every form submission is archived here when `SANITY_API_WRITE_TOKEN` is set.

### Live preview / click-to-edit (optional)

1. Create a **Viewer** token in [sanity.io/manage](https://www.sanity.io/manage) → API → Tokens and put it in `web/.env.local` as `SANITY_API_READ_TOKEN`.
2. Open the **Presentation** tab in the Studio. It loads the site inside the Studio with click-to-edit overlays.

## Contact form email (Resend, free)

The form posts to `web/src/app/api/contact/route.ts`, which sends the message with [Resend](https://resend.com) (3,000 emails/month free, no separate backend) and optionally archives it in Sanity.

1. Create a free Resend account with the address that should receive messages and generate an API key.
2. In `web/.env.local` set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (must be the Resend account email until you verify a domain).
3. Optional: verify your own domain in Resend, then change `CONTACT_FROM_EMAIL` to e.g. `Portfolio <hello@yourdomain.com>` so you can send to any address.
4. Optional: create an **Editor** token in Sanity and set `SANITY_API_WRITE_TOKEN` to keep a copy of each message in the Studio's Contact Inbox.

Until the key is set, the form shows a friendly "not connected yet" message instead of failing silently.

## Environment variables

See `web/.env.example`. Public values (`NEXT_PUBLIC_*`) are safe to commit; tokens and the Resend key are secrets.

## Deploy

- **Site**: lives at https://hugues.vercel.app (Vercel project `hugues-h5dt`, connected to
  `github.com/ISHEMAH/hugues_portfolio`). Every push to `main` deploys to production; other branches
  and pull requests get preview deployments. The Vercel project uses `web` as its root directory and
  Node 22 (`engines` in `web/package.json`). Env vars from `web/.env.example` are set in Vercel, with
  `NEXT_PUBLIC_SITE_URL=https://hugues.vercel.app`, and that URL is in the Sanity CORS origins.
  To roll back, use Instant Rollback in the Vercel dashboard. The previous portfolio is kept in git
  history under the tag `legacy-portfolio`.
- **Studio**: `cd studio && npx sanity deploy` (hosted at `https://<name>.sanity.studio`). Set `SANITY_STUDIO_PREVIEW_ORIGIN` to the production site URL for the Presentation tool.

## Content model & types

- Schema: `studio/schemaTypes` (documents, objects, page sections).
- Studio sidebar: `studio/structure.ts`.
- Generated TypeScript types: `npm run typegen` (from the root) regenerates `web/sanity.types.ts` after schema or query changes.
- Frontend queries: `web/src/sanity/queries.ts`; Sanity → UI mapping: `web/src/lib/normalize.ts`.

## Design system

Colours, typography scale and motion tokens extracted from the Framer template live in `web/src/app/globals.css` (Tailwind v4 `@theme`). Reusable animation primitives (split-text reveals, typewriter, number roll, marquee, pixel reveal, bracket-corner buttons, film grain) are in `web/src/components/ui` and `web/src/components/layout`.

## Robot mascot

The hero's dark panel is home to an animated 3D robot instead of a photo. It pops in and waves,
follows the cursor with its head and body, blinks surprised at sudden movements, misses you when
the cursor leaves the window, performs tricks when clicked (and gets annoyed, then knocked out,
if you keep poking it), dozes off when nobody moves the mouse and jumps awake when you come back.
Hovering the call to action earns a thumbs up. On the About page it replaces the portrait photo in
the intro card and waves under the "Hello!" speech bubble. The same robot sits, sulking, on the 404 page and
cheers or winces as you play the puzzle, and a smaller one next to the contact form nods when you
send, celebrates a delivered message and shakes its head on an error.

The model is "RobotExpressive" by Tomás Laulhé (Quaternius), modified by Don McCurdy, released
under CC0 and shipped with the three.js examples. It is bundled as `web/public/models/robot.glb`
(meshopt compressed, 184 KB, 14 animation clips, three face morph targets: Angry, Surprised, Sad).

Code: `web/src/components/mascot` (wrapper, WebGL scene, robot, palettes) and `web/src/lib/mascot`
(behaviour engine, event bus, pointer tracking, capability check). The behaviour engine
(`brain.ts`) is pure TypeScript: it decides which clip plays, where the head looks and how the
face feels; `Robot.tsx` applies that to the animation mixer, the head bone and the morph targets.
Other parts of the page talk to a robot through the bus: `emitMascot("contact", { type: "cue",
cue: "celebrate" })`, or declaratively with `data-mascot="ThumbsUp"` on any element.

How it loads: the scene is created after the page has loaded, only when the box is near the
viewport and only on devices that pass a quick capability check (WebGL2, enough cores and memory,
no data saver). Rendering stops while the robot is off-screen or the tab is hidden. Reduced-motion
visitors and unsupported devices get the hero photo, and on the About page a still render of the
robot (`web/public/images/mascot/robot-about.png`).

Controls live in Sanity Studio under Site Settings, Effects:

- **Robot mascot** turns the feature on or off everywhere.
- **Show the robot on phones** is on by default; turn it off to keep the photo on phones.

## The 404 puzzle

Missing URLs render a rolling-block puzzle instead of a plain error (`web/src/app/not-found.tsx`,
code in `web/src/components/game`). The block is 1x1x2; tip it with the arrow keys or WASD, the
on-screen pad, or by swiping the board on a phone. Stand it upright on the green tile to clear a
level. Pale tiles crack under a standing block, round switches react to any touch, X switches only
to a standing block, and blue bridges open or close.

There are 15 levels in `levels.ts`, written as ASCII maps. Progress (current level, unlocked
levels, best moves, falls) is kept in `localStorage`. After editing or adding a level, run

```bash
npx tsx scripts/solve-levels.ts
```

from `web/`: it proves every level is solvable, prints the shortest solution, and warns when a
level with switches can be beaten without them.
