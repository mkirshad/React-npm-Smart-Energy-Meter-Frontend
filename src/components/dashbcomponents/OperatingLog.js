import React from 'react';

class OperatingLog extends React.Component {
  render() {
    return (
      <div>
        <div className="grid-stack-item" data-gs-no-resize="yes" data-gs-auto-position="yes" data-gs-width="1" data-gs-height="4">
          <div className="grid-stack-item-content">
            <div className="widget widget-profile">
              <span className="drag fa" />
              <div className="widget-content">
                <div className="profile-images">
                  <figure>
                    <img src="assets/img/uploads/logo.jpg" className="img-circle" alt="Profile Picture"/>
                  </figure>
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
                    <li>testing<span>327</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default OperatingLog;














