const chai = require('chai');
const cheerio = require('cheerio');
const echo = require('../echo');

const { expect } = chai;
chai.use(require('chai-string'));

describe('echo', () => {
  it('empty string', () => {
    expect(echo('')).to.contain('<div class="echo-display"><span class="string value">""</span></div><script type="text/javascript" data-echo=');
  });
  it('escaped html string', () => {
    expect(echo('<p>test</p>')).to.contain('<div class="echo-display"><span class="string value">"&lt;p&gt;test&lt;/p&gt;"</span></div><script type="text/javascript" data-echo=');
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
  it('core html structure', () => {
    const echoHTML = echo({ a: '1', b: '2', c: '3' });
    const $ = cheerio.load(echoHTML);

    const $echoDiv = $('div.echo');
    expect($echoDiv.length).to.equal(1);

    const echoId = $echoDiv.data('echo');
    expect(echoId.length).to.greaterThan(0);
    
    const $echoInput = $echoDiv.find('.echo-path-input');
    expect($echoInput.length).to.equal(1);

    const $echoList = $echoDiv.find('datalist');
    expect($echoList.length).to.equal(1);

    const inputListId = $echoInput.attr('list');
    const listId = $echoList.attr('id');

    expect(inputListId).to.endWith(echoId);
    expect(inputListId).to.equal(listId);
  });
});
