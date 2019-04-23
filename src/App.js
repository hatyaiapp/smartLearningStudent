import React, { Component } from 'react';
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
// import * as Sentry from '@sentry/browser';
// Sentry.init({ dsn: "https://ea9d64f5fc6943a9bac59a807051df3d@sentry.io/1431827" });

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // componentDidCatch(error, errorInfo) {
  //   this.setState({ error });
  //   Sentry.withScope(scope => {
  //     Object.keys(errorInfo).forEach(key => {
  //       scope.setExtra(key, errorInfo[key]);
  //     });
  //     Sentry.captureException(error);
  //   });
  // }

  render() {
    // if (this.state.error) {
    //   //render fallback UI
    //   return (
    //     <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
    //   );
    // }

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
          </Switch>
        </div>
      </Router>
    )
  }

}



function register({ match }) {
  return (
    <Register ac={match.params.code} />
  );
}
export default Nav
