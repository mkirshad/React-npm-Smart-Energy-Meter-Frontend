import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getGraphData } from '../../API/readings';
import DashboardTabUser from './DashboardTabUser';
import OperatingLog from './OperatingLog';
import $ from "jquery";


class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph_data_1: null,
      graph_data_2: null,
      graph_data_3: null,
      meters: null,
      terminals: null,
      customers: null,
      menu: false,
      par: props.match.params.para_ID,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const instance = this;

    const res = await getGraphData();
    if (res.fail) {
      console.log('DASHBOARD DATA FETCH FAILED -> ', res);
    } else {
      instance.setState({
        graph_data_1: res.data_1,
        graph_data_2: res.data_2,
        graph_data_3: res.data_3,
        terminals: res.terminals,
        customers: res.customers,
        meters: res.meters,
      });

      $.plot(
        $("#monthly-stats"),
        [{ data: instance.state.graph_data_1 }, { data: instance.state.graph_data_2 }, { data: instance.state.graph_data_3 }],
        {
          lines: {
            show: true,
            lineWidth: 0,
            fill: true
          },
          points: {
            show: false,
            radius: 3,
          },
          shadowSize: 0,
          grid: {
            clickable: true,
            hoverable: true,
            borderWidth: 1,
            borderColor: "#f6f6f6",
            tickColor: "#f6f6f6",
          },
          colors: ["#d2527f", "#19B5FE", "#e26a6a"],
          tooltip: true,
          tooltipOpts: {
            content: "%x = %y",
            backgroundColor: "#000000",
          },
        }
      );
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onAuth(values.userName, values.password);
      }
    });
  };

  render() {
    if (localStorage.getItem('token') === null) {
      window.location = '/login';  
    }
    const path = window.location.pathname;
    return (
      <div id="content">
        <div className="container-fluid">
          <div className="drag-drop">
            <div id="widgets-container" className="grid-stack cols-4">
              <div className="grid-stack-item"
                   data-gs-auto-position="yes"
                   data-gs-width="3" data-gs-height="4"
                   data-gs-min-width="2" data-gs-min-height="4">
                <div className="grid-stack-item-content">
                  <div className="widget widget-monthly-statistics">
                    <span className="drag fa" />
                    <div className="widget-content container-fluid">
                      <div className="row text-center">
                        <div className="col-xs-4">
                          <div className="fit-text">
                            <h4>Collection Performance</h4>
                            <h5>67%</h5>
                            <span className="label label-success" style={{ background: '#d2527f' }}>
                            <i className="fa fa-arrow-circle-up" /> 100.00%</span><br/>
                            <small>on last month</small>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <div className="fit-text">
                            <h4>Average Online Rate</h4>
                            <h5>$1655</h5>
                            <span className="label label-success" style={{ background: '#19B5FE' }}>
                            <i className="fa fa-arrow-circle-up" /> 70.00%</span><br/>
                            <small>on last month</small>
                          </div>
                        </div>

                        <div className="col-xs-4">
                          <div className="fit-text">
                            <h4>Profit</h4>
                            <h5>$5075</h5>
                            <span className="label label-danger" style={{ background: '#e26a6a' }}>
                              <i className="fa fa-arrow-circle-down" /> 1.0%</span><br/>
                            <small>on last month</small>
                          </div>
                        </div>
                      </div>
                      <div className="flot-chart monthly-statistics-chart"><div id="monthly-stats" className="flot line" /></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-stack-item"
                   data-gs-no-resize="yes"
                   data-gs-auto-position="yes"
                   data-gs-width="1" data-gs-height="1" style={{ height: '150px' }}>
                <div className="grid-stack-item-content">

                  <div className="widget social-stats">
                    <span className="drag fa" />
                    <div className="widget-content">
                      <div className="item social twitter">
                        <span className="social-title">Number of Meter</span>
                        <span className="social-count">{this.state.meters}
                          <small>NEW</small></span>
                        <span className="social-icon"><i className="fa fa-bar-chart" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-stack-item"
                   data-gs-no-resize="yes"
                   data-gs-auto-position="yes"
                   data-gs-width="1" data-gs-height="1" style={{ height: '150px', top: '160px' }}
              >
                <div className="grid-stack-item-content">
                  <div className="widget social-stats">
                    <span className="drag fa" />
                    <div className="widget-content">
                      <div className="item social linkedin">
                        <span className="social-title">Number of Customer</span>
                        <span className="social-count">{this.state.customers}
                          <small>NEW</small></span>
                        <span className="social-icon"><i className="fa fa-users" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-stack-item"
                   data-gs-no-resize="yes"
                   data-gs-auto-position="yes"
                   data-gs-width="1" data-gs-height="1" style={{ height: '150px', top: '320px' }}
              >
                <div className="grid-stack-item-content">
                  <div className="widget social-stats">
                    <span className="drag fa" />
                    <div className="widget-content">
                      <div className="item social youtube">
                        <span className="social-title">Number of Terminal</span>
                        <span className="social-count">{this.state.terminals}
                          <small>NEW</small></span>
                        <span className="social-icon"><i className="fa fa-code-fork" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-stack-item"
                   data-gs-auto-position="yes"
                   data-gs-width="4" data-gs-height="1"
                   data-gs-max-height="1"
              >
                <div className="grid-stack-item-content">
                  <div className="widget widget-quick-alerts">
                    <span className="drag fa" />
                    <div className="widget-content">
                      <ul className="quick-alerts">
                        <li>
                          <Link to='/rules'>
                            <i className="fa fa-tasks fa-2x" />
                            <div className="fit-text">
                              <span>Role</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link to='/users'>
                            <i className="fa fa-user fa-2x" />
                            <div className="fit-text"><span>User</span></div>
                          </Link>
                        </li>
                        <li>
                          <a href="#" aria-controls="emails" data-toggle="tab">
                            <i className="fa fa-bullhorn fa-2x" />
                            <div className="fit-text"><span>Notice Management</span></div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-crosshairs fa-2x" />
                            <div className="fit-text"><span>Operating Log</span></div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-external-link fa-2x" />
                            <div className="fit-text"><span>Login Log</span></div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-newspaper-o fa-2x" />
                            <div className="fit-text"><span>My Notice</span></div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-thumbs-up fa-2x" />
                            <div className="fit-text"><span>Subscribe</span></div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {
                path == '/dashboard' ? <DashboardTabUser/> : <OperatingLog/>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardHome);
