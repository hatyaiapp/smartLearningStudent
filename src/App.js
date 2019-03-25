import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom'
import Login from './pages/Login'
import Test from './pages/Test'
import User from './pages/User'

const BasicExample = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Test} />
        <Route path="/user" component={User} />
      </Switch>
    </div>
  </Router>
)
export default BasicExample
