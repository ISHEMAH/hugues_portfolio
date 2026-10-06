/**
 * One-off migration (2026-10-06): the About intro card shows the robot mascot
 * instead of a photo. Removes the now unused portrait reference from the About
 * page. The image asset itself stays in the media library (the hero uses it).
 *
 *   cd studio && npx sanity exec scripts/migrate-about-robot.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-09-26'})

const hasPortrait = await client.fetch<boolean>(`defined(*[_id == "aboutPage"][0].portrait)`)
if (hasPortrait) {
  await client.patch('aboutPage').unset(['portrait']).commit()
  console.log('aboutPage: portrait removed.')
} else {
  console.log('aboutPage: no portrait, nothing to do.')
}
