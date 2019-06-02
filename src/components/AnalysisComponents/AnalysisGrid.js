import React from 'react';
import Highlighter from 'react-highlight-words';
import { getDeviceInfo, searchDevices, getAllDevices, PostAllMsnsIds, get_dim_device_child_nodes, get_date_model_child_nodes, PostAnalysisRawData } from '../../API/readings';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import axios from 'axios';
import { Table, Alert, message, Icon, Spin, Input, Button } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const SEARCH_LIMIT_CUSTOM = 30;


const onClose = (e) => {
  //console.log(e, 'I was closed.');
};


class AnalysisGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      results: [],
      voltage: '',
      main_current: '',
      ln_current: '',
      main_active_pwr: '',
      data: [],
      rs: [],
      offset: 0,
      error: false,
      postdata: {},
      scroll_loading_chk: false,
      fetch_loading_chk: false,
      loading: false,
      filters_chk: '',
      searchText: '',

    };
    this.handlesize1 = this.handlesize1.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.fetchAnalysisRawData = this.fetchAnalysisRawData.bind(this);
    this.warning = this.warning.bind(this);
    this.success = this.success.bind(this);
    this.getapidata = this.getapidata.bind(this);
    this.SelectionError = this.SelectionError.bind(this);

  }


  warning = () => {
    message.warning('Please Select all the Required filters.', 6);
  };

  success = () => {
    message.success('No data found for selected filters.', 6);
  };

  SelectionError = () => {
    const { activeGroup, data, offset } = this.state;
    message.warning('Please choose the correct selection of inputs.', 6);
    data.length = 0;
    this.setState({
      rs: []
    });
    this.setState({ data });
  };


  handleScroll = (e) => {
    const { offset, postdata, devices_length, results, query, child_results, current_parent_node_id, current_parent_node, scroll_loading_chk, rs } = this.state;
    var height = e.target.clientHeight;
    var prev_offset = '';
    //console.log(e.target.clientHeight);

    height = height * 0.7;
    const target_height = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + height;

    if (target_height && e.target.clientHeight > 100) {
      console.log("bottom reached");
      prev_offset = this.state.offset;

      this.setState({
        offset: Math.floor(rs.length / SEARCH_LIMIT_CUSTOM), scroll_loading_chk: Math.floor(rs.length / SEARCH_LIMIT_CUSTOM) == offset ? false : true,
      });

      // below condition for and check solves reptitive calls on scrolling when calc. result is zero
      if (rs.length - (SEARCH_LIMIT_CUSTOM + ((Math.floor(rs.length / SEARCH_LIMIT_CUSTOM) - 1) * 30)) == 0 ) {
        this.getapidata(postdata, true);

      }


    }


  }



  getapidata = async (postdatareq, chk) => {
    const { activeGroup, data, offset } = this.state;
    var req_data = {};

    if (chk === true) {//when coming from handlescrool
      var postdata_cpy = {};
      postdata_cpy = postdatareq;
      postdata_cpy['offset'] = offset;
      postdata_cpy['limit_param'] = SEARCH_LIMIT_CUSTOM;
      postdatareq = postdata_cpy;

    }
    if (chk === false) {//when coming from fetch button click 
      this.setState({
        offset: 0,
      });

    }

    /////////////// validations//////////////////
    //console.log(postdatareq['obis_val']);
    //console.log(postdatareq['msns_arr']);
    //console.log(postdatareq['fromdate_val']);//giving NaN is case of empty string
    //console.log(postdatareq['todate_val']);//giving NaN is case of empty string

    if (postdatareq['obis_val'] == '' || postdatareq['msns_arr'] == '' || isNaN(postdatareq['fromdate_val']) || isNaN(postdatareq['todate_val'])) { this.warning(); this.setState({ fetch_loading_chk: false }); }
    if ((!isNaN(postdatareq['fromdate_val']) && !isNaN(postdatareq['todate_val'])) && (postdatareq['fromdate_val'] > postdatareq['todate_val'] || postdatareq['todate_val'] < postdatareq['fromdate_val'])) {
      this.SelectionError(); this.setState({ fetch_loading_chk: false });
    }
    /////////////////////////////////


    if (postdatareq['obis_val'].length !== 0 && postdatareq['msns_arr'].length !== 0 && !isNaN(postdatareq['fromdate_val']) && postdatareq['fromdate_val'] <= postdatareq['todate_val']
      && !isNaN(postdatareq['todate_val']) && postdatareq['todate_val'] >= postdatareq['fromdate_val']) {

      req_data['raw-data'] = postdatareq;

      const res = await PostAnalysisRawData(req_data);
      if (res.fail) {
        console.log('PostAllMsnsIds RESPONSE FAILED -> ', res);
        this.setState({ error: true });
        this.warning();



      }//end of if
      else {
        console.log(res.raw_data_response);
        if (res.raw_data_response == '') { this.success(); }//in case of not data in response
        this.setState({ fetch_loading_chk: false });

        ////////////////////////////////////////
        //NEW functionality
        this.setState({ filters_chk: true });

        ////////////////////////////////////////

        var res_data = res.raw_data_response;

        this.setState({
          rs: res_data,
        });

        data.length = 0;
        var obj = '';

        for (let i = 0; i < res_data.length; i++) {

          obj = res_data[i];

          data.push({
            key: i,
            sr: `${i}`,
            msn: obj[7],
            date: obj[11],
            time: obj[12],
            obis: obj[5],
            obis_title: obj[10],
            value: obj[6],
            unit: obj[9],

          });
        }

        this.setState({ data });

      }//end of else


    }//end of first if


  };


  async fetchAnalysisRawData(e) {
    const { activeGroup, data, postdata } = this.state;
    const { postrawdata } = this.props;
    var ids_arr = [];
    var req_data = {};

    this.setState({ postdata: postrawdata });
    this.setState({ fetch_loading_chk: true });

    this.getapidata(postrawdata, false);

  }


  componentDidMount() {
    const { activeGroup, data } = this.state;
    this.setState({ token: localStorage.getItem('token') });
  }

  handlesize1(sz) {
    this.props.getSize(sz);
    //console.log(sz);
  };




  getColumnSearchProps = (dataIndex) => ({

    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });



  //new funtionality
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }



  handleTableChange = (pagination, filters, sorter) => {

    const { activeGroup, data, offset, filters_chk } = this.state;
    var obis_chk = false;
    var msn_chk = false;
    var date_chk = false;


    //console.log(sorter);
    //console.log(filters);
    //console.log(filters.obis);

    //console.log(data);


    //new functionality
    if (filters_chk == true) { //after selecting the filters 

      if (filters.obis != '') {


        data.forEach((reading) => {


          if (reading.obis == filters.obis) {
            obis_chk = true;
          }


        });


        //console.log(obis_chk);


      }


    }


  }




  render() {
    const { activeGroup, data, error, scroll_loading_chk, offset, rs, fetch_loading_chk } = this.state;
    const { deviceId, msn_status, getSize } = this.props;


    /////////////////////////////////////
    const columns = [{
      title: 'SR#',
      dataIndex: 'sr',
      width: '8%',

      //...this.getColumnSearchProps('sr'),

      sorter: (a, b) => a.sr - b.sr,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'MSN',
      dataIndex: 'msn',
      width: '10%',
      ...this.getColumnSearchProps('msn'),
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      //onFilter: (value, record) => record.msn.indexOf(value) === 0,

      sorter: (a, b) => a.msn.length - b.msn.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'DATE',
      dataIndex: 'date',
      width: '10%',
      ...this.getColumnSearchProps('date'),

      sorter: (a, b) => parseInt((a.date.split('-').join('')), 10) - parseInt((b.date.split('-').join('')), 10), //vvvimp to convert it to int
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'TIME',
      dataIndex: 'time',
      width: '10%',

      sorter: (a, b) => parseInt((a.time.split(':').join('')), 10) - parseInt((b.time.split(':').join('')), 10),//vvvimp to convert it to int
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'OBIS',
      dataIndex: 'obis',
      width: '8%',
      ...this.getColumnSearchProps('obis'),
    },
    {
      title: 'OBIS TITLE',
      dataIndex: 'obis_title',
      width: "15%",
      //...this.getColumnSearchProps('obis_title'),
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      width: '5%',
    },
    {
      title: 'UNIT',
      dataIndex: 'unit',
      width: '5%',
    }
    ];

    ///////////////////////////////////////////////



    return (


      <div className="pane equal" style={{ height: '400px !important' }}>
        {error ? <Alert
          message="Warning"
          description="Please Select all the Required filters."
          type="warning"
          closable
          onClose={onClose}
          showIcon
        /> : <span />}

        <h2 style={{ marginTop: '15px' }}><span >Analysis - Raw Data</span></h2>
        <div className="row">
          <div className="col-xs-12  col-sm-12 col-md-12  col-lg-12">
                <button
                  disabled={false}
                  className="btn btn-success"
                  style={{ float: 'right', marginBottom: '10px' }}
                  onClick={() => this.fetchAnalysisRawData()}

                >Fetch Data
                </button>
          </div>
        </div>

        {(scroll_loading_chk && offset == Math.floor(rs.length / SEARCH_LIMIT_CUSTOM)) || (fetch_loading_chk === true) ? <div style={{ textAlign: 'center' }}>
          <Spin indicator={antIcon} style={{ alignContent: 'center' }} /> </div> : ''}

        <div className="row">
          <div className="col-sm-12">

            <div className="pane equal" onScroll={this.handleScroll} style={{ padding: '15px 15px 0px', marginBottom: '0px' }}>
              <Table locale={{ emptyText: 'PLEASE SELECT THE REQUIRED FILTERS TO SHOW THE RAW DATA' }} onChange={this.handleTableChange} columns={columns} dataSource={data} pagination={false} scroll={{ x: 1100, y: 450 }} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalysisGrid;














