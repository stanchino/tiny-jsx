import TinyJSX from 'tiny-jsx';
import useMemo from 'tiny-jsx/hooks/useMemo';
import useState from 'tiny-jsx/hooks/useState';

export default function TodoList ({ todos: defaultTodos = [] }) {
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

  return (
    <div>
      <form onSubmit={addTodo}>
        <input type="text" value={text} onInput={changeText} />
        <button type="submit">Add</button>
      </form>
      {todos.length > 0 && (
        <ul>
          {todos.map((text, key) => (
            <li>
              {text}
              <button type="button" onClick={removeTodo(key)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
