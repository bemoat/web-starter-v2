import { getPayload } from 'payload'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

async function getIsolatedPayload() {
  Object.assign(process.env, {
    NODE_ENV: 'test',
    CLOUDFLARE_ENV: 'dev',
    PAYLOAD_MIGRATE_REMOTE: 'false',
    PAYLOAD_SECRET: 'local-test-placeholder',
    BEMOAT_TEST_WRANGLER_PERSIST: '.wrangler-test/e2e',
  })

  const { default: config } = await import('../../src/payload.config.js')
  return getPayload({ config })
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getIsolatedPayload()

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getIsolatedPayload()

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
