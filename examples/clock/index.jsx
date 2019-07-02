import TinyJSX, { createRef } from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import Clock from '../components/Clock';

render(<Clock ref={createRef()} color="red" />, document.body);
