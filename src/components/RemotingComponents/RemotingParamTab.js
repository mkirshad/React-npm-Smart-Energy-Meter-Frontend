import React from 'react';
import RemotingTabElement from './RemotingTabElement';
import RemotingSettingsTabElement from './RemotingSettingsTabElement';
import RemotingSchedulingTabElement from './RemotingSchedulingTabElement';

class RemotingParamTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      results: [],
      voltage: '',
      main_current: '',
      ln_current: '',
      main_active_pwr: '',
      path_nm:'',

      activeGroup: '',//no default group tab ,

      spec_chk_clock: false,
    };
    this.handlesize1 = this.handlesize1.bind(this);
  }

  componentDidMount() {
    //console.log("paramdidmount");
    const { source } = this.props;
    //console.log(source);
    this.setState({ token: localStorage.getItem('token') });
    let ht = document.getElementById('dynamic-height-tabs').offsetHeight;

  
    if (source === 'operating') { this.setState({ activeGroup: 'clock' }); }
    else if(source === 'reading') { this.setState({ activeGroup: 'parameter' }); }
    else { this.setState({ activeGroup: 'settings' }); }

    ///////////////////new
    this.setState({ path_nm: window.location.pathname });
    ///////////////////new

  }

  componentWillReceiveProps(props) {
    /* calls everytime user clicks on left naviagation tabs in remmoting section but didmount not being called */
    const { activeGroup, source_cpy, path_nm  } = this.state;
    console.log("willreceiveparam");
    const { source, url_path } = this.props;
    console.log(this.state.path_nm);
    //console.log(source);//props source not giving correct value

    if(window.location.pathname != this.state.path_nm){
      //console.log("inside path param");
      //console.log(source);//props source not giving correct value
      // as user not clicking on tabs or leaf nodes only clicking  from left navigation tabs menu in remoting section 
      if (window.location.pathname === '/remoting-realtime-operating')  { this.setState({ activeGroup: 'clock', path_nm: window.location.pathname  }); }
      if(window.location.pathname === '/remoting-reading') { this.setState({ activeGroup: 'parameter', path_nm: window.location.pathname  }); }
      if(window.location.pathname === '/remoting-settings') { this.setState({ activeGroup: 'settings', path_nm: window.location.pathname  }); }

    }

  
  }//end of componentWillReceiveProps()


  handlesize1(sz) {
    this.props.getSize(sz);
    //console.log(sz);
  };




  /*--new funtionality ---*////
  switchTab(tab) {
    this.setState({
      activeGroup: tab,
    });
    if (window.location.pathname === '/remoting-reading' && tab == 'clock')  { this.setState({ spec_chk_clock: true }); }
  }

  /*--new funtionality ---*////

  render() {
    const { activeGroup, spec_chk_clock } = this.state;
    const { deviceId, msn_status, getSize, source, temp_chk } = this.props;
    //console.log(activeGroup);

    //console.log(source);//props source  giving correct value here but not in willreceive

    return (
      <div className="pane equal" >
        {/*<h2><span>On Demand Reading - {activeGroup}</span></h2>*/}
        <div className="row">
          <div className="col-sm-12">
            <div className="pane equal" style={{ padding: '15px 15px 0px', marginBottom: '0px' }}>
              <div role="tabpanel">
                <ul className="nav nav-tabs" role="tablist">
                  {source === "reading" ?
                    <li role="presentation" className={source === "reading" ? "active" : ''}  onClick={() => this.switchTab('parameter')}>
                      <a href="#parameter" aria-controls="parameter" role="tab" data-toggle="tab">Parameter</a>
                    </li> : <span />
                  }
                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('energy')}>
                      <a href="#energy" aria-controls="energy" role="tab" data-toggle="tab">Energy</a>
                    </li> : <span />
                  }
                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('instantaneous')}>
                      <a href="#instantaneous" aria-controls="instantaneous" role="tab" data-toggle="tab">Instantaneous</a>
                    </li> : <span />
                  }

                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('demand')}>
                      <a href="#demand" aria-controls="demand" role="tab" data-toggle="tab">Demand</a>
                    </li> : <span />
                  }

                  {source === "reading" || source === "operating"  ?

                  <li role="presentation" className={source === "operating" ? "active" : ''} onClick={() => this.switchTab('clock')}>
                    <a href="#clock" aria-controls="clock" role="tab" data-toggle="tab">Clock</a>
                  </li>   : <span />
                  }


                  {source === "reading" ?
                  <li role="presentation"  onClick={() => this.switchTab('relay')}>
                    <a href="#relay" aria-controls="relay" role="tab" data-toggle="tab">Relay</a>
                  </li>   : <span />
                  }

                  {source === "operating" ?
                  <li role="presentation"  onClick={() => this.switchTab('relay')}>
                    <a href="#relay" aria-controls="relay" role="tab" data-toggle="tab">Relay</a>
                  </li>   : <span />
                  }

                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('task-data')}>
                      <a href="#task-data" aria-controls="task-data" role="tab" data-toggle="tab">Task Data</a>
                    </li> : <span />
                  }

                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('tariff-data')}>
                      <a href="#tariff-data" aria-controls="tariff-data" role="tab" data-toggle="tab">Tariff Data</a>
                    </li> : <span />
                  }

                  { /*source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('scheduling-data')}>
                      <a href="#scheduling-data" aria-controls="scheduling-data" role="tab" data-toggle="tab">Scheduling</a>
                    </li> : <span />
                  */}


                  {source === "settings" ?
                    <li role="presentation" className={source === "settings" ? "active" : ''} onClick={() => this.switchTab('settings')}>
                      <a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a>
                    </li> : <span />
                  }
                  {source === "settings" ?
                    <li role="presentation" onClick={() => this.switchTab('advanced_settings')}>
                      <a href="#advanced_settings" aria-controls="advanced_settings" role="tab" data-toggle="tab">Advance Settings</a>
                    </li> : <span />
                  }

                </ul>

                {/* Tab panes */}
                <div className="tab-content" id="dynamic-height-tabs"   >
                  <div role="tabpanel" className={source === "reading" ? "tab-pane fade in active" : "tab-pane fade "} id="parameter">
                    {
                      activeGroup === 'parameter' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="parameter" getSize1={this.handlesize1} msn_status={msn_status}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="energy">
                    {
                      activeGroup === 'energy' ? <RemotingTabElement getSize1={this.handlesize1} msn_status={msn_status} source_page={source} deviceId={deviceId} group="energy"  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="instantaneous">
                    {
                      activeGroup === 'instantaneous' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="instantaneous" getSize1={this.handlesize1} spec_check_clock={spec_chk_clock}  /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="demand">
                    {
                      activeGroup === 'demand' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="demand" getSize1={this.handlesize1} spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className={source === "operating" ? "tab-pane fade in active" : "tab-pane fade "} id="clock">
                    {
                      activeGroup === 'clock' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="clock" getSize1={this.handlesize1} spec_check_clock={spec_chk_clock}  /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade"  id="relay">
                    {
                      activeGroup === 'relay' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="relay" getSize1={this.handlesize1}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="task-data">
                    {
                      activeGroup === 'task-data' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="task-data" getSize1={this.handlesize1}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="tariff-data">
                    {
                      activeGroup === 'tariff-data' ? <RemotingTabElement deviceId={deviceId} source_page={source} group="tariff-data" getSize1={this.handlesize1}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="scheduling-data">
                    {
                      activeGroup === 'scheduling-data' ? <RemotingSchedulingTabElement deviceId={deviceId} source_page={source} group="scheduling-data" getSize1={this.handlesize1}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className={source === "settings" ? "tab-pane fade in active" : "tab-pane fade "} id="settings">
                    {
                      activeGroup === 'settings' ? <RemotingSettingsTabElement deviceId={deviceId} source_page={source} group="settings" getSize1={this.handlesize1}  spec_check_clock={spec_chk_clock} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="advanced_settings">
                    {
                      activeGroup === 'advanced_settings' ? <RemotingSettingsTabElement deviceId={deviceId} source_page={source} group="advanced_settings"  getSize1={this.handlesize1} msn_status={msn_status} spec_check_clock={spec_chk_clock}   /> : <span />
                    }
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

export default RemotingParamTab;














