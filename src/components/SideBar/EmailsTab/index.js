import React from 'react';

const EmailsTab = () => (
  <div role="tabpanel" className="tab-pane fade" id="emails">
    <h4>Emails</h4>
    <div className="sidebar-emails-container" role="tabpanel">

      <ul className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active"><a href="#inbox" aria-controls="inbox"
                                                      role="tab" data-toggle="tab">Inbox</a></li>
        <li role="presentation"><a href="#sent" aria-controls="sent" role="tab"
                                   data-toggle="tab">Sent</a></li>
      </ul>

      <div className="tab-content" style={{ height: '655px', overflow: 'auto' }}>
        <div role="tabpanel" className="tab-pane fade in active" id="inbox">
          <ul className="emails-list">
            <li><a href="#" className="clearfix">
              <div className="email-thumb">
                J
              </div>
              <div className="email-short">
                <h6>Jennifer Meza</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">21/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb">
                A
              </div>
              <div className="email-short">
                <h6>Arthur Hernandez</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">20/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile1.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Alicia Garcia</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">18/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb">
                S
              </div>
              <div className="email-short">
                <h6>someone@gmail.com</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">17/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile2.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Michelle Bowman</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">14/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>

            <li><a href="#" className="clearfix">
              <div className="email-thumb image">
                <img src="assets/img/uploads/profile3.jpg" className="img-circle"
                     alt="Profile Pic"/>
              </div>
              <div className="email-short">
                <h6>Jimmy Simmons</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">13/01/15</span>
            </a></li>
          </ul>
        </div>

        <div role="tabpanel" className="tab-pane fade" id="sent">
          <ul className="emails-list">
            <li><a href="#" className="clearfix">
              <div className="email-thumb">
                J
              </div>
              <div className="email-short">
                <h6>Jennifer Meza</h6>
                <small>Lorem ipsum dolor sit amet...</small>
              </div>
              <span className="when">21/01/15</span>
            </a></li>
          </ul>
        </div>
      </div>

    </div>
  </div>
);

export default EmailsTab;
