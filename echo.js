const _ = require('lodash');

const css = '<style type="text/css">div.echo{background:#24272e;color:#a1a9b7;padding:20px;overflow-x:scroll;white-space:nowrap;font-size:12px;font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;line-height:normal}input.echo{display:none}input.echo~label{display:inline-block;position:relative;margin:0 5px;padding:0;width:10px;height:10px;vertical-align:baseline;font-size:14px}input.echo~label:before{position:absolute;top:0;left:0;content:"\\25ba";cursor:pointer;color:#56a6ed;font-size:10px;font-family:courier;line-height:1}input.echo:checked~label:before{content:"\\25bc"}input.echo~ol{position:relative;display:none;list-style-type:none;padding:0 0 0 20px;margin:0}input.echo:checked~ol{display:block}input.echo~ol li{align-items:center;color:#a1a9b7;position:relative;margin:0;padding:0}div.echo .type{color:#e1b870}div.echo .string{color:#8dbb6e}div.echo .other{color:#cb8f5b}</style>';

// Unique id for each input+label combination.
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ID_LENGTH = 8;

const generateRandomString = () => {
  let rtn = '';
  let i = 0;
  while (i < ID_LENGTH) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    i += 1;
  }
  return rtn;
};

const echo = (context, isRoot = true) => {
  const inputId = generateRandomString();
  let output = isRoot ? `${css}<div class="echo">` : '';

  if (_.isArray(context)) {
    output += `
      <input id="${inputId}" type="checkbox" class="echo"  ${isRoot ? ' checked' : ''} />
      <span class="type"> array:${context.length}</span> [<label for="${inputId}"></label>
      <ol>${_.map(context, (value, index) => `<li>${index}: ${echo(value, false)}</li>`).join('')}</ol>]
      ${isRoot ? '</div>' : ''}
    `;
  } else if (_.isPlainObject(context)) {
    output += `
        <input id="${inputId}" type="checkbox" class="echo" ${isRoot ? ' checked' : ''} />
        {<label for="${inputId}"></label>
        <ol>${_.map(context, (value, key) => `<li><span class="string">"${key}"</span>: ${echo(value, false)}</li>`).join('')}</ol>}
    `;
  } else if (_.isString(context)) {
    output += `<span class="string">"${_.escape(context)}"</span>`;
  } else if (_.isFunction(context)) {
    output += '<span class="type">function</span>';
  } else {
    output += `<span class="other">${context}</span>`;
  }

  output += isRoot ? '</div>' : '';

  return output;
};

module.exports = echo;
