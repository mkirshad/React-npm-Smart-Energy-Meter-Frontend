import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as   Router } from 'react-router-dom';
import LoginRouter from './LoginRouter';
import { connect } from 'react-redux';
import * as actions from './store/actions/auth';

class AppLogin extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div>
        <Router>
          <LoginRouter/>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLogin);
