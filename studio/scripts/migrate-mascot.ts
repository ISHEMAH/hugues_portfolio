/**
 * One-off migration (2026-10-01): the hero's 3D head became the robot mascot.
 * Moves Site Settings from portrait3d* fields to mascot* fields.
 *
 *   cd studio && npx sanity exec scripts/migrate-mascot.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-09-26'})

const current = await client.fetch<{portrait3dEnabled?: boolean; mascotEnabled?: boolean} | null>(
  `*[_id == "siteSettings"][0]{portrait3dEnabled, mascotEnabled}`,
)
if (!current) {
  console.log('No siteSettings document, nothing to migrate.')
} else {
  const enabled = current.mascotEnabled ?? current.portrait3dEnabled ?? true
  await client
    .patch('siteSettings')
    .set({mascotEnabled: enabled, mascotOnMobile: true})
    .unset(['portrait3dEnabled', 'portrait3dOnMobile', 'portrait3dModel'])
    .commit()
  console.log(`siteSettings migrated: mascotEnabled=${enabled}, mascotOnMobile=true, portrait3d fields removed.`)
}
