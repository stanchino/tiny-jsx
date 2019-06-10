import TinyJSX from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import useMemo from 'tiny-jsx/hooks/useMemo';
import useState from 'tiny-jsx/hooks/useState';

function TodoList ({ todos: defaultTodos }) {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(defaultTodos);

  const addTodo = useMemo(() => event => {
    event.preventDefault();
    setTodos(prev => [].concat([text], prev));
    setText('');
  }, [text]);

  const removeTodo = useMemo(() => key => event => {
    event.preventDefault();
    setTodos(todos.slice(0, key).concat(todos.slice(key + 1)));
  }, [todos]);

  const changeText = useMemo(() => event => {
    setText(event.target.value);
  }, [setText]);

  console.log(todos);
  return (
    <>
      <form onSubmit={addTodo}>
        <input value={text} onInput={changeText} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((text, key) => (
          <li>
            {text}
            <button type="button" onClick={removeTodo(key)}>Remove</button>
          </li>
        ))}
      </ul>
    </>
  )
}

render(<TodoList todos={['a', 'b', 'c']} />, document.body);
