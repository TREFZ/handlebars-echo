const chai = require('chai');
const cheerio = require('cheerio');
const echo = require('../echo');

const { expect } = chai;
chai.use(require('chai-string'));

describe('echo', () => {
  it('empty string', () => {
    expect(echo('')).to.endsWith('</style><div class="echo"><span class="string">""</span></div>');
  });
  it('escaped html string', () => {
    expect(echo('<p>test</p>')).to.endsWith('</style><div class="echo"><span class="string">"&lt;p&gt;test&lt;&#x2F;p&gt;"</span></div>');
  });
  it('array', () => {
    const echoHTML = echo(['a', 'b', 'c']);
    const $ = cheerio.load(echoHTML);
    expect($('li').length).to.equal(3);
    expect($('li:nth-of-type(1) span').html()).to.equal('&quot;a&quot;');
  });
  it('object', () => {
    const echoHTML = echo({ a: '1', b: '2', c: '3' });
    const $ = cheerio.load(echoHTML);
    expect($('li').length).to.equal(3);
  });
});
