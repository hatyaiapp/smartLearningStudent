import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Login from './pages/Login'
import Test from './pages/Test'
import User from './pages/User'

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Login} />
      <Route exact path="/test" component={Test} />
      <Route exact path="/user" component={User} />
    </div>
  </Router>
)
export default BasicExample
