import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Profile from './pages/profile/profile';
import Lobby from './pages/lobby/lobby';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import Game from './pages/game/game';
import { auth } from './services/firebase';
import PrivateRoute from './helpers/private-route';
import PublicRoute from './helpers/public-route';
import Loader from './components/loader/loader';

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      <Loader />
    ) : (
      <Router>
        <Switch>
          <Redirect exact path="/" to="login"></Redirect>
          <PublicRoute
            path="/login"
            authenticated={this.state.authenticated}
            component={Login}
          />
          <PublicRoute
            path="/signup"
            authenticated={this.state.authenticated}
            component={Signup}
          />

          <PrivateRoute
            path="/profile"
            authenticated={this.state.authenticated}
            component={Profile}
          />

          <PrivateRoute
            path="/lobby"
            authenticated={this.state.authenticated}
            component={Lobby}
          ></PrivateRoute>

          <PrivateRoute
            path="/game/:id"
            authenticated={this.state.authenticated}
            component={Game}
          ></PrivateRoute>
        </Switch>
      </Router>
    );
  }
}

export default App;
