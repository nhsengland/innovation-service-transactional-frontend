import { REQUEST_TIMEOUT_MS } from './constants.config';

describe('server request timeout configuration', () => {
  it('uses a three-minute timeout for long-running API requests', () => {
    expect(REQUEST_TIMEOUT_MS).toBe(180000);
  });
});
