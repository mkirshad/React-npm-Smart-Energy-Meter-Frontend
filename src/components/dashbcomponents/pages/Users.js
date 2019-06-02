import React from 'react';
import ContentContainer from '../../ContentContainer';
import HomeLayout from '../HomeLayout';
import RegistrationForm from './RegistrationForm';


class Users extends React.Component {
  render() {
    return (
      <HomeLayout>
        <React.Fragment>
          {/*<RegistrationForm/> */}<h1>This is USERS</h1>
        </React.Fragment>
      </HomeLayout>

    )
  }
}

export default Users;
