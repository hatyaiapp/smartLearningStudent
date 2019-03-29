import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom'
import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import Test from './pages/Test'
import User from './pages/User'
import Setting from './pages/Setting'

function Nav() {
  window.language = window.localStorage.getItem('language') ? window.localStorage.getItem('language') : 'th'
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/test" component={Test} />
          <Route path="/user" component={User} />
          <Route path="/setting" component={Setting} />
          <Route path="/register/:code" component={register} />
          <Route path="/register/" component={Register} />
        </Switch>น้า
      </div>
    </Router>
  )
}



function register({ match }) {
  return (
    <Register ac={match.params.code} />
  );
}
export default Nav
