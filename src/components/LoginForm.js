import React from 'react';
import { Button, Form, Input } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onAuth(values.userName, values.password);
      }
    });
  };

  componentDidMount() {

    document.title = "Vertex AMR - Registration";//woww graet works easily

  }  

  render() {
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (<p>{this.props.error.message}</p>);
    } else if (this.props.token !== null) {
      window.location = '/remoting-reading';
    }

    document.body.classList.add('page-membership');

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <div className="wrapper">
          <div className="member-container">
            <div className="app-logo">
              <Link to='/login' >
                <img src="assets/img/core/logo.png" alt="Quarca Logo" />
              </Link>
            </div>

            <div className="member-container-inside">
              {errorMessage}
              <Form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <Form.Item>
                    {getFieldDecorator('userName', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      <Input className="form-control" placeholder="Username" />
                    )}
                  </Form.Item>
                </div>

                <div className="form-group">
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Input type="password" className="form-control" placeholder="Password" />
                    )}
                  </Form.Item>
                </div>

                <div className="form-group"><p><a href="#">Forgot Password?</a></p></div>

                <div className="form-group">
                  <Button type="primary" className="btn btn-success btn-block" htmlType="submit">Login</Button>
                </div>
              </Form>
            </div>

            <p><small>Copyright &copy; 2018 Vertex AMI.</small></p>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    token: state.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) => dispatch(actions.authLogin(username, password))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm);
