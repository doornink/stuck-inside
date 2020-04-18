import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Profile from './pages/profile';
import Lobby from './pages/lobby';
import Signup from './pages/signup';
import Login from './pages/login';
import Game from './pages/game';
import { auth } from './services/firebase';
import PrivateRoute from './helpers/private-route';
import PublicRoute from './helpers/public-route';

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
      <h2>Loading...</h2>
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
