# TinyJSX

TinyJSX is a lightweight UI JavaScript library for developing user interfaces using functional components.

---

## Usage
TinyJSX exposes an API which mimics the recent React Hooks implementation but is lightweight (1.34KB gzipped) and fast.

> TinyJSX supports **only** functional components
 
```jsx
import TinyJSX, { useEffect, useState } from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';

function Clock () {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(tick => tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div>Seconds: {tick}</div>
  );
}

render(<Clock />, document.body);
```

## Getting Started

### Install
```bash
$ npm install --save tiny-jsx
```
or
```bash
$ yarn add tiny-jsx
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
_([here's how](http://jasonformat.com/wtf-is-jsx))_. In order to render the Virtual DOM elements in a browser, TinyJSX
provides a `render()` function that creates the corresponding DOM tree and renders it to an element from the existing DOM tree.

```jsx
import TinyJSX, { render } from 'tiny-jsx';

render(<div>Hello World!</div>, document.body);
```
