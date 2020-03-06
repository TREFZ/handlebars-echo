# handlebars-echo

Echo is a debugging tool. A Handlebars helper to output a navigable, visual representation of data.

![Example echo output](/example.png?raw=true "Example echo output")

## Installation
```bash
npm i --save handlebars-echo
```

## Register echo as a helper
```javascript
const echo = require('handlebars-echo');

Handlebars.registerHelper('echo', echo);
```

## Usage
```handlebars
<!-- View the root context -->
{{{ echo @root }}}

<!-- View the currently scoped context -->
{{{ echo this }}}

<!-- View anything! -->
{{{ echo path.to.my.nested.value }}}
```

## License
MIT
