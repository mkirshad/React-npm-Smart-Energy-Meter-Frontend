import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppLogin from './AppLogin';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './store/reducers/auth';
import './navigationStyles.css';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose ;
const store = createStore(reducer, composeEnhances(
  applyMiddleware(thunk)
));

const app = (
  <Provider  store = {store}>
    <App />
  </Provider>
);

const app_login = (
  <Provider store = {store}>
    <AppLogin />
  </Provider>
);

if(localStorage.getItem('token') === null ) {
  ReactDOM.render(app_login, document.getElementById('root'));
} else {
  ReactDOM.render(app, document.getElementById('root'));
}
