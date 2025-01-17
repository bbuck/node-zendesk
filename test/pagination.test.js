import process from 'node:process';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import {beforeAll, afterAll, describe, expect, it} from 'vitest';
import {createClient} from '../src/index.js';

dotenv.config();

const {ZENDESK_USERNAME, ZENDESK_SUBDOMAIN, ZENDESK_TOKEN} = process.env;

describe('Zendesk Client Pagination', () => {
  const testOrganizations = [];

  const uniqueOrgName = () =>
    `Test Organization ${crypto.randomBytes(16).toString('hex')}`;

  const setupClient = (config = {}) =>
    createClient({
      username: ZENDESK_USERNAME,
      subdomain: ZENDESK_SUBDOMAIN,
      token: ZENDESK_TOKEN,
      ...config,
    });

  const defaultClient = setupClient();

  async function createTestOrganization() {
    const {result: organization} = await defaultClient.organizations.create({
      organization: {name: uniqueOrgName()},
    });
    testOrganizations.push(organization);
  }

  beforeAll(async () => {
    await Promise.all([createTestOrganization(), createTestOrganization()]);
  });

  it('should fetch all test items even with pagination applied/forced', async () => {
    const paginatedClient = setupClient({query: {page: {size: 1}}});
    const organizations = await paginatedClient.organizations.list();
    const orgNames = organizations.map((org) => org.name);

    for (const testOrg of testOrganizations) {
      expect(orgNames).toContain(testOrg.name);
    }
  });

  afterAll(async () => {
    await Promise.all(
      testOrganizations.map((org) =>
        defaultClient.organizations.delete(org.id),
      ),
    );
  });
});
