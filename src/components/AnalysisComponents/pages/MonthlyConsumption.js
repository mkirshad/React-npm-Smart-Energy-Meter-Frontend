import React from 'react';
import ContentContainer from '../../ContentContainer';
import AnalysisLayout from '../AnalysisLayout';
import AnalysisGrid from '../AnalysisGrid'
import MonthlyConsumptionGraph from '../MonthlyConsumptionGraph'
import RemotingSearchMulti from '../RemotingSearchMulti';
import RemotingSearchSingle from '../RemotingSearchSingle';
import YearPickerComponent   from '../YearPickerComponent ';
import TimePickerComponent from '../TimePickerComponent';
import ObisSelecterComponent from '../ObisSelecterComponent';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../../API/config';

import './analysisStyles.css';


class MonthlyConsumption extends React.Component {
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
      curryear_val: '2019/04',
      obis_val: [],
      msns_arr: [],
      msn: '',
      msns_titles_arr:[],
      offset: 0,
    };

    this.handleSort = this.handleSort.bind(this);
    this.handlecurrentyearstatus = this.handlecurrentyearstatus.bind(this)
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
    var temp_msns_titles_arr=[]; /* new functionality for meter's titles */
    msns.forEach((reading, index) => {
      var parsedstr = reading.split(',');
      temp.push(parseInt(parsedstr[1], 10));
      temp_msns_titles_arr.push(parsedstr[0]); /* new functionality meter's titles */

    });
    
    //console.log(msns);
    //console.log(temp_msns_titles_arr);
    
    this.setState({ msns_arr: temp });
    this.setState({ msns_titles_arr: temp_msns_titles_arr }); /* new functionality */
  };


  handlecurrentyearstatus(currentyear) {
    this.setState({ curryear_val: parseInt(currentyear,10) });
    //console.log(parseInt(currentyear,10));//coversion from text to string

  };

  handleobisstatus(obis) {
    var temp = [];
    obis.forEach((reading, index) => {
      var parsedstr = reading.split('-').join('.');
      temp.push(parsedstr);

    });

    this.setState({ obis_val: temp });
  };



  render() {
    const { currdate_val, msn, offset, msns_arr, curryear_val, msns_titles_arr } = this.state;
    //you can't set states in render but can use it's values(read only)
    var postconsumptiondata = {};

    //postconsumptiondata['device_id'] = msn;//prev version recent
    postconsumptiondata['device_id'] = msns_arr; //latest new version 
    postconsumptiondata['selected_year'] = curryear_val;
    /* new functionality meter's titles */
    postconsumptiondata['msns_titles'] = msns_titles_arr;
    /* new functionality meter's titles */
    postconsumptiondata['offset'] = offset;
    postconsumptiondata['limit_param'] = 20;

    return (
      <AnalysisLayout >

        <div className="row">
          <div className="col-md-9" ref={element => this.elemHeight = element} style={{ height: '150px' }} >
            <div className="row" style={{ marginLeft: '-8px', marginRight: '-11px' }}>
              <div id="dynamic-height-main" className="col-xs-12  col-sm-12 col-md-12" >
                <MonthlyConsumptionGraph postconsumptiondata={postconsumptiondata} />
              </div>
            </div>
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3">
            {/*<RemotingSearchSingle heading="hourly-consumption" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} onHandleMeterStatus={this.handlemeteranalysisstatus} /> prev version perfect and tested for single meter*/}
            <RemotingSearchMulti heading="monthly-consumption" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandleStatus={this.handlemeterstatus} onHandleMultiMeterStatus={this.handlemultimetermeterstatus} />
          </div>
          <div className="col-xs-12  col-sm-12 col-md-3 col-md-offset-9" style={{ marginTop: '30px' }}>
           {<YearPickerComponent  heading="monthly-calender" type="monthly-picker" onHeaderClick_adv_cancel={this.handleSort_adv_cancel} onHeaderClick={this.handleSort} onHandlecurrentyearstatus={this.handlecurrentyearstatus} /> }
          </div>
        </div>

      </AnalysisLayout >
    )
  }
}

export default MonthlyConsumption;
