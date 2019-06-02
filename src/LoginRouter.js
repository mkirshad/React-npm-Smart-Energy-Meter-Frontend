import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LoginForm  from './components/LoginForm';
import DashboardHome from "./components/dashbcomponents/DashboardHome";
import Reading from "./components/RemotingComponents/pages/Reading";

const LoginRouter = () => (
   <div>
       <Route exact path='/login'  component={ LoginForm } />
       <Route exact path='/'  component={ LoginForm } />
       <Route exact path='/dashboard'  component={LoginForm  } />
       <Route exact path='/remoting-reading'  component={LoginForm  } />
       <Route exact path='/remoting-realtime-operating'  component={LoginForm  } />
       <Route exact path='/remoting-settings'  component={LoginForm  } />
       <Route exact path='/analysis-raw-data'  component={LoginForm  } />
       <Route exact path='/analysis-hourly-consumption'  component={LoginForm  } />
       


   </div>



);


export default LoginRouter;