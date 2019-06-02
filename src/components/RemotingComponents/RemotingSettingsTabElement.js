import React from 'react';
import { find } from 'lodash-es';
import ReactDOM from "react-dom";
import { getOnDemandReading, getDeviceParamValue } from '../../API/onDemandReading';
import axios from 'axios';
import { Icon, Spin, message } from 'antd';
import { ENDPOINTS } from '../../API/config';
import { API_ENDPOINT, port } from '../../API/config';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RemotingSettingsTabElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      activeObis: [],
      activeObis_write: [],
      error_status: false,
      error_spec: false,
      active_reqs: {},   // for itemremove while loading
      device_id_cpy: '',
      meter_conn: true,
      isChecked: true,
      isChecked_action: false,
      dataIndex_multi_fetch: undefined,
      Status_display: false,

      group_cpy: null //// new and vvimp for clock for and relay tabs for inter tabs

    };

    this.textInput = React.createRef();
    this.fetchDetail = this.fetchDetail.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.removeItem_load = this.removeItem_load.bind(this);
    this.fetchAllSelected = this.fetchAllSelected.bind(this);
    this.fetchAllSelected_write = this.fetchAllSelected_write.bind(this);
    this.ref_in_willreceiveprops = this.ref_in_willreceiveprops.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handlecheckboxChange = this.handlecheckboxChange.bind(this);

  }

  handleLoad() {
  }

  warning = () => {
    message.warning('Please enter some input value for write opeartion to execute.', 8);
};

  handlecheckboxChange(e) {
    let { activeObis, activeObis_write, data, active_reqs } = this.state;
    var newdatacpy = data.slice();//shallow copy
    activeObis.length = 0;//activeObis:[] not working here impp
    if (e.target.checked === true) {
      //console.log("true");
      newdatacpy.forEach((reading, index) => {
        data[index].loading = false;
        data[index].read = true;  //for read and write functionality
        data[index].write = true;  //for read and write functionality
        data[index].checked = true;
        activeObis.push(reading);
        activeObis_write.push(reading);
      });//end foreach

      this.setState({ data });
      this.setState({ activeObis, active_reqs });//imp see it later

    }//end of if

    else {
      //console.log("false");
      newdatacpy.forEach((reading, index) => {
        data[index].checked = false;
        data[index].read = false;   //for read and write functionality
        data[index].write = false;  //for read and write functionality
        data[index].value = undefined; //imp to have  for read all selected case while loading but not for simple remove case
        data[index].unit = undefined;  // imp to have for read all selected case while loading but not for simple remove case
        data[index].loading = false;
      });
      activeObis.length = 0;//activeObis:[] not working here impp
      activeObis_write.length = 0;//activeObis_write:[] not working here impp
      /* new functionality  */
      for (var key in active_reqs) {
        let sr = active_reqs[key];
        if (sr !== undefined) {
          sr.cancel('Operation canceled due to new request updated.')
        }
      }
      for (var key in active_reqs) {
        delete active_reqs[key];
      }
      //console.log(Object.keys(active_reqs).length);// prints the keyed data's length
      /* new functionality  */
      this.setState({ data });
      this.setState({ activeObis, active_reqs });

    }//end of else 

  }


  async componentDidMount() {
    console.log("didmountsettingstab");
    const { group, deviceId, source_page } = this.props;

    //console.log(source_page);
    //console.log(group);

    if (deviceId) {
      const res = await getOnDemandReading(group, deviceId, source_page);
      if (res.fail) {
        console.log('Cant fetch group demand reading -> ', res);
        this.setState({
          error_spec: true,
        });
      } else {
        //console.log(res);
        this.setState({
          data: res, device_id_cpy: deviceId,  group_cpy: group // new and vvimp for clock for and relay tabs for inter tabs
        });

        if (this.state.data.length === 0) {
          this.setState({
            error_status: true
          });
        }
      }

    }//end of if deviceId

    //calculating the heigth of div based on data length
    this.props.getSize1(this.state.data.length * 40);

  }

  componentWillUnmount() {

    //alert("umnount");
    let { activeObis, data, active_reqs } = this.state;
    var datacpy = data.slice();//shallow copy
    /* problem solved of cancelling all requests in loading state while switches to new tab wowwwww great work */
    for (var key in active_reqs) {
      let sr = active_reqs[key];
      if (sr !== undefined) {
        sr.cancel('Operation canceled due to new request updated.')
      }
    }
    for (var key in active_reqs) {
      delete active_reqs[key];
    }
    //console.log(Object.keys(active_reqs).length);// prints the keyed data's length
    /* problem solved of cancelling all requests in loading state while switches to new tab wowwwww great work */
    this.setState({ active_reqs });

  }


  ref_in_willreceiveprops() {
    this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false;

  };

  async componentWillReceiveProps(props) {
    console.log("willreceivesettingstab");
    /*very imp funtion if props changes like deviceId but group prop
    not included in it.calls before render 
    and after render componentdidupdate calls not componentdidmount   
    */
    const { data, meter_conn, active_reqs, device_id_cpy, activeObis } = this.state;
    const { group, deviceId, msn_status, source_page } = props;

    //console.log(source_page);
    //console.log(group);
    //console.log(this.state.group_cpy);

    if (deviceId != this.state.device_id_cpy) {
      //new functionality
      //console.log(device_id_cpy);

      if (device_id_cpy != '') { this.ref_in_willreceiveprops(); } //yeah works great for avoiding undefined error for this.refs.check_me.indeterminate 

      /* problem solved of cancelling all requests in loading state while switches to new tab wowwwww great work */
      let sr = '';
      for (var key in active_reqs) {
        sr = active_reqs[key];

        if (sr !== undefined && data[key].loading == true && data[key].unit == undefined && data[key].value == undefined) {
          sr.cancel('Operation canceled due to new request updated.')
        }
      }
      data.length = 0;//activeObis:[] not working here impp
      activeObis.length = 0;//activeObis:[] not working here impp
      //console.log(Object.keys(active_reqs).length);
      for (var key in active_reqs) {
        delete active_reqs[key];
      }
      //console.log(Object.keys(active_reqs).length);
      /* problem solved of cancelling all requests in loading state while switches to new tab wowwwww great work */

      this.setState({ data, activeObis, active_reqs });//imp see it later

    }//end of first if condition

    // || (group == this.state.group_cpy) // new and vvimp for clock for and relay tabs for inter tabs

    if ((deviceId && this.state.data.length === 0) || (deviceId != this.state.device_id_cpy)  ) {
      const res = await getOnDemandReading(group, deviceId, source_page);
      if (res.fail) {
        console.log('Cant fetch group demand reading -> ', res);
      } else {
        this.setState({
          data: res, device_id_cpy: deviceId, group_cpy: group // new and vvimp for clock for and relay tabs for inter tabs
        });

        //console.log(res);  

        if (this.state.data.length === 0) {
          this.setState({
            error_status: true,
          });
        }

      }
    }//end of second if condition


  }

  async fetchDetail(obis, operation_type) { // // async is compulsary again

    const { data, activeObis, activeObis_write, active_reqs } = this.state;
    const { deviceId } = this.props;
    const loadingItem = find(data, (item) => {
      if (item.obis === obis) {
        return item;
      }
    });

    //// TESTING PURPOSES///////////
    /*
    console.log(loadingItem);
    console.log(JSON.stringify(loadingItem));
    console.log(JSON.stringify(loadingItem).length);

    var parsed = JSON.parse(JSON.stringify(loadingItem));
    var arr = [];
    for(var x in parsed){
      arr.push(parsed[x]);
    }
    console.log(arr);
    console.log(arr.length);
    */
    ///////TESTING PURPOSES//////////

    /*-----NEW FUNTIONALITY FOR API REQUESTS'S PARAMETERS AFTER WRITING ---------*/
    var api_query_string = '';
    if (operation_type == "read") {
      api_query_string = `${API_ENDPOINT}${ENDPOINTS.GET_DEVICE_PARAM}?param=${obis}&device_id=${deviceId}&action=Read`;
      console.log(api_query_string);
    }
    else if (operation_type == "write") {
      var wrt_param = this.refs[obis.split('.').join('-')].value;
      if(wrt_param==''){this.warning();return 1;}//vvimp function and return with 1 as well//
      else{api_query_string = `${API_ENDPOINT}${ENDPOINTS.GET_DEVICE_PARAM}?param=${obis}&device_id=${deviceId}&action=Write&write_param=${wrt_param}`;}
      console.log(api_query_string);
    }
    else if (operation_type == "Exec") {
      var wrt_param = this.refs[obis.split('.').join('-')].value;
      api_query_string = `${API_ENDPOINT}${ENDPOINTS.GET_DEVICE_PARAM}?param=${obis}&device_id=${deviceId}&action=Exec`;
      console.log(api_query_string);
    }

    console.log(this.refs[obis.split('.').join('-')].value);//level waooo impppp

    /*-----NEW FUNTIONALITY FOR API REQUESTS'S PARAMETERS AFTER WRITING------------*/

    /*new functionaity for read and write logic*/

    if (operation_type == "read") {
      activeObis.push(loadingItem);
      //console.log(activeObis);
    }
    else if (operation_type == "write") {
      activeObis_write.push(loadingItem);
      //console.log(activeObis_write);    
    }

    /*new functionaity for read and write logic*/
    /*  for indeterminate check  update */
    if (operation_type == "read") {
      if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
      else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
      if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
    }

    if (operation_type == "write") {
      if (activeObis_write.length !== data.length && activeObis_write.length !== 0) { this.refs.check_me.indeterminate = true; }
      else if (activeObis_write.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
      if (activeObis_write.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
    }

    /*  for indeterminate check */
    const dataIndex = data.indexOf(loadingItem);

    data[dataIndex].checked = true; /*  for indeterminate check */

    /*new functionaity for read and write logic*/
    if (operation_type == "read") {
      data[dataIndex].loading_read = true;//imp new funct for loading
      if (data[dataIndex].write != undefined && data[dataIndex].write == true) { data[dataIndex].read = true; }
      else { data[dataIndex].read = true; data[dataIndex].write = false; }
    }
    else if (operation_type == "write") {
      data[dataIndex].loading_write = true;//imp new funct for loading
      if (data[dataIndex].read != undefined && data[dataIndex].read == true) { data[dataIndex].write = true; }
      else { data[dataIndex].write = true; data[dataIndex].read = false; }
    }
    else if (operation_type == "Exec") {
      data[dataIndex].loading_exec = true;//imp new funct for loading 
    }

    /*new functionaity for read and write logic*/
    data[dataIndex].loading = true;
    this.setState({ data, activeObis });
    this._source = axios.CancelToken.source();

    if (active_reqs[dataIndex] != undefined) {
      active_reqs[dataIndex] = this._source;
    }//updated value replaced at the same key
    else {
      active_reqs[dataIndex] = this._source;
    }//new value INSERTED
    this.setState({ active_reqs });

    
    //----prev api request ---//
    // `${API_ENDPOINT}${ENDPOINTS.GET_DEVICE_PARAM}?param=${obis}&device_id=${deviceId}`
    //-----prev api request ---//

    axios.get(`${api_query_string}`, {
      cancelToken: this._source.token, headers: {
        'Authorization': 'Token ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res.data);
        data[dataIndex].loading = false;
        data[dataIndex].unit = res.data.unit;
        data[dataIndex].value = res.data.val;
        /*----new functionality for status message----*/
        data[dataIndex].status = res.data.status;
        console.log(res.data.status);
        /*----new functionality for status message----*/

        /*-----NEW FUNTIONALITY OF SETTING VALUE AFTER READS OR WRITES ---------*/

        if (obis == "128.12.77") { this.refs[obis.split('.').join('-')].value = res.data.val; } //testing purpose dropdown 
        else if (obis == "128.12.78") { this.refs[obis.split('.').join('-')].value = res.data.val; } //testing purpose dropdown
        else if (obis == "128.12.59") { this.refs[obis.split('.').join('-')].value = res.data.val; } //testing purpose for dropdown
        else { /*---impp new functionality for status showing on frontend fro write commands---*/
          
          if(res.data.val== 'True' ){data[dataIndex].status=true;}
          else if(res.data.val== 'False' ){data[dataIndex].status=false;}
          else{
          this.refs[obis.split('.').join('-')].value = res.data.val;
          }

          /*---new functionality for status showing on frontend fro write commands---*/
        }//end of else in new functionality code portion

        /*------NEW FUNTIONALITY OF SETTING VALUE AFTER READS --------*/
        
        ///////////////new funct for cancel loading requests//////////////
        if (operation_type == "read") {
          data[dataIndex].loading_read = false;//imp new funct for loading
        }
        if (operation_type == "write") {
          data[dataIndex].loading_write = false;//imp new funct for loading
        }
        if (operation_type == "Exec") {
          data[dataIndex].loading_exec = false;//imp new funct for loading

        }
        ///////////////////////////////////
        this.setState({ data }); //impp without setstate is being working correct
      })
      .catch(err => {
        console.log(err.message);
      });

  }

  removeItem(reading, operation_type) {

    let { activeObis, activeObis_write, data } = this.state;
    const indexFound = activeObis.indexOf(reading);
    const indexFound_write = activeObis_write.indexOf(reading);

    if (operation_type == "read") {
      console.log(activeObis);
      console.log(indexFound);
      if (indexFound !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
        activeObis.splice(indexFound, 1);
      }
    }
    /*new functionaity for read and write logic*/
    if (operation_type == "write") {
      console.log(activeObis_write);
      console.log(indexFound_write);
      if (indexFound_write !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
        activeObis_write.splice(indexFound_write, 1);
      }
    }
    /*new functionaity for read and write logic*/
    const dataIndex = data.indexOf(reading);
    /////////////////////////////////////////////
    if (reading.checked != undefined) { reading.checked = false } /*  for indeterminate check */
    /////////////////////////////////////////////
    /*new functionaity for read and write logic*/
    if (operation_type == "read") {
      reading.read = false;
      if (reading.write == true) {
        reading.write = false;
        if (indexFound_write !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
          activeObis_write.splice(indexFound_write, 1);//imp if to updated arrays
        }
      }
    }
    else if (operation_type == "write") {
      reading.write = false;
      if (reading.read == true) {
        reading.read = false;
        if (indexFound !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
          activeObis.splice(indexFound, 1);//imp if to updated arrays
        }
      }
    }

    /*new functionaity for read and write logic*/
    /*  for indeterminate check, code should be placed after complete removal of elements form respective arrays impppppp */
    if (operation_type == "read") {
        if(activeObis.length >= activeObis_write.length ){
            if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
            else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
            if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
        }
        if(activeObis.length < activeObis_write.length ){
            if (activeObis_write.length !== data.length && activeObis_write.length !== 0) { this.refs.check_me.indeterminate = true; }
            else if (activeObis_write.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
            if (activeObis_write.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
        }
    }//end of read condition

    if (operation_type == "write") {
        if(activeObis.length >= activeObis_write.length ){
          if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
          else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
          if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
      if(activeObis.length < activeObis_write.length ){
          if (activeObis_write.length !== data.length && activeObis_write.length !== 0) { this.refs.check_me.indeterminate = true; }
          else if (activeObis_write.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
          if (activeObis_write.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
    }//end of write condition
    /*  for indeterminate check */
    reading.checked = false   /*  for indeterminate check */
    reading.value = undefined;
    reading.unit = undefined;
    data[dataIndex] = reading;
    //console.log(dataIndex);//ok reading the correct index
    this.setState({ data });
    this.setState({ activeObis, activeObis_write });

  }

  removeItem_load(reading, operation_type) {
    let { activeObis, activeObis_write, data, active_reqs } = this.state;
    const indexFound = activeObis.indexOf(reading);
    const indexFound_write = activeObis_write.indexOf(reading);

    /*new functionaity for read and write logic*/
    if (operation_type == "read") {
      if (indexFound !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
        activeObis.splice(indexFound, 1);//imp if to updated arrays
      }
      reading.loading_read = false;//imp new funct for loading
      reading.read = false;
    }
    else if (operation_type == "write") {
      if (indexFound_write !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
        activeObis_write.splice(indexFound_write, 1);//imp if to updated arrays
      }
      reading.loading_write = false;//imp new funct for loading
      reading.write = false;
    }
    else if (operation_type == "Exec") {
      reading.loading_exec = false;//imp new funct for loading
    }

    /*new functionaity for read and write logic*/
    const dataIndex = data.indexOf(reading);
    /*  for indeterminate check */
    if (operation_type == "read") {
      if(activeObis.length >= activeObis_write.length ){
        if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
        else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
        if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
      if(activeObis.length < activeObis_write.length ){
          if (activeObis_write.length !== data.length && activeObis_write.length !== 0) { this.refs.check_me.indeterminate = true; }
          else if (activeObis_write.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
          if (activeObis_write.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
    }//end of read condition
    if (operation_type == "write") {
      if(activeObis.length >= activeObis_write.length ){
        if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
        else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
        if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
      if(activeObis.length < activeObis_write.length ){
        if (activeObis_write.length !== data.length && activeObis_write.length !== 0) { this.refs.check_me.indeterminate = true; }
        else if (activeObis_write.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
        if (activeObis_write.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
      }
    }//end of write condition
    /*new functionaity for read and write logic*/
    reading.value = undefined; //imp to have  for read all selected case while loading but not for simple remove case
    reading.unit = undefined;  // imp to have for read all selected case while loading but not for simple remove case
    reading.loading = false;
    reading.checked = false   /*  for indeterminate check */
    /*  for indeterminate check */
    data[dataIndex] = reading;
    this.setState({ data, activeObis, activeObis_write });

    let sr = this.state.active_reqs[dataIndex];

    if (sr !== undefined) {
      sr.cancel('Operation canceled due to new request.')
    }


  }


  fetchAllSelected() {
    const { activeObis, data } = this.state;
    var newArraycpy = activeObis.slice();//shallow copy
    activeObis.length = 0;//activeObis:[] not working here impp
    this.setState({ activeObis });
    newArraycpy.forEach((reading, index) => {
      this.fetchDetail(reading.obis, "read");
    });

  }

  fetchAllSelected_write() {
    const { activeObis_write, data } = this.state;
    var newArraycpy = activeObis_write.slice();//shallow copy
    activeObis_write.length = 0;//activeObis:[] not working here impp
    this.setState({ activeObis_write });
    newArraycpy.forEach((reading, index) => {
      this.fetchDetail(reading.obis, "write");
    });

  }


  render() {

    const { deviceId } = this.props;
    const { data, activeObis, activeObis_write, error_status, error_spec, meter_conn, isChecked, isChecked_action } = this.state;
    let sr_counter = 1;
    let list_arr = []

    if (!deviceId) {
      return <div style={{ color: '#2980b9', fontWeight: '500' }}>Please Select MSN</div>
    }

    if ((data.length === 0 && error_status === true) || error_spec === true) {
      return <div style={{ fontWeight: '500' }}>No items found
              <input
          ref="check_me"
          style={{ marginTop: '0px', display: 'none' }}
        />

      </div>
    }

    /*if (meter_conn == false) {
      return <div style={{ fontWeight: '500' }}>Meter Connection Is Not Alive</div>
    }*/

    return (
      <React.Fragment>
        {data.length === 0 ?
          <div style={{ textAlign: 'center' }}>
            <Spin indicator={antIcon} style={{ alignContent: 'center' }} />
          </div>
          :
          <div>
            <button
              disabled={activeObis_write.length=== 0} 
              className="btn btn-success"
              style={{ float: 'right', marginBottom: '10px' }}
              onClick={() => this.fetchAllSelected_write()} 
            >
              Write Selected
            </button>

            <button
              disabled={activeObis.length === 0}
              className="btn btn-success"
              style={{ float: 'right', marginBottom: '10px', marginRight: '10px' }}
              onClick={() => this.fetchAllSelected()}
            >
              Read Selected
          </button>
        </div>
        }

        {/*
        <div className="row">
          <div className=" col-xs-6 col-md-6">
            <h2 className="custom-h2"><span > On Demand Reading </span></h2>
          </div>
        </div>
        */}

        <div style={{ clear: 'both' }} />
        <div id="dynamic-height-frag" className="table-responsive" style={{ display: data.length === 0 ? 'none' : '' }}   >
          <table className="table table-bordered" >
            <thead>
              <tr>
                <th scope="col">Sr.</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                {/*<th scope="col">OBIS</th>*/}
                <th scope="col" style={{ width: '15%' }}>Value</th>
                {/*<th scope="col">Value</th>*/}
                {/*<th scope="col">Unit</th>*/}
                <th scope="col" style={{ width: '30%' }}>  {/* given width is suitable*/}
                  <div style={{ height: '15px' }}>
                    <input
                      ref="check_me"
                      className="action-input"
                      type="checkbox"
                      value={true}
                      id="handle_checks"
                      onChange={this.handlecheckboxChange}
                      style={{ marginTop: '0px' }}
                    />
                    <label htmlFor="handle_checks" style={{ color: '#fff' }} >&nbsp;Action</label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                data.map(reading => {

                    var parsed = JSON.parse(JSON.stringify(JSON.parse(reading.list_values)));
                    var arr = [];
                    for(var x in parsed){
                        arr.push(parsed[x]);}

                    return ( 

                            <tr key={sr_counter} style={
                                  { fontWeight: '500', background: reading.highlight ? 'lightgoldenrodyellow' : 'white' }
                                }>
                                  <td>{sr_counter++}</td>{/* prev is {reading.indx}  */}
                                  <td>{reading.title}</td>
                                  {/*<td>{reading.obis}</td>*/}

                                  <td>
                                  { reading.status!= undefined ?
                                      
                                      reading.status == true ? 
                                        <Icon   type="check-circle" theme="twoTone" twoToneColor="#52c41a"  
                                        style={{fontSize: '16px'}} />
                                      :
                                        <Icon   type="close-circle" theme="twoTone" twoToneColor="red"  
                                        style={{fontSize: '16px'}} />
                                    :
                                    <span/>
                                  }
                                       
                                  </td>
                                  <td>                                  
                                    {
                                      reading.list_values ?
                                        <select style={{ width: '100%' }}
                                            ref={reading.obis.split('.').join('-')}
                                          >
                                              {             
                                                arr.map((obj,index) => {                                        
                                                    return(   
                                                       
                                                       <option key={index} value={obj=='Mode 0'|| obj== 'Mode 1'|| obj== 'Mode 2'|| obj== 'Mode 3'|| obj=='Mode 4'|| obj=='Mode 5'|| obj=='Mode 6'
                                                                                  ? index : index+1 }>{obj}</option>
                                                    )
                                                })
                                              }                                         
                                        </select>                                       
                                      :
                                      <input type="text" ref={reading.obis.split('.').join('-')} className="form-check-input text-box"  
                                              /*placeholder={(reading.value || reading.value === 0) ? reading.value : ''} */ /> 
                                                                       
                                    }
                                    
                                  </td>

                                  {/*<td>{(reading.value || reading.value === 0) ? reading.value : ''}</td> */}
                                  {/*<td>{reading.unit || ''}</td>*/}

                                  <td>
                                        {
                                          reading.loading && reading.loading_read && <span style={{ lineHeight: '1.5', fontWeight: '500', cursor: 'pointer' }} onClick={() => this.removeItem_load(reading, "read")}> Loading  </span>
                                        }

                                        {reading.action_read ?
                                          !reading.loading && (((!reading.value && reading.value !== 0) || !reading.read) && (!reading.read)) && (
                                            <button className="btn btn-success btn-xs" style={{ marginTop: '-4px', fontWeight: '500', marginLeft: '6px', marginRight: '10px', color: '#ffff' }} onClick={() => this.fetchDetail(reading.obis, "read")}>{reading.action_read}</button>
                                          ) : <span />
                                        }

                                        {
                                          !reading.loading && (((reading.value || reading.value === 0) && reading.checked && reading.read && reading.action_read) || (reading.read && reading.action_read)) && (
                                            <span className="form-check" style={{ marginTop: '-4px', paddingRight: '10px' }}>
                                              <input
                                                type="checkbox"
                                                value={true}
                                                className="form-check-input"
                                                id={reading.obis}
                                                defaultChecked={isChecked}
                                                onClick={() => this.removeItem(reading, "read")}
                                                style={{ marginTop: '0px', fontWeight: '500' }}
                                              />
                                              <label className="form-check-label" htmlFor={reading.obis} style={{ fontWeight: '500' }}>&nbsp;Read</label>
                                            </span>
                                          )
                                        }
                                        {
                                          !reading.loading && (((reading.value || reading.value === 0) && reading.checked && reading.write && reading.action_write) || (reading.write && reading.action_write)) && (
                                            <span className="form-check" style={{ marginTop: '-4px' }}>
                                              <input
                                                type="checkbox"
                                                value={true}
                                                className="form-check-input"
                                                id={reading.obis}
                                                defaultChecked={isChecked}
                                                onClick={() => this.removeItem(reading, "write")}
                                                style={{ marginTop: '0px', fontWeight: '500' }}
                                              />
                                              <label className="form-check-label" htmlFor={reading.obis} style={{ fontWeight: '500' }}>&nbsp;Write</label>
                                            </span>
                                          )
                                        }

                                        {
                                          reading.loading && reading.loading_write && <span style={{ lineHeight: '1.5', fontWeight: '500', cursor: 'pointer' }} onClick={() => this.removeItem_load(reading, "write")}> Loading  </span>
                                        }

                                        {reading.action_write ?
                                          !reading.loading && (((!reading.value && reading.value !== 0) || !reading.write) && (!reading.write)) && (
                                            <button className="btn btn-success btn-xs" style={{ marginTop: '-4px', fontWeight: '500', marginLeft: '6px', marginRight: '10px', color: '#ffff' }} onClick={() => this.fetchDetail(reading.obis, "write")}>{reading.action_write}</button>
                                          ) : <span />
                                        }

                                        {
                                          reading.loading && reading.loading_exec && <span style={{ lineHeight: '1.5', fontWeight: '500', cursor: 'pointer' }} onClick={() => this.removeItem_load(reading, "Exec")}> Loading  </span>
                                        }

                                        {reading.action_exec ?
                                          !reading.loading && (((!reading.value && reading.value !== 0) || !reading.exec) && (!reading.exec)) && (
                                            <button className="btn btn-success btn-xs" style={{ marginTop: '-4px', fontWeight: '500', marginLeft: '6px', color: reading.action_exec == 'Exec' ? 'yellow' : '#ffff' }} onClick={() => this.fetchDetail(reading.obis, "Exec")}>{reading.action_exec}</button>
                                          ) : <span />
                                        }

                                  </td>
                                </tr>

                      )

                 })

              }

            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}

export default RemotingSettingsTabElement;
