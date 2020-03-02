A Handlebars utility helper to output a navigable, visual representation of data.
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
<!-- View the root object -->
{{{ echo @root }}}

<!-- View the currently scoped context -->
{{{ echo this }}}
```

## License
MIT
