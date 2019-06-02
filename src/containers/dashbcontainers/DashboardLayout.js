import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import SideBarProfile from '../../components/SideBar/SideBarProfile';
import SideBarHeader from '../../components/SideBar/SideBarHeader';
import NotificationsTab from '../../components/SideBar/NotificationsTab';
import EmailsTab from '../../components/SideBar/EmailsTab';
import NavigationTab from "../../components/SideBar/NavigationTab";
import * as actions from '../../store/actions/auth';

const { Content } = Layout;

class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      collapse: "collapse",
      expanded_1: false,
      collapse_1: "collapse",
      sty: '0px',
      styl: ['0px', '0px', '0px', '0px', '0px', '0px'],
      expnd: [false, false, false, false, false, false],
      collp: ["collapse", "collapse", "collapse", "collapse", "collapse", "collapse"],
      actv: ["", "", "", "", "", ""],
      act: ["abcd"],
      active_1: "",
      active_2: "",
      dashboard: "",
      dashboard_toggle_login:"collapse"
    };
    this.toggledashboard = this.toggledashboard.bind(this);
    this.toggledashboard_toggle_login = this.toggledashboard_toggle_login.bind(this);
  }

  toggledashboard() {
    if (this.state.dashboard === "") {
      if (window.innerWidth < 1170) {
        this.setState({ dashboard: " sidebar-toggle-sm" });
      } else {
        this.setState({ dashboard: " sidebar-toggle" });
      }
    } else {
      this.setState({ dashboard: "" });
    }
  }


  toggledashboard_toggle_login()  {
    console.log("inise");
    if (this.state.dashboard_toggle_login === "collapse") {
      if (window.innerWidth < 1170) {
        this.setState({ dashboard_toggle_login: "collapse in" });
      }

    } else {
      this.setState({ dashboard_toggle_login: "collapse" });
    } 
    
  }



  render() {
    if (localStorage.getItem('token') === null) {
      window.location = '/login';
    }
    return (
      <Layout className="layout">
        <div className={"wrapper dashboard" + this.state.dashboard}>
          <SideBarHeader
            toggleDashboard={this.toggledashboard}
            dashboard_toggle_login={this.toggledashboard_toggle_login}
            toggle_val={this.state.dashboard_toggle_login}
            logoutHandler={this.props.logout}
          />

          <Content>
            <aside id="sidebar" className="sidebar affix" role="complementary">
              <div className="sidebar-container">
                <div className="sidebar-scrollpane">
                  <div className="sidebar-content">
                    <SideBarProfile />

                    <div role="tabpanel">
                      <ul className="tab-nav" role="tablist">
                        <li role="presentation" className="active">
                          <a href="#nav" aria-controls="nav" role="tab" data-toggle="tab">
                            <i className="fa fa-navicon"></i>
                          </a>
                        </li>
                        <li role="presentation">
                          <a href="#emails" aria-controls="emails" role="tab" data-toggle="tab">
                            <i className="fa fa-bullhorn"></i>
                            <span className="badge">6</span>
                          </a>
                        </li>
                        <li role="presentation">
                          <a href="#notifications" aria-controls="notifications" role="tab" data-toggle="tab">
                            <i className="fa fa-bell-o"></i>
                            <span className="badge">8</span>
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <NavigationTab />
                        <EmailsTab />
                        <NotificationsTab />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="main">
              {this.props.children}
              <footer id="footer" role="contentinfo">
                Copyright 2018 Vertex
              </footer>
            </div>
          </Content>
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  }
};

export default connect(null, mapDispatchToProps)(DashboardLayout);
