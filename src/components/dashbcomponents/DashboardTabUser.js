import React from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class DashboardTabUser extends React.Component {
  render() {
    return (
      <div>
        <div className="grid-stack-item"
             data-gs-no-resize="yes"
             data-gs-auto-position="yes"
             data-gs-width="1" data-gs-height="4"
        >
          <div className="grid-stack-item-content">
            <div className="widget widget-profile">
              <span className="drag fa" />
              <div className="widget-content">
                <div className="profile-images">
                  <figure><img src="assets/img/uploads/logo.jpg" className="img-circle" alt="user profile/logo" /></figure>
                </div>

                <div className="profile-details">
                  <h5><a href="page.profile.html">VE Following</a></h5>
                  <ul className="profile-stats">
                    <li>Followers<span>3986</span></li>
                    <li>Following<span>191</span></li>
                    <li>Posts<span>56</span></li>
                    <li>Comments<span>191</span></li>
                    <li>Threads<span>98</span></li>
                    <li>Replies<span>327</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid-stack-item"
           data-gs-no-resize="yes"
           data-gs-auto-position="yes"
           data-gs-width="2" data-gs-height="4"
        >
          <div className="grid-stack-item-content">
            <div className="widget scroll-panel">
              <span className="drag fa" />
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
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Contacted Meters in <span
                                className="label label-default">10 min</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 30% </i>
                                </button>
                              </div>
                            </li>

                            <li className="clearfix">
                              <figure>
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Online Rate in <span
                                className="label label-default">24 Hrs</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 10% </i>
                                </button>
                              </div>
                            </li>

                            <li className="clearfix">
                              <figure>
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Acquisition Rate in <span
                                className="label label-default">24 hrs</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 0% </i>
                                </button>
                              </div>
                            </li>

                            <li className="clearfix">
                              <figure>
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Avg Acquisition Time in <span
                                className="label label-default">24 hrs</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 24.6% </i>
                                </button>
                              </div>
                            </li>

                            <li className="clearfix">
                              <figure>
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Max Acquisition Time in <span
                                className="label label-default">24 hrs</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 5% </i>
                                </button>
                              </div>
                            </li>

                            <li className="clearfix">
                              <figure>
                                <img src="assets/img/uploads/summery.jpg" className="img-circle" alt="Profile Pic"/>
                              </figure>
                              <a href="page-profile.html" className="user-name">Min Acquisition Time in <span
                                className="label label-default">24 hrs</span></a>
                              <div className="btn-group">
                                <button type="button" className="btn btn-info btn-xs dropdown-toggle">
                                  <i className="fa"> 30% </i>
                                </button>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-stack-item"
             data-gs-no-resize="yes"
             data-gs-auto-position="yes"
             data-gs-width="1" data-gs-height="4"
        >
          <div className="grid-stack-item-content">
            <div className="widget widget-analytics">
              <span className="drag fa" />
              <div className="widget-content">
                <div className="real-time-visitors">
                  <span className="label label-warning"><span className="random-numbers" /></span>
                  <h6>Active users on VE</h6>
                </div>

                <div className="sessions">
                  <div className="flot-chart">
                    <div id="sessions" className="flot line" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardTabUser;














