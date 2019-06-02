import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ContentContainer from '../../ContentContainer';
import AnalysisLayout from '../AnalysisLayout';
import AnalysisGrid from '../AnalysisGrid'
import RemotingSearchMulti from '../RemotingSearchMulti';
import DatePicker from '../DatePicker';
import TimePickerComponent from '../TimePickerComponent';
import ObisSelecterComponent from '../ObisSelecterComponent';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../../API/config';

import './analysisStyles.css';


class RawData extends React.Component {
  /*  here you can also create funtions and no need to bind in constructor  */

  constructor(props) {

    super(props);
    this.state = {
      mtr_msn: '',
      mtr_addr: '',
      device_id: '',
      meter_info: [],
      is_msn_active: false,
      dyn_hgt: '',
      fromdate_val: '',
      todate_val: '',
      fromtime_val: '',
      totime_val: '',
      obis_val: [],
      msns_arr: [],
      offset: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlemeterstatus = this.handlemeterstatus.bind(this);
    this.handlefromdatestatus = this.handlefromdatestatus.bind(this);
    this.handletodatestatus = this.handletodatestatus.bind(this);
    this.handletotimestatus = this.handletotimestatus.bind(this);
    this.handlefromtimestatus = this.handlefromtimestatus.bind(this);
    this.handleobisstatus = this.handleobisstatus.bind(this);
    this.handlemultimetermeterstatus = this.handlemultimetermeterstatus.bind(this);
    this.handlesize = this.handlesize.bind(this);
    this.handleSort_adv_cancel = this.handleSort_adv_cancel.bind(this);
  }

  componentDidMount() {

    document.title = "Vertex AMR - Analysis Raw Data";//woww graet works easily

  }


  handleSort(msn_data, is_msn_status, schedule_msn_status) {
    msn_data.map(r => (
      this.setState({ mtr_msn: r.msn, mtr_addr: r.address, device_id: r.id, is_msn_active: (r.last_connection_id && !schedule_msn_status) ? true : is_msn_status }))
    );
  };


  handlemeterstatus(msn_status) {
    this.setState({ is_msn_active: msn_status });
  };

  handleSort_adv_cancel(click_msn_id) {
    this.setState({ device_id: click_msn_id });
  }


  handlemultimetermeterstatus(msns) {
    var temp = [];
    msns.forEach((reading, index) => {
      var parsedstr = reading.split(',');
      temp.push(parseInt(parsedstr[1], 10));

    });

    this.setState({ msns_arr: temp });

  };



  handlefromdatestatus(fromdate) {
    this.setState({ fromdate_val: fromdate });

  };

  handletodatestatus(todate) {
    this.setState({ todate_val: todate });
  };


  handlefromtimestatus(fromtime) {
    if (fromtime != null) {
      //console.log(fromtime);
      var act_time = fromtime.toString();//imppp to convert
      act_time = act_time.split(' ');
      //console.log(act_time[4]);

      this.setState({ fromtime_val: act_time[4] });
    }

  };


  handletotimestatus(totime) {
    if (totime != null) {
      //console.log(totime);
      var act_time = totime.toString();//imppp to convert
      act_time = act_time.split(' ');
      //console.log(act_time[4]);
      this.setState({ totime_val: act_time[4] });
    }

  };


  handleobisstatus(obis) {
    var temp = [];
    for(let i=0;i<obis.length;i++){
      
      var parsedstr = obis[i].split('-').join('.');
      temp.push(parsedstr);

    }
    this.setState({ obis_val: temp });
  };

  handlesize(sz) {
    this.setState({ dyn_hgt: sz });
    //console.log(this.state.dyn_hgt);
  };


  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onAuth(values.userName, values.password);
      }
    });
  };

  render() {
    const { fromdate_val, fromtime_val, todate_val, totime_val, obis_val, msns_arr, offset } = this.state;

    var postrawdata = {};
    var fromdate_cpy = '';
    var todate_cpy = '';
    var fromdate_cpy = fromdate_val.split('/').join('');
    var todate_cpy = todate_val.split('/').join('');

    postrawdata['fromdate_val'] = parseInt(fromdate_cpy, 10);
    postrawdata['todate_val'] = parseInt(todate_cpy, 10);
    //postrawdata['fromtime_val'] = parseInt(fromtime_val.split(':').join(''), 10);
    //postrawdata['totime_val'] = parseInt(totime_val.split(':').join(''), 10);
    postrawdata['obis_val'] = obis_val;
    postrawdata['msns_arr'] = msns_arr;
    postrawdata['offset'] = offset;
    postrawdata['limit_param'] = 30;

    /* accessing or getting history props
    if(this.props.location.state != undefined ){  //condtion is vvimp otherwise exception will occur
    console.log(this.props.location.state.detail);
    }*/




    return (
      <AnalysisLayout >



        <div className="row">
          <div className="col-md-9" ref={element => this.elemHeight = element} style={{ height: '150px' }} >

            <div className="row" style={{ marginLeft: '-8px', marginRight: '-11px' }}>
              <div id="dynamic-height-main" className="col-xs-12  col-sm-12 col-md-12"     >
                <AnalysisGrid postrawdata={postrawdata} getSize={this.handlesize} />
              </div>

            </div>
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3">
            <RemotingSearchMulti onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} onHandleMultiMeterStatus={this.handlemultimetermeterstatus} />
          </div>

          <div className="col-xs-12  col-sm-12 col-md-3 col-md-offset-9">
            <DatePicker heading="From Calender" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleFromDateStatus={this.handlefromdatestatus} />
          </div>

          <div className="col-xs-12  col-sm-12 col-md-3 col-md-offset-9">
            <DatePicker heading="To Calender" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleToDateStatus={this.handletodatestatus} />
          </div>

          <div className="col-xs-12  col-sm-12 col-md-3 col-md-offset-9">
            <ObisSelecterComponent heading="Obis Registers" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleObisStatus={this.handleobisstatus} />
          </div>

        </div>

      </AnalysisLayout >
    )
  }
}

export default RawData;  
