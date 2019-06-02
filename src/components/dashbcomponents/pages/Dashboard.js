import React from 'react';
import ContentContainer from '../../ContentContainer';
import { getGraphData } from '../../../API/readings';
import $ from "jquery";
import HomeLayout from '../HomeLayout';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph_data_1: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const instance = this;
    document.title = "Vertex AMR - Dashboard";//woww graet works easily

    const res = await getGraphData();
    if (res.fail) {
      console.log('DASHBOARD DATA FETCH FAILED -> ', res);
    } else {
      instance.setState({
        graph_data_1: res.data_1,
      });

     /* $.plot($("#sessions"), [{ data: instance.state.graph_data_1 }],
        {
          lines: {
            show: true,
            lineWidth: 1,
            fill: false
          },
          points: {
            show: true,
            radius: 5,
          },
          shadowSize: 0,
          grid: {
            clickable: true,
            hoverable: true,
            borderWidth: 1,
            borderColor: "#c44e77",
            tickColor: "#c44e77",
          },
          xaxis: {
            ticks: [
              [1, "March 15"],
              [2, "March 16"],
              [3, "March 17"],
              [4, "March 18"],
              [5, "March 19"],
              [6, "March 20"],
              [7, "March 21"],
              [8, "March 22"],
              [9, "March 23"],
              [10, "March 24"]
            ]
          },
          colors: ["#fff"],
          tooltip: true,
          tooltipOpts: {
            content: "%x: %y Sessions"
          },
        }
      );
      */
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
    return (
      <HomeLayout>
        <React.Fragment>
          <div className="row" style={{ padding: '0px', marginLeft: '0px', marginRight: '0px' }}>
            <div className="col-md-3" style={{ height: '450px', backgroundColor: '#fff', paddingLeft: '0px' }}>
              <div className="grid-stack-item-content">
                <div className="widget widget-profile">
                  <div className="widget-content">
                    <div className="profile-images">
                      <figure>
                        <img src="assets/img/uploads/logo.jpg" className="img-circle" alt="Profile Picture" />
                      </figure>
                    </div>{/* profile-images */}
                    <div className="profile-details">
                      <h5><a href="page.profile.html">VE Following</a></h5>
                      <ul className="profile-stats">
                        <li>
                          Followers
							    <span>3986</span>
                        </li>
                        <li>
                          Following
							    <span>191</span>
                        </li>
                        <li>
                          Posts
							    <span>56</span>
                        </li>
                        <li>
                          Comments
							    <span>191</span>
                        </li>
                        <li>
                          Threads
							    <span>98</span>
                        </li>
                        <li>
                          Replies
							    <span>327</span>
                        </li>
                      </ul>{/* profile-stats */}
                    </div>{/* profile-details */}
                  </div>{/* widget-content */}
                </div>{/* widget */}
              </div>{/* grid-stack-item-content */}
            </div>
            <div className="col-md-5" style={{ height: '450px', backgroundColor: '#fff', marginLeft: '3%', marginRight: '3%' }}>
              <div className="grid-stack-item-content">
                <div className="widget scroll-panel">
                  <div className="widget-content">
                    <div className="scrollpane-container">
                      <div className="scrollpane">
                        <div role="tabpanel">
                          <h5>Collection Summary</h5>
                          <div className="tab-content">
                            <div role="tabpanel" className="tab-pane fade in active" id="members">
                              <ul className=" users-list">
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Contacted Meters in <span className="label label-default">10 min</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 30% </i>
                                    </button>
                                  </div>
                                </li>
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Online Rate in <span className="label label-default">24 Hrs</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 10% </i>
                                    </button>
                                  </div>
                                </li>
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Acquisition Rate in <span className="label label-default">24 hrs</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 0% </i>
                                    </button>
                                  </div>
                                </li>
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Avg Acquisition Time in <span className="label label-default">24 hrs</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 24.6% </i>
                                    </button>
                                  </div>
                                </li>
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Max Acquisition Time in <span className="label label-default">24 hrs</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 5% </i>
                                    </button>
                                  </div>
                                </li>
                                <li className="clearfix">
                                  <figure>
                                    <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic" />
                                  </figure>
                                  <a href="page-profile.html" className="user-name">Min Acquisition Time in <span className="label label-default">24 hrs</span></a>
                                  <div className="btn-group">
                                    <button type="button" className="btn btn-info btn-xs dropdown-toggle" >
                                      <i className="fa"> 30% </i>
                                    </button>
                                  </div>
                                </li>

                              </ul>
                            </div>{/* tab-pane */}

                          </div>{/* tab-content */}

                        </div>{/* tabpanel */}
                      </div>{/* scrollpane */}
                    </div>{/* scrollpane-container */}
                  </div>{/* widget-content */}
                </div>{/* widget */}
              </div>{/* grid-stack-item-content */}
            </div>
            <div className="col-md-3" style={{ height: '450px', backgroundColor: '#fff', paddingLeft: '0px' }}>
              <div className="grid-stack-item-content">
                <div className="widget widget-analytics">
                  <div className="widget-content">
                    <div className="real-time-visitors">
                      <span className="label label-warning">
                        <span className="random-numbers"></span>
                      </span>
                      <h6>Active users on VE</h6>
                    </div>{/* real-time-visitors */}
                    <div className="sessions">
                      <div className="flot-chart">
                        <div id="sessions" className="flot line"></div>
                      </div>{/* flot-chart */}
                    </div>{/* sessions */}
                  </div>{/* widget-content */}
                </div>{/* widget */}
              </div>{/* grid-stack-item-content */}
            </div>
          </div>
        </React.Fragment>
      </HomeLayout>

    )
  }
}

export default Dashboard;
