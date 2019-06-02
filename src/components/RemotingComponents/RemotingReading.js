import React from 'react';
import { withRouter } from 'react-router-dom';
import RemotingSearch from './RemotingSearch';
import RemotingParamTab from './RemotingParamTab';

class RemotingReading extends React.Component {
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
      search_div: '-5%',
      meter_info: [],
      mtr_msn: '',
      mtr_addr: '',
      par: props.match.params.para_ID,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    localStorage.getItem('token');
  }

  handleSort = (msn_data) => {
    msn_data.map(r => (
      this.setState({ mtr_msn: r.msn, mtr_addr: r.address }))
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onAuth(values.userName, values.password);
      }
    });
  };

  render() {
    if (localStorage.getItem('token') === null) {
      window.location = '/login';
    }

    if (window.innerWidth < 770) {
      this.setState({
        search_div: '2%'
      });
    }

    return (
      <div id="content">
        <div className="page-title">
          <h1>Remoting</h1>
        </div>

        <div className="container-fluid">
            <div id="widgets-container" className="grid-stack cols-4">
              <div className="grid-stack-item"
                   data-gs-auto-position="yes"
                   data-gs-width="4" data-gs-height="1"
                   data-gs-max-height="1"
              >
                <div className="grid-stack-item-content">
                  <div className="widget widget-quick-alerts">
                    <div className="widget-content">
                      <ul className="quick-alerts">
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-user fa-2x" />
                            <div className="fit-text">
                              <span>Realtime Operating</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-building fa-2x" />
                            <div className="fit-text">
                              <span>Reading</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="emails" data-toggle="tab">
                            <i className="fa fa-cogs fa-2x" />
                            <div className="fit-text">
                              <span>Setting</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-cogs fa-2x" />
                            <div className="fit-text">
                              <span>Advanced Setting</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-mobile fa-2x" />
                            <div className="fit-text">
                              <span>Security</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-bolt fa-2x" />
                            <div className="fit-text">
                              <span>Terminal</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-download fa-2x" />
                            <div className="fit-text">
                              <span>Meter Download</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a href="#" aria-controls="notifications" data-toggle="tab">
                            <i className="fa fa-paper-plane-o fa-2x" />
                            <div className="fit-text">
                              <span>Tariff Update Result</span>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-stack-item"
                   data-gs-auto-position="yes"
                   data-gs-width="4" data-gs-height="1"
                   data-gs-min-height="1"
              >
                <div className="grid-stack-item-content">
                  <div className="widget widget-analytics">
                    <span className="drag fa" />
                    <div className="widget-content">
                      <div className="server-status-details clearfix top0">
                        <h5>Meter Information</h5>
                        <dl className="pull-left">
                          <dt>MSNO:</dt>
                          <dd>{this.state.mtr_msn}</dd>
                        </dl>
                        <dl className="pull-left">
                          <dt>Address:</dt>
                          <dd>{this.state.mtr_addr}</dd>
                        </dl>

                        <dl className="pull-right" style={{ marginTop: this.state.search_div }}>
                          <div className="row">
                            <div
                              className="col-xs-6 col-xs-offset-0 col-sm-5 col-sm-offset-6 col-md-4 col-md-offset-6 col-lg-4 col-lg-offset-8 col-xl-4 col-xl-offset-8">
                              <RemotingSearch value={this.state.meter_info} onHeaderClick={this.handleSort}/>
                            </div>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <RemotingParamTab/>
        </div>
      </div>
    );
  }
}

export default withRouter(RemotingReading);
