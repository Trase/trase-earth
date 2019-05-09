/* eslint-disable no-console,import/no-extraneous-dependencies */

import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { CONTEXTS, PROFILE_NODE_ACTOR, PROFILE_NODE_PLACE } from './mocks';
import { getRequestMockFn } from './utils';

expect.extend({ toMatchImageSnapshot });

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = 60000 || process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;

const snapshotOptions = {
  failureThreshold: '0.05',
  failureThresholdType: 'percent'
};

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, PROFILE_NODE_ACTOR, PROFILE_NODE_PLACE]);
  page.on('request', mockRequests);
});

describe('Prints the actor profile PDF correctly', () => {
  it('Prints actor profile - Full data', async () => {
    await page.goto(
      `${BASE_URL}/profile-actor?lang=en&nodeId=33624&contextId=1&year=2015&print=true`
    );
    const promises = [
      page.waitForSelector('[data-test=company-compare]'),
      page.waitForSelector('[data-test=top-destination-countries]'),
      page.waitForSelector('[data-test=top-destination-countries-map-d3-polygon-colored]'),
      page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]')
    ];
    await Promise.all(promises);
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-actor',
      ...snapshotOptions
    });
  });

  it('Prints place profile PDF', async () => {
    await page.goto(
      `${BASE_URL}/profile-place?lang=en&nodeId=10902&contextId=1&year=2015&print=true`
    );
    const promises = [
      page.waitForSelector('[data-test=sustainability-indicators]'),
      page.waitForSelector('[data-test=deforestation-trajectory]'),
      page.waitForSelector('[data-test=top-traders]'),
      page.waitForSelector('[data-test=top-importers]')
    ];
    await Promise.all(promises);
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-place',
      ...snapshotOptions
    });
  });
});
