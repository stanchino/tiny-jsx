# TinyJSX

TinyJSX is a lightweight UI JavaScript library for developing user interfaces using functional components.

![David](https://img.shields.io/david/stanchino/tiny-jsx.svg)
![David](https://img.shields.io/david/peer/stanchino/tiny-jsx.svg)
![David](https://img.shields.io/david/optional/stanchino/tiny-jsx.svg)
![David](https://img.shields.io/david/dev/stanchino/tiny-jsx.svg)

GZip packages sizes

[![tiny-jsx.min.js.gz](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx.min.js.gz?label=tiny-jsx
)](https://unpkg.com/tiny-jsx/tiny-jsx.min.js.gz)
[![tiny-jsx-hooks.min.js.gz](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-hooks.min.js.gz?label=tiny-jsx-hooks
)](https://unpkg.com/tiny-jsx/tiny-jsx-hooks.min.js.gz)
[![tiny-jsx-dom.min.js.gz](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-dom.min.js.gz?label=tiny-jsx-dom
)](https://unpkg.com/tiny-jsx/tiny-jsx-dom.min.js.gz)
[![tiny-jsx-router.min.js.gz](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-router.min.js.gz?label=tiny-jsx-router
)](https://unpkg.com/tiny-jsx/tiny-jsx-router.min.js.gz)

Brotli packages sizes

[![tiny-jsx.min.js.br](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx.min.js.br?label=tiny-jsx
)](https://unpkg.com/tiny-jsx/tiny-jsx.min.js.br)
[![tiny-jsx-hooks.min.js.br](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-hooks.min.js.br?label=tiny-jsx-hooks
)](https://unpkg.com/tiny-jsx/tiny-jsx-hooks.min.js.br)
[![tiny-jsx-dom.min.js.br](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-dom.min.js.br?label=tiny-jsx-dom
)](https://unpkg.com/tiny-jsx/tiny-jsx-dom.min.js.br)
[![tiny-jsx-router.min.js.br](https://badgen.net/badgesize/normal/https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-router.min.js.br?label=tiny-jsx-router
)](https://unpkg.com/tiny-jsx/tiny-jsx-router.min.js.br)

---

## Usage
TinyJSX exposes an API which mimics the recent React Hooks implementation but is really small.

> TinyJSX supports **only** functional components.
 
```jsx
import TinyJSX from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import useEffect from 'tiny-jsx/hooks/useEffect';
import useState from 'tiny-jsx/hooks/useState';

function Clock () {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div>Seconds: {tick}</div>
  );
}

render(<Clock />, document.body);
```

> For smaller bundle sizes all hooks are exported on their own. You can still import the hooks from the above example
like this:
```jsx
import { useState, useEffect } from 'tiny-jsx/hooks';
```

## Examples
Some simple examples can be found in the [examples](./examples) directory. You can also see the library in action
using the UMD builds here:

* [Clock](./examples/clock-umd/index.html)
* [ToDos](./examples/todos-umd/index.html)
* [Router](./examples/router-umd/)

## Getting Started

### Install

When using NodeJS with `yarn` or `npm`
```bash
$ yarn add tiny-jsx
or
$ npm install --save tiny-jsx
```
or in the browser
```html
<script defer type="text/javascript" src="https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx.min.js"></script>
<script defer type="text/javascript" src="https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-hooks.min.js"></script>
<script defer type="text/javascript" src="https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-dom.min.js"></script>
<script defer type="text/javascript" src="https://unpkg.com/tiny-jsx@1.0.14/tiny-jsx-router.min.js"></script>

```

### Import

The `tiny-jsx` library allows for using named and default exports.

#### Named Imports:

```js
import { createElement } from 'tiny-jsx';

// Tell Babel to transform JSX into createElement() calls:
/** @jsx createElement */
```

#### Default Imports:

```js
import TinyJSX from 'tiny-jsx';

// Tell Babel to transform JSX into TinyJSX.createElement() calls:
/** @jsx TinyJSX.createElement */
```

Instead of declaring the `@jsx` pragma you can use it globally by adding it to your Babel config file

**For Babel 5 and prior:**
```json
{ "jsxPragma": "TinyJSX.createElement" }
```

**For Babel 6:**
Install the [transform-react-jsx](https://babeljs.io/docs/en/6.26.3/babel-plugin-transform-react-jsx) plugin and add it to the configuration file:

```json
{
  "plugins": [
     ["transform-react-jsx", { "pragma": "TinyJSX.createElement" }]
  ]
}
```

**For Babel 7:**
Install the [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx) 
plugin and add it to the configuration file:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", { "pragma": "TinyJSX.createElement", "pragmaFrag": "TinyJSX.Fragment" }]
  ]
}
```

**For TypeScript add to `tsconfig.json`:**

```json
{
  "jsx": "react",
  "jsxFactory": "TinyJSX.createElement"
}
```

### Rendering
The TinyJSX transpile function converts JSX components into Virtual DOM elements 
_([as describe here](http://jasonformat.com/wtf-is-jsx))_. In order to render the Virtual DOM elements in a browser, TinyJSX
provides a `render()` function that creates the corresponding DOM tree and renders it into an element from the existing DOM tree.

```jsx
import TinyJSX from 'tiny-jsx';
import { render } from 'tiny-jsx/dom'; 

render(<div>Hello World!</div>, document.body);
```
