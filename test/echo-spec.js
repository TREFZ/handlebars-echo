const test = require('node:test');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');
const echo = require('../echo');

test('echo', async t => {
  await t.test('empty string', () => {
    assert.match(
      echo(''),
      /<div class="echo-display"><span class="string value">""<\/span><\/div><script type="text\/javascript" data-echo=/,
    );
  });

  await t.test('escaped html string', () => {
    assert.match(
      echo('<p>test</p>'),
      /<div class="echo-display"><span class="string value">"&lt;p&gt;test&lt;\/p&gt;"<\/span><\/div><script type="text\/javascript" data-echo=/,
    );
  });

  await t.test('array', () => {
    const echoHTML = echo(['a', 'b', 'c']);
    const $ = cheerio.load(echoHTML);
    assert.equal($('li').length, 3);
    assert.equal($('li:nth-of-type(1) span').text(), '"a"');
  });

  await t.test('object', () => {
    const echoHTML = echo({ a: '1', b: '2', c: '3' });
    const $ = cheerio.load(echoHTML);
    assert.equal($('li').length, 3);
  });

  await t.test('core html structure', () => {
    const echoHTML = echo({ a: '1', b: '2', c: '3' });
    const $ = cheerio.load(echoHTML);

    const $echoDiv = $('div.echo');
    assert.equal($echoDiv.length, 1);

    const echoId = $echoDiv.data('echo');
    assert.ok(echoId.length > 0);

    const $echoInput = $echoDiv.find('.echo-path-input');
    assert.equal($echoInput.length, 1);

    const $echoList = $echoDiv.find('datalist');
    assert.equal($echoList.length, 1);

    const inputListId = $echoInput.attr('list');
    const listId = $echoList.attr('id');

    assert.ok(inputListId.endsWith(echoId));
    assert.equal(inputListId, listId);
  });
});
