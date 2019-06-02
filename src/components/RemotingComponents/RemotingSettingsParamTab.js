import React from 'react';
import RemotingSettingsTabElement from './RemotingSettingsTabElement';

class RemotingSettingsParamTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      results: [],
      voltage: '',
      main_current: '',
      ln_current: '',
      main_active_pwr: '',
      activeGroup: '',//no default group tab 
    };
    this.handlesize1 = this.handlesize1.bind(this);
  }

  componentDidMount() {
    const { source } = this.props;
    //console.log(source);
    this.setState({ token: localStorage.getItem('token') });
    let ht = document.getElementById('dynamic-height-tabs').offsetHeight;

    if (source === 'reading') { this.setState({ activeGroup: 'settings' }); }
    else{this.setState({ activeGroup: 'settings' });}
   
  }

  handlesize1(sz) {
    this.props.getSize(sz);
    //console.log(sz);
  };

  switchTab(tab) {
    this.setState({
      activeGroup: tab,
    });

  }

  render() {
    const { activeGroup } = this.state;
    const { deviceId, msn_status, getSize, source } = this.props;
    //console.log(activeGroup);

    return (
      <div className="pane equal" >
        {/*<h2><span>On Demand Reading - {activeGroup}</span></h2>*/}
        <div className="row">
          <div className="col-sm-12">
            <div className="pane equal" style={{ padding: '15px 15px 0px', marginBottom: '0px' }}>
              <div role="tabpanel">
                <ul className="nav nav-tabs" role="tablist">
                  {source === "reading" ?
                    <li role="presentation" className="active" onClick={() => this.switchTab('settings')}>
                      <a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a>
                    </li> : <span />
                  }
                  {source === "reading" ?
                    <li role="presentation" onClick={() => this.switchTab('advanced_settings')}>
                      <a href="#advanced_settings" aria-controls="advanced_settings" role="tab" data-toggle="tab">Advance Settings</a>
                    </li> : <span />
                  }

                </ul>
                {/* Tab panes */}
                <div className="tab-content" id="dynamic-height-tabs"   >
                  <div role="tabpanel" className="tab-pane fade in active" id="settings">
                    {
                      activeGroup === 'settings' ? <RemotingSettingsTabElement deviceId={deviceId} source_page={source} group="settings" getSize1={this.handlesize1} /> : <span />
                    }
                  </div>
                  <div role="tabpanel" className="tab-pane fade" id="advanced_settings">
                    {
                      activeGroup === 'advanced_settings' ? <RemotingSettingsTabElement getSize1={this.handlesize1} msn_status={msn_status} source_page={source} deviceId={deviceId} group="advanced_settings" /> : <span />
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

export default RemotingSettingsParamTab;














