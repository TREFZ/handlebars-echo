const escape = require('lodash/escape');
const isPlainObject = require('lodash/isPlainObject');

const css = '<style type="text/css">div.echo{position:relative;background:#24272e!important;color:#a1a9b7!important;padding:40px 20px 20px 20px!important;white-space:nowrap!important;font-size:12px!important;font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace!important;line-height:normal!important}.echo-display {overflow-x:scroll!important;position:absolute;left:0;top:40px;bottom:0;right:0;padding:20px;}input.echo{display:none!important}input.echo~label{display:inline-block!important;position:relative!important;margin:0 5px!important;padding:0!important;width:10px!important;height:10px!important;vertical-align:baseline!important;font-size:14px!important}input.echo~label:before{position:absolute!important;top:0!important;left:0!important;content:"\\25ba"!important;cursor:pointer!important;color:#56a6ed!important;font-size:10px!important;font-family:courier!important;line-height:1!important}input.echo:checked~label:before{content:"\\25bc"!important}input.echo~ol{position:relative!important;display:none!important;list-style-type:none!important;padding:0 0 0 20px!important;margin:0!important}input.echo:checked~ol{display:block!important}input.echo~ol li{align-items:center!important;color:#a1a9b7!important;position:relative!important;margin:0!important;padding:0!important}div.echo .type{color:#e1b870!important}div.echo .string{color:#8dbb6e!important}div.echo .other{color:#cb8f5b!important}.echo-path-input {position:absolute;top:10px;border:none;border-bottom:1px solid white;font-size:16px;color:white;outline:none;background:transparent;}div.echo .hilight .key,div.echo .hilight .value {color:#ffffff!important;padding:1px;}div.echo .array-item.hilight{color:#ffffff!important;}</style>';

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

function input(echoId) {
  return `<input class="echo-path-input" type="text" placeholder="Enter object path" list="echo-input-list-${echoId}" />
<datalist id="echo-input-list-${echoId}"></datalist>`;
}

function script(echoId) {
  return `<script type="text/javascript" data-echo="${echoId}">
window.handlebarsEcho = window.handlebarsEcho || function handlebarsEcho(echoId) {
  if (!echoId) return;
  const echoContainer = document.querySelector(\`div.echo[data-echo="\${echoId}"]\`);
  const echoInput = echoContainer.querySelector('input.echo-path-input');
  const echoDisplay = echoContainer.querySelector('.echo-display');
  const echoList = echoContainer.querySelector('datalist');

  // The list of nodes that are currently hilighted
  let hilighted = []; 

  // List of paths used to populate the autocomplete dropdown
  let autocompleteItems = [];
  let previousEchoPath = '';

  function openAncestor(current) {
    if (!current) return;
    const parent = current.parentNode.parentNode.closest('[data-path]');
    if (!parent) return;
    const ancestor = parent.querySelector('input[type="checkbox"][data-path]');
    if (!ancestor) return;
    ancestor.checked = true;
    openAncestor(ancestor);
  }

  function buildAutocomplete(echoPath = '', exactMatch = true) {
    // We don't want to re-draw if the path ends in a . (dot)
    const cleanEchoPath = echoPath.replace(/\.$/, '');
    if (previousEchoPath && cleanEchoPath === previousEchoPath) return;

    // Get the root node so we can try to build our autocomplete list
    // Handle this outside of the loop
    let levels;
    let root = echoDisplay;
    if (echoPath) {
      levels = echoPath.split('.');
      levels.pop();
      // This is the term that we want to autocomplete
      const previousMatch = levels.length ? levels.join('.') : '';
      root = previousMatch
        ? document.querySelector(\`li[data-path="root.\${previousMatch}"]\`)
        : root;
    }

    // find the containing LI tag from the matched
    const autocompleteSource = root.querySelector('ol');
    autocompleteItems = Array.from(autocompleteSource.children)
      .map(branch => \`<option>\${branch.dataset.path.replace('root.', '')}</option>\`);

    echoList.innerHTML = autocompleteItems.join('');
    previousEchoPath = echoPath;
  }

  // Default the autocomplete
  buildAutocomplete('', false)

  echoInput.addEventListener('input', event => {
    const { target } = event;
    const echoPath = target.value;

    // Redraw the autocomplete
    if (echoPath.endsWith('.') || (previousEchoPath && !echoPath)) buildAutocomplete(echoPath);

    // Try an exact match selector
    let nodes = Array.from(echoDisplay.querySelectorAll(\`li[data-path="root.\${echoPath}"]\`));
    const exactMatch = nodes.length;

    // Try a starts with selector
    if (!exactMatch && echoPath) {
      nodes = Array.from(echoDisplay.querySelectorAll(\`[data-path^="root.\${echoPath}"]\`));
    }

    // Update previous matched nodes
    hilighted.forEach(hilight => hilight.classList.remove('hilight'));
    hilighted = nodes;

    // update all matched ndoes
    nodes.forEach(pathNode => {
      // hilight startWith matches
      pathNode.classList.add('hilight');

      // hilight and expand exach match
      if (exactMatch) {
        const checkbox = document.querySelector(\`input[type="checkbox"][data-path="\${pathNode.dataset.path}"]\`);
        if (checkbox) {
          checkbox.setAttribute('checked', '');
          checkbox.checked = true;
          openAncestor(checkbox);
        }

        // Find element to scroll into view based on node type
        const isArrayItem = pathNode.classList.contains('array-item');
        const scrollToElement = isArrayItem ? pathNode : pathNode.querySelector('.key');
  
        // Scroll to the middle of the echo display
        const scrollY = echoDisplay.scrollTop;
        const { top: scrollToTop } = scrollToElement.getBoundingClientRect();
        const { height: displayHeight } = echoDisplay.getBoundingClientRect();

        const displayMiddle = displayHeight / 2;
        const scrollTo = scrollY + scrollToTop - displayMiddle;
        echoDisplay.scrollTo(0, scrollTo);
      }      
    });
  });
}
window.handlebarsEcho('${echoId}');
</script>`;
}

const echo = (context, isRoot = true, path = 'root') => {
  const echoId = isRoot ? generateRandomString() : '';
  const inputId = generateRandomString();

  let output = isRoot
    ? `${css}<div data-echo="${echoId}" class="echo">${input(echoId)}<div class="echo-display">`
    : '';

  if (Array.isArray(context)) {
    output += `
<input id="${inputId}" data-path="${path}" type="checkbox" class="echo"  ${isRoot ? ' checked' : ''} />
<span class="type"> array:${context.length}</span> [<label for="${inputId}"></label>
<ol>${context.map((value, index) => `<li class="array-item" data-path="${path}.${index}">${index}: ${echo(value, false, `${path}.${index}`)}</li>`).join('')}</ol>]
${isRoot ? '</div>' : ''}
`;
  } else if (isPlainObject(context)) {
    output += `
<input id="${inputId}" data-path="${path}" type="checkbox" class="echo" ${isRoot ? ' checked' : ''} />
{<label for="${inputId}"></label>
<ol>${Object.entries(context).map(([key, value]) => `<li data-path="${path}.${key}"><span class="string key">"${key}"</span>: ${echo(value, false, `${path}.${key}`)}</li>`).join('')}</ol>}
`;
  } else if (typeof context === 'string') {
    output += `<span class="string value">"${escape(context)}"</span>`;
  } else if (typeof context === 'function') {
    output += '<span class="type value">function</span>';
  } else {
    output += `<span class="other value">${context}</span>`;
  }

  output += isRoot ? `</div>${script(echoId)}</div>` : '';

  return output;
};


module.exports = echo;
