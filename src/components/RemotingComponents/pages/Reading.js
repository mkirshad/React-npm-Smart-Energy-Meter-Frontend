import React from 'react';
import ContentContainer from '../../ContentContainer';
import RemotingLayout from '../RemotingLayout';
import RemotingParamTab from '../RemotingParamTab';
import RemotingSearch from '../RemotingSearch'; 
import RemotingSchedulingTabElement from '../RemotingSchedulingTabElement';


import './readingStyles.css';

class Reading extends React.Component {
  /*  here you can also create funtions and no need to bind in constructor  */

  constructor(props) {

    super(props);
    this.state = {
      mtr_msn: '',
      mtr_addr: '',
      device_id: '',
      meter_info: [],
      is_msn_active: false,
      msn_sts_temp: null,
      dyn_hgt: '',
    };

    this.handleSort = this.handleSort.bind(this);
    this.handlemeterstatus = this.handlemeterstatus.bind(this);
    this.handlesize = this.handlesize.bind(this);
    this.handleSort_adv_cancel = this.handleSort_adv_cancel.bind(this);
  }


  componentDidMount() {
    document.title = "Vertex AMR - Remoting";//woww graet works easily
  }

  handleSort(msn_data, is_msn_status, schedule_msn_status) {
    msn_data.map(r => (
      this.setState({ mtr_msn: r.msn, mtr_addr: r.address, device_id: r.id, is_msn_active: (r.last_connection_id && !schedule_msn_status) ? true : is_msn_status }))
    );
  };

  handleSort_adv_cancel(click_msn_id) {

    this.setState({ device_id: click_msn_id });
  }


  handlemeterstatus(msn_status) {
    this.setState({ is_msn_active: msn_status,  msn_sts_temp: msn_status });
  };

  handlesize(sz) {
    this.setState({ dyn_hgt: sz });
    //console.log(this.state.dyn_hgt);
  };




  render() {
    const { mtr_msn, mtr_addr, device_id, meter_info, is_msn_active, dyn_hgt, msn_sts_temp } = this.state;

    //console.log(window.location.href);
    //console.log(window.location.hostname);
    //console.log(window.location.pathname);
    var path=window.location.pathname;


    return (
      <RemotingLayout headingcontent="Reading">

        <div className="row">
          <div className="col-md-9" ref={element => this.elemHeight = element} >
            <ContentContainer heading="Meter Information">
              <div className="row" style={{ paddingLeft: '5px' }}>
                <div className="col-md-5 meter-reading">
                  <b>MSNO:</b>
                  <span>{mtr_msn}{/*is_msn_active ? 'true' : 'false' */ /*<i className="fa fa-plug fa-1x" style={{color: is_msn_active ? 'green' : 'grey' }}></i> */}
                    <span>&nbsp;&nbsp;{mtr_msn ? <img src={is_msn_active ? "assets/img/uploads/conn.png" : "assets/img/uploads/a.png"} /> : <span />}</span></span>
                </div>
                <div className="col-md-7 meter-reading">
                  <b>Address:</b>
                  <span>{mtr_addr}</span>
                </div>
              </div>
            </ContentContainer>
            <div className="row" style={{ marginLeft: '-8px', marginRight: '-11px' }}>
              <div id="dynamic-height-main" className="col-xs-12  col-sm-12 col-md-12"     >
              {/* source={path =="/remoting-reading" ? "reading" : path =="/remoting-realtime-operating" ? "operating" : ""} */}
              {/* prev code  <RemotingSettingsParamTab  source="reading"   getSize={this.handlesize} deviceId={device_id} msn_status={is_msn_active} /> */}

                {  window.location.pathname !== '/remoting-scheduling' ?   <RemotingParamTab  source={path =="/remoting-reading" ? "reading" : path =="/remoting-realtime-operating" ? "operating" :  path =="/remoting-settings" ? "settings"  : ""} 
                   getSize={this.handlesize} deviceId={device_id} msn_status={msn_sts_temp} />

                   :    <RemotingSchedulingTabElement   deviceId={device_id} />  
                }


              </div>

            </div>
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3">
            {/*<ContentContainer heading="Meter Search">*/}
            <RemotingSearch value={meter_info} onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} hgt={dyn_hgt} />
            {/*</ContentContainer>*/}
          </div>

        </div>

      </RemotingLayout>
    )
  }
}

export default Reading;

