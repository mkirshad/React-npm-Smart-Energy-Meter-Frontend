import React from 'react'
import { getDeviceInfo, searchDevices, getAllDevices, PostAllMsnsIds, get_dim_device_child_nodes } from '../../API/readings';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import axios from 'axios';
import { render } from "react-dom";
import DropdownTreeSelect from "react-dropdown-tree-select";
import $ from "jquery";
import { TreeSelect, Icon, Spin } from 'antd';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { TreeNode } = TreeSelect;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class RemotingSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      offset: 0,
      child_results: [],
      value: undefined,
      treeData: [],
      rs: [],
      rs_result: [],
      current_parent_node_id: '',
      current_parent_node: '',
      current_parent_node_via_select: '',
      res_ids_results: [],
      activeId: '',
      devices_length: '',
      req_ids: { 'ids': '' },
      active_status_check: false,
      dynm_height: '',
      scroll_loading_chk: false,

    };
    this.getchilds = this.getchilds.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);

  }


  handleScroll = (e) => {
    const { offset, devices_length, results, query, child_results, current_parent_node_id, current_parent_node, scroll_loading_chk, rs } = this.state;
    var height = e.target.clientHeight;
    //console.log(height);

    height = height * 0.8;
    const target_height = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + height;
    if (target_height) {
      console.log("bottom reached");

      this.setState({
        offset: Math.floor(child_results.length / SEARCH_LIMIT), scroll_loading_chk: Math.floor(child_results.length / SEARCH_LIMIT) == offset ? false : true,
      });

      if (child_results.length - (SEARCH_LIMIT + ((Math.floor(child_results.length / SEARCH_LIMIT) - 1) * 20)) == 0) {
        this.onLoadData(current_parent_node);

      }

    }


  }


  onSelect = async (value, treeNode) => {
    const { res_ids_results, active_status_check, current_parent_node_via_select } = this.state;

    console.log(value);
    var tt = treeNode.selectHandle.className;
    tt = tt.split(" ");
    //console.log(tt[0]);
    var node_li_classname = treeNode.props.className;
    //console.log(node_li_classname);

    this.setState({
      current_parent_node_via_select: treeNode  //working correct copying the tree node
    });

    //console.log(this.state.current_parent_node_via_select);

    var val_arr = value;
    val_arr = val_arr.split(",");

    //console.log(val_arr); 
    //console.log(val_arr[1]);
    var val_id = parseInt(val_arr[1], 10);//conversionit's important vvvvv as in db id is in int
    //var val_id = val_arr[1];
    if (treeNode.props.dataRef.isLeaf) {
      this.setState({ value });

      this.props.onHandleMeterStatus(value);//here impp only for leaf nodes

    }

    ////////////////////////

    if (treeNode.props.dataRef.isLeaf === false && tt[1] === 'ant-select-tree-node-content-wrapper-close') {
       var re1 = $('li.' + node_li_classname + " span")
        .first().trigger("click");

    }

    if (treeNode.props.dataRef.isLeaf === true) {

      $('span.ant-select-enabled').trigger("click");
    }

    ////////////////////////////

  }



  onChange = async (value, treeNode) => {
    const { res_ids_results, active_status_check, current_parent_node_via_select } = this.state;

    console.log('onChange ', value);//prints id or key
    console.log('node  ', treeNode);//prints pakistan and all in the title field in tree node

    console.log(this.state.current_parent_node_via_select);
    var val_arr = value;
    val_arr = val_arr.split(",");

    //console.log(val_arr); 
    //console.log(val_arr[1]);
    var val_id = parseInt(val_arr[1], 10);//conversionit's important vvvvv as in db id is in int
    //var val_id = val_arr[1];
    this.setState({ value });
    ////////////////////////

    // const res = await getDeviceInfo(value);  //old version
    const res = await getDeviceInfo(val_id);//if await removes not working imppp nothing receives in response 
    if (res.fail) {
      console.log('DEVICE INFO API CALL FAILED -> ', value, res);
    } else {
      //console.log(res);
      this.props.onHeaderClick(res, res_ids_results.includes(val_id), active_status_check);
      this.setState({
        activeId: val_id,
      });

    }

  };


  onLoadData = treeNode => new Promise((resolve) => {
    //after the intial expand onload doesn't call everytime you collapse or expand the parent impppppppppp
    const { rs, offset } = this.state;
    let trend = treeNode;//copy the treenode working

    /*if (treeNode.props.children) {
      resolve();
      return;
    }*/ //imp for when you already ahve children in treenode just return without doing anything
    setTimeout(() => {

      var ch_res = [];

      this.getchilds(treeNode.props.eventKey, offset, SEARCH_LIMIT).then((res) => {

        this.setState({
          rs: res, current_parent_node_id: treeNode.props.eventKey
        });

        this.state.rs.forEach((reading, index) => {

          var msn_cpy = reading.msn && reading.msn !== null ? reading.msn : '';
          let obj = {
            title: msn_cpy + " " + reading.address, key: reading.id, value: reading.address + " " + msn_cpy + "," + reading.id, last_connection_id: reading.last_connection_id,
            isLeaf: reading.type && reading.type == 'device' ? true : false
          };
          ch_res.push(obj);

        });

        var newdatacpy = ch_res.slice();//shallow copy
        treeNode.props.dataRef.children = newdatacpy;  //VVVVIMP line to store children
        //ch_res.length = 0;//activeObis:[] not working here impp don't do this otherwise not working but with a shallow copy works

        this.setState({
          treeData: [...this.state.treeData]
        });
        this.setState({
          current_parent_node: treeNode  //working correct copying the tree node
        });

        $('span.ant-select-enabled').trigger("click");

      });

      resolve();


    }, 1000);

  });


  async getchilds(currnode_id, off_set = 0, SEARCH_LIMIT) {
    const res = await get_dim_device_child_nodes(currnode_id, SEARCH_LIMIT, off_set);
    if (res.fail) {
      console.log('DEVICE GET CHILD NODES -> ', res);
    } else {
      
      this.setState({
        child_results: res
      });

    }
    return this.state.child_results;
  };



  renderTreeNodes = data => data.map((item) => {
    const { res_ids_results, active_status_check, activeId } = this.state;

    let chk_click = '';
    if (!item.isLeaf && item.children) {
      chk_click = true;
    }
    else {
      chk_click = false;
    }

    let chk_conn = (item.last_connection_id && !active_status_check) || (res_ids_results.includes(item.key) && active_status_check);
    if (item.children) {
      return (

        <TreeNode id={item.key} className={item.isLeaf ? (chk_conn ? 'active-meter-item' : 'active-meter-item-offline') : '' + item.key}
          style={{ fontWeight: (item.key === activeId && item.isLeaf) ? '700' : '', }}
          icon={item.isLeaf && chk_conn ? <Icon type="link" /> : item.isLeaf && !chk_conn ? <Icon type="disconnect" /> :
            item.children ? <Icon type="folder-open" /> : <Icon type="folder" />}
          {...item} value={item.value} last_connection_id={item.last_connection_id} dataRef={item}>

          {this.renderTreeNodes(item.children)}

        </TreeNode>

      );
    }
    return (
      <TreeNode id={item.key} className={item.isLeaf ? (chk_conn ? 'active-meter-item' : 'active-meter-item-offline') : '' + item.key}
        style={{ fontWeight: (item.key === activeId && item.isLeaf) ? '700' : '', }}
        icon={item.isLeaf && chk_conn ? <Icon type="link" /> : item.isLeaf && !chk_conn ? <Icon type="disconnect" /> :
          item.children ? <Icon type="folder-open" /> : <Icon type="folder" />}
        {...item} value={item.value} last_connection_id={item.last_connection_id} dataRef={item} />

    );

  });



  getInfo = async (off_set = 0) => {
    const { query, treeData } = this.state;
    let type = 'group';
    let parent_id = '';

    const res = await searchDevices(query, SEARCH_LIMIT, off_set, type, parent_id);
    if (res.fail) {
      console.log('DEVICE SEARCH FAILED -> ', query, res);
    } else {

      this.setState({
        results: res
      });

      let temp = '';

      this.state.results.forEach((reading, index) => {
        var msn_cpy = reading.msn && reading.msn !== null ? reading.msn : '';
        temp = {
          title: msn_cpy + " " + reading.address, key: reading.id, value: reading.address + " " + msn_cpy + "," + reading.id, last_connection_id: reading.last_connection_id,
          isLeaf: reading.type && reading.type == 'device' ? true : false
        };

        //Object.assign(treeData, temp);//old version
        treeData.push(temp);//new version

      })

      this.setState({ treeData: [...this.state.treeData] });//imp line to updated treedata working fine

      //console.log(treeData);


    } //end of else



  };

  componentDidMount() {
    const { hgt } = this.props;
    const { query, data_json } = this.state;

    this.setState({
      token: localStorage.getItem('token'),
    });
    this.getInfo();
    this.schedulerfunction();

  }


  schedulerfunction = () => {
    this.interval = setInterval(this.ActiveMsnsScheduler, 15000);
  };

  componentWillUnmount() {
    /*wow works at last great successimp*/
    clearInterval(this.interval);
  }


  ActiveMsnsScheduler = async () => {
    const { results, req_ids, active_status_check, res_ids_results, activeId, child_results } = this.state;
    var ids_arr = [];

    child_results.map(r => (

      ids_arr.push(r.id)
    ));
    req_ids['ids'] = ids_arr;
    const res = await PostAllMsnsIds(req_ids);
    if (res.fail) {
      console.log('PostAllMsnsIds RESPONSE FAILED -> ', res);
    }
    else {
      console.log(res.active_ids);
      this.setState({
        res_ids_results: res.active_ids, req_ids, active_status_check: true
      });
      this.props.onHandleStatus(res.active_ids.includes(activeId));
    }
  };



  render() {
    const { hgt, heading } = this.props;
    const { results, req_ids, res_ids_results, active_status_check, dynm_height, child_results, scroll_loading_chk, rs, offset } = this.state;

    return (
      <div>
        <div id={heading} style={{ margin: '0 5px 20px 5px', padding: '15px', backgroundColor: '#fff', height: '550px' }}>
          <h2><span className="pane-h2">Meter Search</span></h2>


          {scroll_loading_chk && offset == Math.floor(rs.length / SEARCH_LIMIT) ? <div style={{ textAlign: 'center' }}>
            <Spin indicator={antIcon} style={{ alignContent: 'center' }} /> </div> : ''}
          <div className="" onScroll={this.handleScroll}>

            <TreeSelect loadData={this.onLoadData}
              ref={ref => (this.select = ref)}
              //onLoad={this.loading}
              showSearch
              treeIcon={true}//woww works
              value={this.state.value}
              defaultOpen={true}
              closeMenuOnSelect={false}
              closeOnSelect={false}
              showLine={true}
              onTreeExpand={this.expand}
              onSelect={this.onSelect}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}  //is ne masla solve kia hai multiple select ka township ke case me thora bht
              searchPlaceholder="Search msn"
              placeholder="Please select msn"
              dropdownStyle={{ maxHeight: '420px', overflow: 'auto', }}
              dropdownClassName="single-search-analysis"   //wow great thing it works single-search-analysis
              dropdownMatchSelectWidth={true}
              style={{
                width: 200,
              }}

            >


              {this.renderTreeNodes(this.state.treeData)}



            </TreeSelect >
          </div>

        </div>

      </div>


    );
  }
}

export default RemotingSearch;
