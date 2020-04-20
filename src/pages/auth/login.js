import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';
import { signin, signInWithGoogle } from '../../helpers/auth';
import Button from '../../components/button/button';
import Logo from '../../components/logo/logo';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
      showForm: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div className="auth login">
        <Logo />
        <div className="space-xlarge" />
        <Button type="button" onClick={this.googleSignIn}>
          Sign in with Google
        </Button>

        {!this.state.showForm && (
          <div
            className="email-toggle"
            onClick={() => this.setState({ showForm: true })}
          >
            Or use email to login
          </div>
        )}

        {this.state.showForm && (
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <p>Or use email to login</p>
            <div>
              <input
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
            <div>
              <input
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
              />
            </div>
            <div>
              {this.state.error ? <p>{this.state.error}</p> : null}
              <Button type="submit">Login</Button>
            </div>{' '}
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        )}
      </div>
    );
  }
}
