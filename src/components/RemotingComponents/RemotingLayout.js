import React from 'react';
import { NavLink } from 'react-router-dom';


const RemotingLayout = ({ children, headingcontent }) => (
  <div id="content">
    <div className="page-title">
      <h1 style={{ position: 'unset', textTransform: 'none', paddingBottom: '10px'}}><i className="fa fa-desktop fa-fw fa-md" />&nbsp;&nbsp;{headingcontent }</h1>
    </div>
    {/*
    <div className="container-fluid">
      <nav className="floating-nav">
        <div className="f-nav-content">
          <ul>
            <li>
              <NavLink to="/remoting-realtime-operating" className="nav-link" activeClassName="active">
                <i className="fa fa-user fa-2x"/>
                <div className="fit-text">
                  <span>Realtime Operating</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-reading" className="nav-link" activeClassName="active">
                <i className="fa fa-building fa-2x"/>
                <div className="fit-text">
                  <span>Reading</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-settings" className="nav-link" activeClassName="active">
                <i className="fa fa-cogs fa-2x"/>
                <div className="fit-text">
                  <span>Setting</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-advanced-settings" className="nav-link" activeClassName="active">
                <i className="fa fa-cogs fa-2x"/>
                <div className="fit-text">
                  <span>Advanced Setting</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-security" className="nav-link" activeClassName="active">
                <i className="fa fa-mobile fa-2x"/>
                <div className="fit-text">
                  <span>Security</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-terminal" className="nav-link" activeClassName="active">
                <i className="fa fa-bolt fa-2x"/>
                <div className="fit-text">
                  <span>Terminal</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-meter-download" className="nav-link" activeClassName="active">
                <i className="fa fa-download fa-2x"/>
                <div className="fit-text">
                  <span>Meter Download</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/remoting-tariff-update" className="nav-link" activeClassName="active">
                <i className="fa fa-paper-plane-o fa-2x"/>
                <div className="fit-text">
                  <span>Tariff Update Result</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    */}

    <div className="container-fluid">
      {children}
    </div>
  </div>
);

export default RemotingLayout;
