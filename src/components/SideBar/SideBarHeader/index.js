import React from 'react';
import { Link } from 'react-router-dom';



const SideBarHeader = ({ toggleDashboard, logoutHandler, dashboard_toggle_login, toggle_val }) => (
  
  <header id="header" className="header affix" role="banner">
    <nav className="header-navbar">
      <div className="navbar-header clearfix">
        <a className="navbar-toggle collapsed"  onClick={dashboard_toggle_login} >
          <span className="sr-only">Toggle navigation</span>
          <i className="fa fa-plus"></i>
        </a>

        <a className="logo pull-left" href="avascript:void(0)">
          <img src="assets/img/core/logo-h.png" width="216" alt="VE"/>
        </a>

        <a className="sidebar-switch pull-right" onClick={toggleDashboard}><span className="icon fa" /></a>
      </div>

      <div className= {toggle_val + " navbar-collapse" }  id="mini-navbar-collapse">
        <form className="navbar-form navbar-left" role="search">
          <div className="input-group input-group-sm">
            <input type="text" className="form-control" placeholder="Search"/>
            <span className="input-group-btn">
            <button className="btn" type="button"><i className="fa fa-search" /></button>
            </span>
          </div>
        </form>

        <ul className="nav navbar-nav navbar-right">
          <li>
            <a className="button-switch">
              <i className="fa fa-wrench" />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a > {/*href="page-lock.html"*/}
              <i className="fa fa-lock" />
              <span>Password </span>
            </a>
          </li>
          <li className="turn-off" onClick={logoutHandler}>
            <a>
              <i className="fa fa-power-off" />
              <span>Log Out</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default SideBarHeader;


