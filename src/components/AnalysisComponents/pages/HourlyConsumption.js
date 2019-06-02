import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ContentContainer from '../../ContentContainer';
import AnalysisLayout from '../AnalysisLayout';
import AnalysisGrid from '../AnalysisGrid'
import HourlyConsumptionGraph from '../HourlyConsumptionGraph'
import RemotingSearchMulti from '../RemotingSearchMulti';
import RemotingSearchSingle from '../RemotingSearchSingle';
import DatePicker from '../DatePicker';
import TimePickerComponent from '../TimePickerComponent';
import ObisSelecterComponent from '../ObisSelecterComponent';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../../API/config';

import './analysisStyles.css';


class HourlyConsumption extends React.Component {
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
      currdate_val: '',
      obis_val: [],
      msns_arr: [],
      msn: '',
      msns_arr:[],
      offset: 0,
      state_changed_chk: false
      
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlecurrentdatestatus = this.handlecurrentdatestatus.bind(this)
    this.handlemeterstatus = this.handlemeterstatus.bind(this);
    this.handlemultimetermeterstatus = this.handlemultimetermeterstatus.bind(this);
    this.handleobisstatus = this.handleobisstatus.bind(this);
    this.handlemeteranalysisstatus = this.handlemeteranalysisstatus.bind(this);
    this.handleSort_adv_cancel = this.handleSort_adv_cancel.bind(this);
  }

  componentDidMount() {
    document.title = "Vertex AMR - Analysis Hourly Consumption";//woww graet works easily

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


  handlemeteranalysisstatus(msn) { 
    var parsedmsnstr = msn.split(',');
    //console.log(parsedmsnstr[1]);
    this.setState({ msn: parsedmsnstr[1] });
    
  };

  handlemultimetermeterstatus(msns) {
    var temp = [];
    msns.forEach((reading, index) => {
      var parsedstr = reading.split(',');
      temp.push(parseInt(parsedstr[1], 10));

    });

    this.setState({ msns_arr: temp, state_changed_chk: true });
  };


  handlecurrentdatestatus(currentdate) {
    this.setState({ currdate_val: currentdate });

  };

  handleobisstatus(obis) {
    var temp = [];
    obis.forEach((reading, index) => {
      var parsedstr = reading.split('-').join('.');
      temp.push(parsedstr);

    });

    this.setState({ obis_val: temp });
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
    const { currdate_val, msn, offset, msns_arr, state_changed_chk } = this.state;
    
    //you can't set states in render but can use it's values(read only)
    var postconsumptiondata = {};
    var history_props_chk = false;//vvvimp check to call api in hourly consumption graph in componentdidmount when history priops gets set
    var device_id_arr=[];

    //postconsumptiondata['device_id'] = msn;//prev version recent
    postconsumptiondata['device_id'] = msns_arr; //latest new version
    postconsumptiondata['curr_date'] = parseInt((currdate_val.split('/').join('')), 10);
    postconsumptiondata['offset'] = offset;
    postconsumptiondata['limit_param'] = 20;

    const urlParams = new URLSearchParams(window.location.search);
    const myParam_date = urlParams.get('req_date');
    const myParam_msns = urlParams.get('req_msns');
    //console.log(myParam_date);
    //console.log(myParam_msns);
    

    //window.open(`/analysis-hourly-consumption?req_date=${parseInt((curr_month_cpy + (e.dataPoint.x).toString() ), 10 )}&req_msns=${msns_arr_cpy}`);


    /*-- accessing or getting history props ---*/
    
    if(myParam_date != null && myParam_msns != null  ){  //null is imppp

      //console.log(msns_arr.length);
      //console.log(state_changed_chk);
      
      if(msns_arr.length == 0 && !state_changed_chk ){

        var split_str=myParam_msns.split(',');
        for(let i=0;i<split_str.length;i++){
            device_id_arr.push(split_str[i]);
        }

        postconsumptiondata['device_id'] = device_id_arr;
        postconsumptiondata['curr_date'] = parseInt(((myParam_date.toString()).split('/').join('')), 10);

        history_props_chk=true;
        //console.log(postconsumptiondata['device_id']);
        //console.log(postconsumptiondata['curr_date']); 

      }//end of inner if

      

      
    }//end of outer if
  

    /*--getting history props ---*/



    return (
      <AnalysisLayout >

        <div className="row">
          <div className="col-md-9" ref={element => this.elemHeight = element} style={{ height: '150px' }} >
            <div className="row" style={{ marginLeft: '-8px', marginRight: '-11px' }}>
              <div id="dynamic-height-main" className="col-xs-12  col-sm-12 col-md-12" >
                <HourlyConsumptionGraph postconsumptiondata={postconsumptiondata}  history_props_detail_chk={history_props_chk} />
              </div>
            </div>
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3">
            {/*<RemotingSearchSingle heading="hourly-consumption" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} onHandleMeterStatus={this.handlemeteranalysisstatus} /> prev version perfect and tested for single meter*/}        
            <RemotingSearchMulti heading="hourly-consumption" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} onHandleMultiMeterStatus={this.handlemultimetermeterstatus} />
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3 col-md-offset-9" style={{ marginTop: '30px' }}>
            <DatePicker heading="calender" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandlecurrentdatestatus={this.handlecurrentdatestatus} />
          </div>
        </div>
      </AnalysisLayout >
    )
  }
}

export default withRouter(HourlyConsumption);
