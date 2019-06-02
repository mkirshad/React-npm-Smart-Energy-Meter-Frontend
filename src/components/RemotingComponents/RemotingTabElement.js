import React from 'react';
import { find } from 'lodash-es';
import ReactDOM from "react-dom";
import { getOnDemandReading, getDeviceParamValue } from '../../API/onDemandReading';
import axios from 'axios';
import { Icon, Spin } from 'antd';
import { ENDPOINTS } from '../../API/config';
import { API_ENDPOINT, port } from '../../API/config';


const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RemotingTabElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      activeObis: [],
      error_status: false,
      error_spec: false,
      active_reqs: {},   // for itemremove while loading
      device_id_cpy: '',
      meter_conn: true,
      isChecked: true,
      isChecked_action: false,
      dataIndex_multi_fetch: undefined,

      group_cpy: null, //// new and vvimp for clock for and relay tabs for inter tabs
      
      spec_check_clock_status: '', //new funtionality for special clock check  when tabs change

    };
    this.fetchDetail = this.fetchDetail.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.removeItem_load = this.removeItem_load.bind(this);
    this.fetchAllSelected = this.fetchAllSelected.bind(this);
    this.ref_in_willreceiveprops = this.ref_in_willreceiveprops.bind(this);
    this.handlecheckboxChange = this.handlecheckboxChange.bind(this);

  }


  handlecheckboxChange(e) {
   
    let { activeObis, data, active_reqs } = this.state;
    var newdatacpy = data.slice();//shallow copy
    activeObis.length = 0;//activeObis:[] not working here impp
    if (e.target.checked === true) {
      //console.log("true");
      newdatacpy.forEach((reading, index) => {
        if (reading.action_exec  != 'Exec') {//imp for read all selected
          data[index].loading = false;
          data[index].checked = true;
          activeObis.push(reading);
        }

      }); //end foreach

      this.setState({ data });
      this.setState({ activeObis, active_reqs });//imp see it later
    }

    else {
      //console.log("false");
      newdatacpy.forEach((reading, index) => {
        data[index].checked = false;
        data[index].value = undefined; //imp to have  for read all selected case while loading but not for simple remove case
        data[index].unit = undefined;  // imp to have for read all selected case while loading but not for simple remove case
        data[index].loading = false;

      });
      activeObis.length = 0;//activeObis:[] not working here impp
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

    }

  }


  async componentDidMount() {

    console.log("didmounttab");
    const { group, deviceId, source_page, spec_check_clock } = this.props;

    //console.log(source_page);
    //console.log(group);
    //console.log(this.state.group_cpy);

    if (deviceId) {
      const res = await getOnDemandReading(group, deviceId, source_page);
      if (res.fail) {
        console.log('Cant fetch group demand reading -> ', res);
        this.setState({
          error_spec: true,
        });
      } else {
        this.setState({
          data: res, device_id_cpy: deviceId
        });

        // new functioality //
        if(group=="clock"){ this.setState({group_cpy: group, spec_check_clock_status:  spec_check_clock });} //new funtionality for special clock check  when tabs change
        // new functioality//

        console.log(res);

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

    this.setState({ active_reqs });

  }


  ref_in_willreceiveprops() {
    this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false;

  };

  async componentWillReceiveProps(props) {
    console.log("willreceivewilltabsporps");
    /*very imp funtion if props changes like deviceId but group prop
    not included in it.calls before render 
    and after render componentdidupdate calls not componentdidmount   
    */
    const { data, meter_conn, active_reqs, device_id_cpy, activeObis, spec_check_clock_status } = this.state;
    const { group, deviceId, source_page, msn_status_chk, spec_check_clock } = props;

    //console.log(source_page);
    //console.log(group);
    //console.log(this.state.group_cpy);
    //console.log(spec_check_clock_status);

    if (deviceId != this.state.device_id_cpy) {
      /////////////////////////////
      //new functionality
      //console.log(device_id_cpy);
      if (device_id_cpy != '') { this.ref_in_willreceiveprops(); } //yeah works great
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
      this.setState({ data, activeObis, active_reqs });//imp see it later

      
    }//end of first if

    // || (group == this.state.group_cpy)  //|| (group == this.state.group_cpy == 'clock' && msn_status_chk == null  )  // new and vvimp for clock for and relay(like common tabs) tabs for inter tabs

    if ((deviceId && this.state.data.length === 0) || (deviceId != this.state.device_id_cpy) || ( group == "clock" && this.state.group_cpy == "clock" && this.state.spec_check_clock_status )  ) {
       console.log('po1');
      const res = await getOnDemandReading(group, deviceId, source_page);
      if (res.fail) {
        console.log('Cant fetch group demand reading -> ', res);
      } else {
        this.setState({
          data: res, device_id_cpy: deviceId 
        });

        console.log(res);

        if (this.state.data.length === 0) {
          this.setState({
            error_status: true,
          });
        }

      }
    }


  }


  async fetchDetail(obis) { // // async is compulsary again

    const { data, activeObis, active_reqs } = this.state;
    const { deviceId } = this.props;
    const loadingItem = find(data, (item) => {
      if (item.obis === obis) {
        return item;
      }
    });

    ///////// for exec buttons  vvvimppp not included wowww great///////////////////
    if (loadingItem.action_exec  != 'Exec') {
      activeObis.push(loadingItem);
    }

    ///////////////////////////////////////////////////////////////////////////////
    this.setState({spec_check_clock_status:  false });//new funtionality for special clock check
    ////////////////////////////////////////////////////////////////////////////////

    /*  for indeterminate check */
    if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
    else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
    if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }

    /*  for indeterminate check */
    const dataIndex = data.indexOf(loadingItem);
    data[dataIndex].checked = true; /*  for indeterminate check */
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
    /*for (var key in active_reqs) {
      console.log("key " + key + " has value " + active_reqs[key]);
    }*/

    axios.get(`${API_ENDPOINT}${ENDPOINTS.GET_DEVICE_PARAM}?param=${obis}&device_id=${deviceId}&action=Read`, {
      cancelToken: this._source.token, headers: {
        'Authorization': 'Token ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        //console.log(res.data);
        data[dataIndex].loading = false;
        data[dataIndex].unit = res.data.unit;
        data[dataIndex].value = res.data.val;
        this.setState({ data }); //impp without setstate is being working correct
      })
      .catch(err => {
        console.log(err.message);
      });

  }

  removeItem(reading) {

    let { activeObis, data } = this.state;
    const indexFound = activeObis.indexOf(reading);
    if (indexFound !== -1) {//sepeare out the check as remove those items are necessary  which are not readed earlier 
      console.log(indexFound);
      activeObis.splice(indexFound, 1);
    }
    const dataIndex = data.indexOf(reading);
  
    if (reading.checked != undefined) { reading.checked = false } /*  for indeterminate check */
    /*  for indeterminate check */
    if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
    else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
    if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }
    /*  for indeterminate check */
    reading.value = undefined;
    reading.unit = undefined;
    data[dataIndex] = reading;
    //console.log(dataIndex);//ok reading the correct index
    this.setState({ data });
    this.setState({ activeObis });

  }

  removeItem_load(reading) {
    let { activeObis, data, active_reqs } = this.state;
    const indexFound = activeObis.indexOf(reading);
    if (indexFound !== -1) {

      activeObis.splice(indexFound, 1);//vvvvimp activeObis=activeObis.splice(indexFound, 1);won't wotks here remember
      const dataIndex = data.indexOf(reading);
      reading.value = undefined; //imp to have  for read all selected case while loading but not for simple remove case
      reading.unit = undefined;  // imp to have for read all selected case while loading but not for simple remove case
      reading.loading = false;
      reading.checked = false   /*  for indeterminate check */
      /*  for indeterminate check */
      if (activeObis.length !== data.length && activeObis.length !== 0) { this.refs.check_me.indeterminate = true; }
      else if (activeObis.length == 0) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = false; }
      if (activeObis.length === data.length) { this.refs.check_me.indeterminate = false; this.refs.check_me.checked = true; }

      /*  for indeterminate check */
      data[dataIndex] = reading;
      this.setState({ data, activeObis });

      let sr = this.state.active_reqs[dataIndex];

      if (sr !== undefined) {
        sr.cancel('Operation canceled due to new request.')
      }

    }

  }


  fetchAllSelected() {
    const { activeObis } = this.state;
    var newArraycpy = activeObis.slice();//shallow copy
    activeObis.length = 0;//activeObis:[] not working here impp
    this.setState({ activeObis });
    newArraycpy.forEach((reading) => {
      this.fetchDetail(reading.obis);
    });


  }


  render() {


    const { deviceId } = this.props;
    const { data, activeObis, error_status, error_spec, meter_conn, isChecked, isChecked_action } = this.state;

    if (!deviceId) {
      return <div style={{ color: '#2980b9', fontWeight: '500' }}>Please Select MSN</div>
    }

    if ((data.length === 0 && error_status === true) || error_spec === true) {
      return <div style={{ fontWeight: '500' }}>No items found</div>
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
              disabled={activeObis.length === 0}
              className="btn btn-success"
              style={{ float: 'right', marginBottom: '10px' }}
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
                <th scope="col">OBIS</th>
                <th scope="col">Value</th>
                <th scope="col">Unit</th>
                <th scope="col">

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
                data.map(reading => (

                  <tr key={reading.indx} style={
                    { fontWeight: '500', background: reading.highlight ? 'lightgoldenrodyellow' : 'white' }
                  }>
                    <td>{reading.indx}</td>
                    <td>{reading.title}</td>
                    <td>{reading.obis}</td>
                    <td>{(reading.value || reading.value === 0) ? reading.value : ''}</td>
                    <td>{reading.unit || ''}</td>
                    <td>
                      {
                        reading.loading && <span style={{ lineHeight: '1.5', fontWeight: '500', cursor: 'pointer' }} onClick={() => this.removeItem_load(reading)}> Loading  </span>
                      }
                      {
                        !reading.loading && (((!reading.value && reading.value !== 0) || !reading.checked || reading.action_exec  == 'Exec') && (!reading.checked || reading.action_exec  == 'Exec')) && (
                          <button className="btn btn-success btn-xs" style={{ marginTop: '-4px', fontWeight: '500', marginLeft: '6px', color: reading.action_exec  == 'Exec' ? 'yellow' : '#ffff' }} onClick={() => this.fetchDetail(reading.obis)}>
                          {reading.action_read ? reading.action_read : reading.action_write ? reading.action_write : reading.action_exec  }
                          </button>
                        )
                      }
                      {
                        !reading.loading && (((reading.value || reading.value === 0) && reading.checked && reading.action_exec  != 'Exec') || (reading.checked && reading.action_exec  != 'Exec')) && (
                          <div className="form-check" style={{ marginTop: '-4px' }}>
                            <input

                              type="checkbox"
                              value={true}
                              className="form-check-input"
                              id={reading.obis}
                              defaultChecked={isChecked}
                              onClick={() => this.removeItem(reading)}
                              style={{ marginTop: '0px', fontWeight: '500' }}
                            />
                            <label className="form-check-label" htmlFor={reading.obis} style={{ fontWeight: '500' }}>&nbsp;Read</label>
                          </div>
                        )
                      }
                    </td>
                  </tr>
                ))

              }

            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}

export default RemotingTabElement;
