import React from 'react'
import { getDeviceInfo, searchDevices, getAllDevices, PostAllMsnsIds, get_dim_device_child_nodes, get_date_model_child_nodes } from '../../API/readings';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import axios from 'axios';
import { render } from "react-dom";
import DropdownTreeSelect from "react-dropdown-tree-select";
import $ from "jquery";
import { TreeSelect, Icon, Spin, DatePicker } from 'antd';
import moment from 'moment';


const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const yearFormat = 'YYYY';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
const { TreeNode } = TreeSelect;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;



class DatePickerComponent extends React.Component {

    state = {
      value: null,

    };


  onChange = (date, dateString) => { //date ia a moment type variable   
    const { hgt, heading } = this.props;

    var escapedstr = (heading.split(' ').join('')).toLowerCase();

    //console.log(date);
    //console.log(dateString);
    this.setState({ value: date });

    //sending back the parameters

    if (escapedstr == 'fromcalender') { this.props.onHandleFromDateStatus(dateString); }
    if (escapedstr == 'tocalender') { this.props.onHandleToDateStatus(dateString); }
    if (escapedstr == 'calender') { this.props.onHandlecurrentdatestatus(dateString); }
    if(escapedstr == 'daily-calender'){ this.props.onHandlecurrentmonthstatus(dateString); }
    
  }



  componentDidMount() {
    const { hgt, heading } = this.props;
    var escapedstr = (heading.split(' ').join('')).toLowerCase();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (escapedstr == 'fromcalender') {
      mm = mm - 1;
      if (mm == 0) { mm = 12; yyyy = yyyy - 1; }
    }

    if (mm == 2 && (dd == 29 || dd == 30 || dd == 31 ) ) { dd = 28; }//vvvimppp solved

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }


    today = yyyy + '/' + mm + '/' + dd;

    if(escapedstr == 'daily-calender'){
      today = yyyy + '/' + mm;
    }


    //console.log(today);

    if(escapedstr == 'daily-calender'){
      this.setState({ value: moment(today, monthFormat) });
    }
    else{
      this.setState({ value: moment(today, dateFormat) });
    }


    //let dt = moment(today, dateFormat); vvimp for future use and reference
    if (escapedstr == 'fromcalender') { this.props.onHandleFromDateStatus(today); }
    if (escapedstr == 'tocalender') { this.props.onHandleToDateStatus(today); }
    if (escapedstr == 'calender') { this.props.onHandlecurrentdatestatus(today); }
    if (escapedstr == 'daily-calender') { this.props.onHandlecurrentmonthstatus(today); }

  }


  componentWillUnmount() {
 
  }


  render() {
    const { hgt, heading, type } = this.props;
    const { results, req_ids, res_ids_results, active_status_check, dynm_height, child_results, scroll_loading_chk, rs, offset } = this.state;
    var str = "select date from calender";
    var escapedstr = (heading.split(' ').join('')).toLowerCase();

    var div_id = "analysis-raw-data-" + escapedstr;//title sign se string formation me issue hai
    /* -------for setting default value but now no longer required */
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;
    //console.log(today);
    /* -------for setting default value */


    return (

      <div>
        <div id={div_id} style={{ margin: '0 5px 20px 5px', padding: '15px', backgroundColor: '#fff', height: '130px', paddingTop: '0px' }}>
          <h2><span className="pane-h2">{heading=='calender'? "Calender (Select Day)" : heading=='daily-calender' ? "Calender (Select Month)"
                                         : heading=='From Calender' ? "Calender (From Date)" : heading=='To Calender'? "Calender (To Date)" : '' }</span></h2>
      
          { type!='' && type=="daily-picker" ?
               <MonthPicker defaultValue={moment(today, dateFormat)} value={this.state.value} onChange={this.onChange} format={monthFormat} />      
            :
               <DatePicker defaultValue={moment(today, dateFormat)} value={this.state.value} onChange={this.onChange} format={dateFormat} />
          }
        </div>
      </div>


    );
  }
}

export default DatePickerComponent;
