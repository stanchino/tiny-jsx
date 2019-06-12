import TinyJSX from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import TodoList from '../components/TodoList';

render(<TodoList todos={['a', 'b', 'c']} />, document.body);
