const escape = require('lodash/escape');
const isPlainObject = require('lodash/isPlainObject');

const css = '<style type="text/css">div.echo{background:#24272e!important;color:#a1a9b7!important;padding:20px!important;overflow-x:scroll!important;white-space:nowrap!important;font-size:12px!important;font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace!important;line-height:normal!important}input.echo{display:none!important}input.echo~label{display:inline-block!important;position:relative!important;margin:0 5px!important;padding:0!important;width:10px!important;height:10px!important;vertical-align:baseline!important;font-size:14px!important}input.echo~label:before{position:absolute!important;top:0!important;left:0!important;content:"\\25ba"!important;cursor:pointer!important;color:#56a6ed!important;font-size:10px!important;font-family:courier!important;line-height:1!important}input.echo:checked~label:before{content:"\\25bc"}input.echo~ol{position:relative!important;display:none!important;list-style-type:none!important;padding:0 0 0 20px!important;margin:0!important}input.echo:checked~ol{display:block!important}input.echo~ol li{align-items:center!important;color:#a1a9b7!important;position:relative!important;margin:0!important;padding:0!important}div.echo .type{color:#e1b870!important}div.echo .string{color:#8dbb6e!important}div.echo .other{color:#cb8f5b!important}</style>';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ID_LENGTH = 8;

function generateRandomString() {
  let rtn = '';
  let i = 0;
  while (i < ID_LENGTH) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    i += 1;
  }
  return rtn;
}

const echo = (context, isRoot = true) => {
  const inputId = generateRandomString();
  let output = isRoot ? `${css}<div class="echo">` : '';

  if (Array.isArray(context)) {
    output += `
<input id="${inputId}" type="checkbox" class="echo"  ${isRoot ? ' checked' : ''} />
<span class="type"> array:${context.length}</span> [<label for="${inputId}"></label>
<ol>${context.map((value, index) => `<li>${index}: ${echo(value, false)}</li>`).join('')}</ol>]
${isRoot ? '</div>' : ''}
`;
  } else if (isPlainObject(context)) {
    output += `
<input id="${inputId}" type="checkbox" class="echo" ${isRoot ? ' checked' : ''} />
{<label for="${inputId}"></label>
<ol>${Object.entries(context).map(([key, value]) => `<li><span class="string">"${key}"</span>: ${echo(value, false)}</li>`).join('')}</ol>}
`;
  } else if (typeof context === 'string') {
    output += `<span class="string">"${escape(context)}"</span>`;
  } else if (typeof context === 'function') {
    output += '<span class="type">function</span>';
  } else {
    output += `<span class="other">${context}</span>`;
  }

  output += isRoot ? '</div>' : '';

  return output;
};


module.exports = echo;
