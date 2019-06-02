import React from 'react';

const SideBarProfile = () => (
  <div className="sidebar-profile clearfix">
    <a href="#" className="pull-left">
      <figure className="profile-picture">
        <img src="assets/img/uploads/profile.jpg" className="img-circle" alt="User Name"/>
      </figure>
    </a>
    <h6>Welcome,</h6>
    <h5>Pakistan</h5>
    <div className="btn-group">
      <a data-toggle="dropdown">
        <span>
            Region:
                <span className="online">Asia</span>
                <span className="busy">Busy</span>
                <span className="away">Away</span>
                <span className="offline">Offline</span>
            <span className="caret"></span>
        </span>
      </a>
      <ul className="dropdown-menu default" role="menu">
        <li><a data-status="online"><span
          className="label label-status label-online">&nbsp;</span> Online</a></li>
        <li><a data-status="busy"><span
          className="label label-status label-busy">&nbsp;</span> Busy</a></li>
        <li><a data-status="away"><span
          className="label label-status label-away">&nbsp;</span> Away</a></li>
        <li><a data-status="offline"><span
          className="label label-status label-offline">&nbsp;</span> Offline</a></li>
      </ul>
    </div>
  </div>
);

export default SideBarProfile;
