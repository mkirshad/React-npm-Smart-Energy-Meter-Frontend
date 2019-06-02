  import React, { Component } from 'react';
  import { Form, Icon, Input, Button,Spin} from 'antd';
  import { connect } from 'react-redux';
  import { NavLink } from 'react-router-dom';
  import * as actions from '../store/actions/auth';


  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


  
  class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.props.onAuth(values.userName,values.password);
        }


          console.log(this.props.token); //gives null even if authenticated
      });
          
         
          
         


    }
  
    render() {
        
      let errorMessage = null;
      if(this.props.error) {
        errorMessage = (
            <p> {this.props.error.message}  </p>
        );
         

        }
        else if(this.props.token !== null){
          //console.log(this.props.error.message); 
          this.props.history.push('/');
  
  
        }
      
      
      



      const { getFieldDecorator } = this.props.form;
      return (
          <div>
              {errorMessage}
            {
                    
                   this.props.loading ?


                   <Spin indicator={antIcon} />


                   :

                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit"  style={{marginRight: '10px' }} >
                        Login
                        </Button>   
                        or
                        <NavLink   style={{marginLeft: '5px' }} to= '/signup/'>
                        Signup


                        </NavLink>    


                    </Form.Item>
                    </Form>

            }        

        </div>
      );
    }
  }
  


  const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

  const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error,
        token: state.token
 
    }
 
 }




 const mapDispatchToProps = dispatch => {
  return {
      onAuth: (username,password) => dispatch(actions.authLogin(username,password))

  }

}


  
 export default  connect(mapStateToProps, mapDispatchToProps)( WrappedNormalLoginForm );