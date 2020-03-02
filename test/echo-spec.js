const chai = require('chai');
const echo = require('../echo');

const { expect } = chai;
chai.use(require('chai-string'));

describe('echo', () => {
  it('empty string', () => {
    expect(echo('')).to.endsWith(`</style><div class="echo"><span class="string">""</span></div>`);
  });
});
