import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';
import { signup, signInWithGoogle } from '../../helpers/auth';
import Button from '../../components/button/button';
import Logo from '../../components/logo/logo';

export default class SignUp extends Component {
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
      await signup(this.state.email, this.state.password);
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
      <div className="auth signup">
        <Logo />
        <div className="space-xlarge" />

        <Button onClick={this.googleSignIn} type="button">
          Sign up with Google
        </Button>

        {!this.state.showForm && (
          <div
            className="email-toggle"
            onClick={() => this.setState({ showForm: true })}
          >
            Or create an account using your email addres
          </div>
        )}

        {this.state.showForm && (
          <form onSubmit={this.handleSubmit}>
            <p>Or create an account using your email address</p>
            <div>
              <input
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.handleChange}
                value={this.state.email}
              ></input>
            </div>
            <div>
              <input
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
              ></input>
            </div>
            <div>
              {this.state.error ? <p>{this.state.error}</p> : null}
              <Button type="submit">Sign up</Button>
            </div>

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        )}
      </div>
    );
  }
}
