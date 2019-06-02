import React from 'react'
import { get_obis_model_child_nodes } from '../../API/readings';
import { getOnDemandReading, getDeviceParamValue } from '../../API/onDemandReading';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import axios from 'axios';
import { render } from "react-dom";
import DropdownTreeSelect from "react-dropdown-tree-select";
import $ from "jquery";
import { TreeSelect, Icon, Spin } from 'antd';


const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { TreeNode } = TreeSelect;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class ObisSelecterComponentScheduling extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      offset: 0,
      child_results: [],
      value: undefined,
      treeData: [],
      rs: [],
      current_parent_node_id: '',
      current_parent_node: '',
      res_ids_results: [],
      activeId: '',
      devices_length: '',
      req_ids: { 'ids': '' },
      active_status_check: false,
      dynm_height: '',
      scroll_loading_chk: false,
      year_active: '',
      month_active: '',
      navigation_chk: '',
      obis_comp_dynm_height: 200, // deafult value is 200

      on_change_chk_spec: true, //new funct for obis_selection by default

    };
    this.getchilds = this.getchilds.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

  }


  handleScroll = (e) => {
    const { offset, devices_length, results, query, child_results, current_parent_node_id, current_parent_node, scroll_loading_chk, rs } = this.state;
    var height = e.target.clientHeight;
    //console.log(height);
    if (e.target.scrollTop > 0) {//woo great prevents horizontal scrolls

      height = height * 0.8;
      const target_height = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + height;
      if (target_height && e.target.clientHeight > 100) {
        console.log("bottom reached");
        var prev_offset = this.state.offset;

        this.setState({
          offset: Math.floor(child_results.length / SEARCH_LIMIT), scroll_loading_chk: Math.floor(child_results.length / SEARCH_LIMIT) == offset ? false : true,
        });
        // and check solves reptitive calls on scrolling when calc. result is zero

        if (child_results.length - (SEARCH_LIMIT + ((Math.floor(child_results.length / SEARCH_LIMIT) - 1) * 20)) == 0) {
          if (current_parent_node == '') {
            if (results.length - (SEARCH_LIMIT + ((Math.floor(results.length / SEARCH_LIMIT) - 1) * 20)) == 0) {
              this.getInfo('', Math.floor(results.length / SEARCH_LIMIT));
            }
          }
          else { this.onLoadData(current_parent_node); }
        }

      }//end of inner if

    }//end of first if 


  }


  onSelect = async (value, treeNode) => {
    const { navigation_chk } = this.state;
    const { heading } = this.props;
    //console.log(value);
    //console.log(treeNode);
    var str = value.toString();
    var escapedstr = (heading.split(' ').join('')).toLowerCase();
    var div_id = "analysis-raw-data-" + escapedstr;//title sign se string formation me issue hai

    var tt = treeNode.selectHandle.className;
    tt = tt.split(" ");
    //console.log(tt[1]);
    var node_li_classname = treeNode.props.className;
    //console.log(node_li_classname);
    this.setState({
      current_parent_node_via_select: treeNode, navigation_chk: true  //working correct copying the tree node
    });

    this.setState({
      activeId: value,
    });


    if (treeNode.props.dataRef.isLeaf) {
      this.setState({ value });
    }
    ////////////////////////
    if (treeNode.props.dataRef.isLeaf === false && tt[1] === 'ant-select-tree-node-content-wrapper-close') {
      var re1 = $('div.' + div_id + '  > div > ul').find('li.' + node_li_classname + " span")  //woww great works efficiently perfectly 
        .first().trigger("click");
    }
    ///////////////////////

  }


  onChange = async (value, treeNode) => {
    const { res_ids_results, active_status_check, results, offset } = this.state;
    const { heading } = this.props;
    var value_cpy = [];
    var final_obis_arr = [];
    console.log(value);
    //console.log(treeNode);

    /*--new functionality for obis commas selection bydefault comes first to set state -----*/

    this.setState({ on_change_chk_spec: false });//vvimp 

    /*----------------------*/ 

    this.setState({ value: value });//vvimp 


    //////////////////////////////////////////////////////////////////////////////////////////
    var escapedstr = (heading.split(' ').join('')).toLowerCase();
    var div_id = "analysis-raw-data-" + escapedstr;//title sign se string formation me issue hai
    //console.log(div_id);
    ///////////////////////////////////////////////////////////////////////////////////////////
    var catg_check = false;
    var element = '';
    value_cpy = value;
    //console.log(value_cpy);
    var res_obis_arr = [];
    var escapedstrcatg = '';
    var found = '';
    var catg_list = [];
    var get_childs_res = [];
    var ans = [];

    this.state.results.forEach((res_obj, index) => {
      catg_list.push(res_obj.category);

    });

    for (let i = 0; i < value_cpy.length; i++) {
      found = catg_list.includes(value_cpy[i]);
      if (found == true) {

        const res = await get_obis_model_child_nodes(value_cpy[i], offset, SEARCH_LIMIT);
        if (res.fail) {
          console.log('DEVICE GET CHILD NODES -> ', res);
        } else {
          //console.log(res);

          for (let i = 0; i < res.length; i++) {

            var obj = res[i];
            final_obis_arr.push((obj.obis.split('.').join('-')));

          }//end of for loop

        }//end of promise else

      }//end of found if

      else {
        final_obis_arr.push(value_cpy[i]);
      }

    }//end of for loop

    //console.log(final_obis_arr);
    //final_obis_arr list of all selected obis in 1-2-3 format and pass to raw data page
    if (escapedstr == 'obisregisters') { this.props.onHandleObisStatus(final_obis_arr); } //call here in leaf nodes only impp
  }


  onLoadData = treeNode => new Promise((resolve) => {
    //after the intial expand onload doesn't call everytime you collapse or expand the parent impppppppppp
    const { rs, offset, year_active, month_active } = this.state;
    const { hgt, heading } = this.props;
    ///////////////////////////////////
    console.log(offset);

    let trend = treeNode;//copy the treenode working
    /*if (treeNode.props.children) {
      resolve();
      return;
    }*/ //imp for when you already have children in treenode just return without doing anything
    setTimeout(() => {
      var ch_res = [];
      var catg = treeNode.props.dataRef.key;
      this.getchilds(catg, offset, SEARCH_LIMIT).then((res) => {

        //console.log(res);
        /*new functionality impppp*/////////////////////////
        var temp_res_arr_titles=[];
        res.forEach((reading, index) => {
            temp_res_arr_titles.push(reading.title);

          });

        let unique_titles_arr = [...new Set(temp_res_arr_titles)];
        console.log(unique_titles_arr);
        /*neww*//////////////////////////

        

        this.setState({
          rs: res, current_parent_node_id: treeNode.props.eventKey
        });
        
        //////////////////
        // impp prev is   this.state.rs.forEach((reading, index) => {  
        //////////////////

        this.state.rs.forEach((reading, index) => {   
          var escapedstrcatg = (reading.obis.split('.').join('-'));
          /*new*/

          /*new*/

          let obj = {
            title: reading.title,//previous reading.obis
            key: escapedstrcatg,  //impppp prev key  is escapedstrcatg is ko na touch krein warna jaan gae
            value: reading.title + '|' + reading.obis,  //prev version is  value: escapedstrcatg
            isLeaf: true
          };

          console.log( reading.title + '|' + reading.obis);
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

      });//end of promise function

      resolve();

    }, 1000);

  });


  async getchilds(category, off_set, SEARCH_LIMIT) {
    
    const { device_id } = this.props;


    //const res = await get_obis_model_child_nodes(category, off_set, SEARCH_LIMIT);  prev version is here

    const res = await getOnDemandReading(category, device_id, 'reading');  //new version 

    if (res.fail) {
      console.log('DEVICE GET CHILD NODES -> ', res);
    } else {
      console.log(res);
      this.setState({
        child_results: res
      });

    }
    return this.state.child_results;
  };

  renderTreeNodes = data => data.map((item) => {
    const { res_ids_results, active_status_check, activeId } = this.state;
    if (item.children) {
      return (
        <TreeNode className={item.isLeaf ? '' + item.key : '' + item.key}
          style={{ fontWeight: (item.key == activeId && item.isLeaf === true) ? '700' : '', }}
          icon={item.isLeaf === false ? item.children ? <Icon type="folder-open" /> : <Icon type="folder" /> : ''}
          title={item.title} key={item.key} value={item.value} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode className={item.isLeaf ? '' + item.key : '' + item.key}
        style={{ fontWeight: (item.key == activeId && item.isLeaf === true) ? '700' : '', }}
        icon={item.isLeaf === false ? item.children ? <Icon type="folder-open" /> : <Icon type="folder" /> : ''}
        {...item} value={item.value} dataRef={item} />

    );

  })


  getInfo = async (category = '', off_set = 0) => {
    const { query, treeData } = this.state;

    const res = await get_obis_model_child_nodes(category, off_set, SEARCH_LIMIT);
    if (res.fail) {
      console.log('DEVICE SEARCH FAILED -> ', query, res);
    } else {

      //console.log(res);
      
      this.setState({
        results: res
      });

      ////////new funtionality impp for root nodes /////////
      treeData.length = 0;
      this.setState({ treeData });
      ////////new funtionality  impp for root nodes/////////
      //console.log(this.state.results);
      //console.log(res);

      let temp = '';
      // this.state.results.forEach((reading, index) => { //prev version

      res.forEach((reading, index) => {

        if (reading.category != null) {
          var escapedstrcatg = (reading.category.split(' ').join('-'));
          temp = {
            title: reading.category, key: escapedstrcatg, value: escapedstrcatg,
            isLeaf: false,
          }
          treeData.push(temp);

        }

      })

      this.setState({ treeData: [...this.state.treeData] });//imp line to updated treedata working fine
      //console.log(treeData);

    } //end of else



  };

  componentDidMount() {
    const { device_schedule_commands_obis_data  } = this.props;
    const { query, data_json } = this.state;
    console.log("didmoountobiscomponent");
    console.log(device_schedule_commands_obis_data);

    this.setState({
      token: localStorage.getItem('token'),
    });


     //new func/////
     this.updateDimensions();
     //////////////

    //new tweaks//////////////////////////
    window.addEventListener("resize", this.updateDimensions);
    //////////////////////////////////////

    this.getInfo();//imp to call 

    /////////new functionality for device schedule commands //////////

    //var temp=[];//woaww
    //temp.push("Total Import Active Energy");//gret
    //this.setState({ value: temp });//working fine great
    var dev_sch_commands=[];
    
    /*device_schedule_commands_obis_data.forEach((reading, index) => {
        if (reading.obis != null) {  
            dev_sch_commands.push(reading.category.split('.').join('-'));
        }
      });  */
      
      ////////////////////////////////////////////////////////////////
      this.setState({ value: device_schedule_commands_obis_data });//vvimpsss new version

      //new funct  vimpp first to call in case of by bydefault behaviour
      this.props.onHandleObisStatus(device_schedule_commands_obis_data);

      //


    /////////////new functionality for device schedule commands ////////

    /////new functionality on 4_19_2019/////

    ///////////////////////////////////////
    
  }


  updateDimensions() {
    console.log("resize");

    if (window.innerWidth < 992 && window.location.pathname === '/analysis-raw-data') {
      this.setState({ obis_comp_dynm_height: 550 });
    }
    else{
      this.setState({ obis_comp_dynm_height: 200 });
    }

  }



  /* new funtionality in sceduling tab of remoting need this componentWillReceiveProps(props) function  */
  componentWillReceiveProps(props) {
    const { query, on_change_chk_spec, value } = this.state;
    const { obis_component_chk, device_schedule_commands_obis_data } = this.props;
    //var dev_sch_commands=device_schedule_commands_obis_data.slice();
    var dev_sch_commands=[];
    var tmp_emp_arr=[];
    
    /*device_schedule_commands_obis_data.forEach((reading, index) => {
        if (reading.obis != null) {  
            dev_sch_commands.push(reading.category.split('.').join('-'));
        }
      });  */

    console.log("willreceivepropsbiscomponent");

    console.log(obis_component_chk);

    console.log(on_change_chk_spec );

    console.log(device_schedule_commands_obis_data  );



    /////////new funtionality///////

    if(obis_component_chk == 'open-edit-dailogue'  &&  on_change_chk_spec  ){  //prev is close check condition
    //this.setState({ value: [] });//vvimpsss prev verion is  value: []
    this.setState({ value: device_schedule_commands_obis_data });//vvimpsss new version

    }//end of first if

    else if(obis_component_chk == 'open-add-new-dailogue'  &&  on_change_chk_spec  ){  //prev is close check condition
        //this.setState({ value: [] });//vvimpsss prev verion is  value: []
        this.setState({ value: []});//vvimpsss new version
    
    }//end of second if

    else if(obis_component_chk == 'close-add-new-dailogue-by-submit'){  //prev is close check condition
        
        this.setState({ value: []  });//vvimpsss new version

        this.setState({ on_change_chk_spec : true  });//vvimpsss
    
    }//end of third if

    else if(obis_component_chk == 'close-edit-dailogue-by-submit'){  //prev is close check condition
        this.setState({ value: [] });//vvimpsss new version
       
        this.setState({ on_change_chk_spec : true  });//vvimpsss 
    
    }//end of fourth if

    else if(obis_component_chk == 'close'){  //prev is close check condition
        //this.setState({ value: [] });//vvimpsss new version

        this.props.onHandleObisStatus(tmp_emp_arr); //jokhar tactic to call willreceiveprops of this cureent component forcefully
       
        this.setState({ on_change_chk_spec : true  });//vvimpsss 
    
    }//end of fifth if


    
    ///////////////////////////////

  }


  /* new funtionality need this componentWillReceiveProps(props) function  */

  componentWillUnmount() {
    /*wow works at last great successimp*/
    //console.log("unmountbiscomponent");

  }


  render() {
    const { hgt, heading } = this.props;
    const { results, obis_comp_dynm_height, res_ids_results, active_status_check, dynm_height, child_results, scroll_loading_chk, rs, offset } = this.state;
    var escapedstr='';
    var str='';
    if(heading!= undefined){escapedstr = (heading.split(' ').join('')).toLowerCase(); str = `please select ${heading}`;}
    else{ str = `please select Obis`;}
  
    var div_id = "analysis-raw-data-" + escapedstr;//title sign se string formation me issue hai

    //prev version by default value is obis_comp_dynm_height=200px

    return (
      <div>
        <div id={div_id} style={{ margin: '0 5px 20px 5px', padding: '15px', backgroundColor: '#fff', height: `${obis_comp_dynm_height}px`, paddingTop: '0px' }}>{/* prev height: '160px' */}
          { window.location.pathname != '/remoting-reading' ? <h2><span className="pane-h2">{heading}</span></h2> : <span/> }

          {scroll_loading_chk && offset == Math.floor(rs.length / SEARCH_LIMIT) ? <div style={{ textAlign: 'center' }}>
            <Spin indicator={antIcon} style={{ alignContent: 'center' }} /> </div> : ''}
          <div className="" onScroll={this.handleScroll} >
            <TreeSelect loadData={this.onLoadData}
              ref={ref => (this.select = ref)}
              onLoad={this.loading}
              showSearch
              treeIcon={true}
              value={this.state.value}
              onChange={this.onChange}
              dropdownStayOpen={true}
              closeMenuOnSelect={false}
              closeOnSelect={false}
              showLine={true}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              //searchPlaceholder="Search msn"
              //placeholder={str}
              dropdownStyle={{ maxHeight: '300px', overflow: 'auto', }}
              dropdownMatchSelectWidth={true}
              dropdownClassName={div_id}
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

export default ObisSelecterComponentScheduling;
