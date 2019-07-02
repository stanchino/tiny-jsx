import TinyJSX, { createContext } from 'tiny-jsx';
import { Link, Route, Switch } from 'tiny-jsx/router';

import Clock from '../Clock';
import TodoList from '../TodoList';

const Context = createContext();

function Page() {
  return (
    <Context.Provider value={{ test: 'context value 1' }}>
      <Context.Consumer>
        {ctx => {
          const v =  ctx.test;
          ctx.test = 'context value 2';
          return v;
        }}
      </Context.Consumer>
      <div>Page 2</div>
      <Context.Consumer>
        {ctx => {
          return ctx.test;
        }}
      </Context.Consumer>
    </Context.Provider>
  );
}

function Routes() {
  return (
    <>
      <nav>
        <Link to="/routes/">Home</Link>
        <Link to="/routes/#page1">Page 1</Link>
        <Link to="/routes/#page2">Page 2</Link>
        <Link to="/routes/#clock">Clock</Link>
        <Link to="/routes/#todos">ToDos</Link>
        <Link to="/routes/#dynamic/a/b">Dynamic Routes</Link>
      </nav>
      <Switch>
        <Route path="/routes/"><div>Home</div></Route>
        <Route path="/routes/#clock"><Clock /></Route>
        <Route path="/routes/#clock"><Clock /></Route>
        <Route path={["/routes/#todos", /^\/routes\/#dynamic\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i]}><TodoList /></Route>
        <Route path={/^\/routes\/#dynamic\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i}><TodoList /></Route>
        <Route path={/^\/routes\/#dynamic\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i}><TodoList /></Route>
        <Route path={/^\/routes\/#dynamic\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i}><TodoList /></Route>
        <Route path={/^\/routes\/#dynamic\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i} render={({ match: { params: [a, b] } }) => {
          return `matches: /${a}/${b}/`;
        }} />
        <Route path="/routes/#page1" render={() => (<div>Page 1</div>)} />
        <Route path="/routes/#page2" component={Page} />
      </Switch>
    </>
  );
}

export default Routes;
