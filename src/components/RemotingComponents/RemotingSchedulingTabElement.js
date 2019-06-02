import React from 'react';
import { find } from 'lodash-es';
import ReactDOM from "react-dom";
import ObisSelecterComponent from '../AnalysisComponents/ObisSelecterComponent'; 
import ObisSelecterComponentScheduling from './ObisSelecterComponentScheduling';
import { GetDeviceSchedulesModelData, PostEditDeviceSchedulesFormData, PostAddNewDeviceScheduledFormData, GetDeviceScheduleCommandsData } from '../../API/readings';
import axios from 'axios';
import {
  Icon, Spin, Table, Input, InputNumber, Popconfirm, Form, Modal, Button, Alert, message,
  Drawer, Col, Row, Select, DatePicker, TimePicker, Checkbox
} from 'antd';
import { ENDPOINTS } from '../../API/config';
import { API_ENDPOINT, port } from '../../API/config';
import $ from "jquery";
import moment from 'moment';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const SEARCH_LIMIT_CUSTOM = 30;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';


/*const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i.toString(), 
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
*/


const FormItem = Form.Item;
const EditableContext = React.createContext();

/*class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
 
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;


     const { getFieldDecorator } = this.props.form;


    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

*/

class RemotingSchedulingTabElement extends React.Component {


  //onClick={() => this.setModal2Visible(true)}
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '', data: [], rs: [], offset: 0, error: false, modal2Visible: false, scroll_loading_chk: false, checked: false,
      fetch_loading_chk: false, visible: false, obis_val: [], dt_range_values: null, edit_row_key: '', add_new_schedule_chk: false,
      obis_component_def_chk: null, margin_style: '', margin_style_right: 10, obis_commands_data: [], add_new_schedule_id_response: null,
    };



    this.columns = [  //currently now total width is 70% and scrool x is 1000 works better fine
      {
        title: 'schedule_id',
        dataIndex: 'schedule_id',
        width: '10%',
        editable: true,
      },
      {
        title: 'interval_min',
        dataIndex: 'interval_min',
        width: '10%',
        editable: true,
      },
      {
        title: 'start_datetime',
        dataIndex: 'start_datetime',
        width: '20%',
        editable: true,
      },
      {
        title: 'end_datetime',
        dataIndex: 'end_datetime',
        width: '20%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);      //now returning false
          //console.log(record.key);//waoww giving correct key value set from data
          return (
            <div>
              {editable ?
                <span />
                :
                <Button type="primary" size={"small"} onClick={() => this.setModal2Visible(true, record.key)} style={{ marginRight: '15px' }} >Edit</Button>
              }
              {editable ?
                <span />
                :
                //<Button type="primary" size={"small"}  onClick={() => this.setModal2Visible(true, record.key )} >Edit</Button>
                <span />
              }
            </div>

          );
        },
      },
    ];

    this.fetchdDeviceSchedulesData = this.fetchdDeviceSchedulesData.bind(this);
    this.warning = this.warning.bind(this);
    this.success = this.success.bind(this);
    this.getapidata = this.getapidata.bind(this);
    this.handleobisstatus = this.handleobisstatus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
    this.updateDimensions = this.updateDimensions.bind(this);
    this.disabledDate = this.disabledDate.bind(this);

  }

  isEditing = record => record.key === this.state.editingKey;

  handleSubmit = (e) => {

    const { data, offset, edit_row_key } = this.state;
    const { deviceId } = this.props;

    var form_data = {};
    let tmp_dt = '';


    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        //this.props.onAuth(values.userName, values.password);
        //console.log(this.state.obis_val);
        if (this.state.obis_val.length == 0) { this.warning_obis(); } //imp if
        else {//console.log(values.dateTime);
          //console.log(values.interval_min);//correct interval min  value
          //console.log(values.status);//correct status value
          tmp_dt = values.time._d.toString().split(' ');
          //console.log(tmp_dt[4]);//correct time value
          //console.log(this.state.dt_range_values);//correct dates array value
          //.toString().split('/').join('-')
          //console.log(this.state.dt_range_values[0]._i);//correct dates array value

          //console.log(this.state.dt_range_values[0].toString().split('/').join('-'));//NOT correct date given

          form_data['start_date'] = this.state.dt_range_values[0] + " " + tmp_dt[4];
          form_data['end_date'] = this.state.dt_range_values[1] + " " + tmp_dt[4];
          form_data['min_interval'] = parseInt(values.interval_min, 10);//prev is string which is values.interval_min
          form_data['online_status'] = values.status;
          form_data['obis_arr'] = this.state.obis_val;
          form_data['device_id'] = deviceId;
          form_data['schedule_id'] = edit_row_key;//imp 

          console.log(form_data);//correct dates array value


          let status_res = this.submitFormData(form_data);

          if (status_res) { //if true status returned from submit query

            //* new functionality //////////////////////////////////////*/

            //var data_cpy=data;  //different pointer points to the same memory location badd practice impp to remind
            var data_cpy = data.slice();//shallow copy
            var res_final_data = data.slice();//shallow copy
            var obj = '';
            var today = '';
            let tmp_dt = '';
            var dates_arr = [];
            let temp_obj = '';


            //console.log(data);
            //console.log(res_final_data);

            console.log(edit_row_key);

            for (let i = 0; i < data_cpy.length; i++) {

              obj = data_cpy[i];

              if (obj.key == edit_row_key) {

                temp_obj = {
                  key: obj.key,
                  schedule_id: edit_row_key, //prev is obj.device_id
                  interval_min: values.interval_min,
                  start_datetime: this.state.dt_range_values[0] + " " + values.time._d.toString().split(' ')[4],
                  end_datetime: this.state.dt_range_values[1] + " " + values.time._d.toString().split(' ')[4],

                };


                //console.log(temp_obj);

                res_final_data.splice(i, 1, temp_obj);

                //console.log(res_final_data);

              }//end of inner if 


            } //end of for loop



            //////////////////
            data.length = 0;//imp to set 

            this.setState({ data: res_final_data });
            //* new functionality  /////////////////////////////////////*/

            setTimeout(function () { //Start the timer

              //new fun  should sets before closing the dailogue box of edit schedule///
              this.setState({
                obis_component_def_chk: 'close-edit-dailogue-by-submit',
              });
              ///////////

              this.setState({ modal2Visible: false });  //to close the model after clicking on submit button}

              $(".ant-select-dropdown").css("display", 'unset !important');
              $(".ant-select-dropdown").addClass("single-search");
              $(".analysis-raw-data-obisregisters").removeClass("single-search");//imp for obis registers



            }.bind(this), 2000);

          }//end of if


        }


      }
    });
  };

  

    handleSubmitNewSchedule = (e) => new Promise((resolve) => {

    const { data, offset, edit_row_key, add_new_schedule_id_response } = this.state;
    const { deviceId } = this.props;

    var form_data = {};
    let tmp_dt = '';

    //console.log("add");


    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        //this.props.onAuth(values.userName, values.password);
        //console.log(this.state.obis_val);
        if (this.state.obis_val.length == 0) { this.warning_obis(); }
        else {//console.log(values.dateTime);
          //console.log(values.interval_min);//correct interval min  value
          //console.log(values.status);//correct status value
          tmp_dt = values.time._d.toString().split(' ');
          //console.log(tmp_dt[4]);//correct time value
          //console.log(this.state.dt_range_values);//correct dates array value
          //.toString().split('/').join('-')
          //console.log(this.state.dt_range_values[0]._i);//correct dates array value

          //console.log(this.state.dt_range_values[0].toString().split('/').join('-'));//NOT correct date given

          form_data['start_date'] = this.state.dt_range_values[0] + " " + tmp_dt[4];
          form_data['end_date'] = this.state.dt_range_values[1] + " " + tmp_dt[4];
          form_data['min_interval'] = parseInt(values.interval_min, 10);
          form_data['online_status'] = values.status;
          form_data['obis_arr'] = this.state.obis_val;
          form_data['device_id'] = deviceId;
          //form_data['schedule_id'] = edit_row_key;//imp not send here no need to send it here in add new schedule

          console.log(form_data);//correct dates array value


          //let status_res = this.submitFormDataAddNewSchedule(form_data); //prev version wrong


          setTimeout(() => {

            this.submitFormDataAddNewSchedule(form_data).then((res) => {
  
              console.log(res);//correct dates array value
              let status_res=res;
              //////////new funtionality goes here/////////
        
  
              if (status_res == true) { //if true status returned from submit query and if scheduled id is returned then it will be very beneficial to store it in data.key
  
                //* new functionality //////////////////////////////////////*/
                
                //var data_cpy=data;  //different pointer points to the same memory location badd 
                var data_cpy = data.slice();//shallow copy
                var res_final_data=data.slice();//shallow copy
                var obj = '';
                var today='';
                let tmp_dt='';
                var dates_arr=[];
                let temp_obj='';
    
                console.log(data);
                console.log(this.state.add_new_schedule_id_response);
                console.log(res_final_data);
          
                temp_obj= {
                      key: this.state.add_new_schedule_id_response,  //actually the new added schedule id add_new_schedule_id_response
                      schedule_id: add_new_schedule_id_response, //prev is   deviceId
                      interval_min: parseInt(values.interval_min, 10),
                      start_datetime: this.state.dt_range_values[0]+" "+values.time._d.toString().split(' ')[4],
                      end_datetime: this.state.dt_range_values[1]+" "+values.time._d.toString().split(' ')[4],           
          
                };
    
                res_final_data.push(temp_obj );
      
    
                //////////////////
                data.length=0;//imp to set 
    
                this.setState({ data : res_final_data });
                
                //* new functionality  /////////////////////////////////////*/
    
                setTimeout(function () { //Start the timer
    
                  //new fun  should sets before closing the dailogue box of add new schedule///
                  this.setState({
                    obis_component_def_chk: 'close-add-new-dailogue-by-submit',
                  });
                  ///////////
    
                  this.setState({ modal2Visible: false });  //to close the model after clicking on submit button}
    
                  $(".ant-select-dropdown").css("display", 'unset !important');
                  $(".ant-select-dropdown").addClass("single-search");
                  $(".analysis-raw-data-obisregisters").removeClass("single-search");//imp for obis registers
    
    
    
                }.bind(this), 800);
    
              }//end of if



              //////////////////
  
              
  
              
  
              
  
  
            });//end of promise return 
  
            resolve();
  
  
          }, 1000); //end of settimeout function



         

           

            


         


          

         


        }//end of first else


      }
    });


  });





  onChange_date_range = (date, dateString) => { //date ia a moment type variable   

    //console.log(date);
    //console.log(dateString);//giving this (2) ["2019/04/03", "2019/05/03"] correct values of dates start-end
    this.setState({ dt_range_values: dateString });

    //sending back the parameters
    //if(escapedstr == 'daily-calender'){ this.props.onHandlecurrentmonthstatus(dateString); } //no need yet in this component

  }


  warning_obis = () => {
    message.warning('Please Select obis registers from dropdown.', 6);
  };


  onChange_checkbox = (e) => {
    //console.log(`checked = ${e.target.checked}`);

    this.setState({
      checked: e.target.checked,
    });

  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {

    console.log("close");
    

    //new fun///
    this.setState({
    obis_component_def_chk: 'close',
    });
    ///////////

    this.setState({
      modal2Visible: false,
    });

    //$(".single-search").show();

    $(".ant-select-dropdown").css("display", 'unset !important');
    $(".ant-select-dropdown").addClass("single-search");
    $(".analysis-raw-data-obisregisters").removeClass("single-search");//imp for obis registers

  };



  warning = () => {
    message.warning('Please Select the device ID.', 6);
  };

  warning_add_new_schedule = () => {
    message.warning('Please Select the device ID to add the new schedule.', 6);
  };

  error = () => {
    message.warning('error in the request', 6);
  };

  error_post_form_data = () => {
    message.warning('error while submitting the form Data', 6);
  };

  error_get_device_schedule_commands_data = () => {
    message.warning('error while fetching the device schedule commads data', 6);
  };

  success = () => {
    message.success('No data found for selected device ID.', 6);
  };

  success_form_submit = () => {
    message.success('DATA IS SUCCESFULLY UPDATED AND INSERTED.', 10);
  };


  success_form_submit_add_new_schedule = () => {
    message.success('NEW DEVICE SCHEDULE DATA IS SUCCESFULLY INSERTED.', 10);
  };

  failure_form_submit = () => {
    message.success('Failure! data is not updated succesfully.', 10);
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




  setModal2Visible_ADD_New_Schedule() {

    const { data, offset, rs, obis_val } = this.state;
    const { deviceId } = this.props;
    //console.log("open-add");

    $(".ant-select-dropdown").removeClass("single-search");
    $(".ant-select-dropdown").css("display", 'none !important');


    ///////////////////////////////////////////////////////////
    //moment('2015/01/01', dateFormat)

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    //this.props.form.setFieldsValue({ dateTime: ''});//imp to set datepicker range input value with momemt type dates array
    this.setState({   //IMP to set to open the add dailogue box 
      checked: true,
    });

    this.props.form.setFieldsValue({ status: true });//imp to set with empty fields while adding a new schedule waoww great to set it by default imppp

    this.props.form.setFieldsValue({ interval_min: '' });//imp to set with empty fields while adding a new schedule
    //this.props.form.setFieldsValue({ time: moment(time, 'HH:mm:ss')});//imp set to current time  to set with empty fields while adding a new schedule working fine 
    this.props.form.setFieldsValue({ time: null });

    /*--new funtionality for obis commads data when add dailogue box is being opend--*/

    //new fun///
    this.setState({
      obis_component_def_chk: 'open-add-new-dailogue',
    });
    ///////////

    this.setState({ obis_commands_data: [] });

    /*--new funtionality for obis commads data when add dailogue box is being opend--*/

    ////////////new tactic jokhar////////////
    //this.setState({ modal2Visible: false});//VVVIMP to set to open the add dailogue box 
    ///////////////////////
    this.setState({ modal2Visible: true });//VVVIMP to set to open the add dailogue box


  }



  setModal2Visible(modal2Visible, rowkey) {

    const { data, offset, rs } = this.state;
    const { deviceId } = this.props;
    console.log("open-edit-dailogue");

    //$(".single-search").hide();

    $(".ant-select-dropdown").removeClass("single-search");
    $(".ant-select-dropdown").css("display", 'none !important');


    ///////////new functionality///////////////

    this.setState({ add_new_schedule_chk: false }); //imp to set and useful in form submit action while adding new schedule

    ///////////////////////////////////////////

    //this.refs["interval_ref"].value=34;
    //$('#EmployeeId').val("fgg");

    //this.props.form.setFieldsValue({ interval_min: "12"});  //wowwwww graettt works
    //value and input id won't works with getfielddecorator keep in mind always but still refs can do somthing here but yet not tested

    //* new functionality //////////////////////////////////////*/
    var data_cpy = data;
    var res_final_data = data;

    var obj = '';
    var today = '';
    let tmp_dt = '';
    var dates_arr = [];
    var dates_arr_str = [];


    for (let i = 0; i < data_cpy.length; i++) {

      obj = data_cpy[i];

      ///
      if (obj.key == rowkey) {
        let temp_obj = [];

        this.props.form.setFieldsValue({ interval_min: obj.interval_min });

        ///////////////////////
        //2019-04-15T14:00:00  //["2019/04/03", "2019/05/03"]
        //tmp_dt=obj.start_datetime.split('T');//PREV VERSION 

        tmp_dt = obj.start_datetime.split(' ');
        let start_dt = tmp_dt[0]; //prev is tmp_dt[0].split('-').join('/') 
        tmp_dt = obj.end_datetime.split(' ');
        let end_dt = tmp_dt[0];  //prev is tmp_dt[1].split('-').join('/') 

        dates_arr_str.push(start_dt);
        dates_arr_str.push(end_dt);
        //console.log(dates_arr_str);
        //today = yyyy + '/' + mm + '/' + dd;
        start_dt = moment(start_dt, dateFormat);
        end_dt = moment(end_dt, dateFormat);
        dates_arr.push(start_dt);
        dates_arr.push(end_dt);

        //console.log(dates_arr);
        ///////////////////////
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


        /////////////////
        this.props.form.setFieldsValue({ dateTime: dates_arr });//imp to set datepicker range input value with momemt type dates array
        this.setState({ dt_range_values: dates_arr_str }); //imp to set state wih array string not moment array

        this.setState({ //imp to set it to false default when  dialogue box opens 
          checked: true,
        });

        this.props.form.setFieldsValue({ status: true });//imp to set with empty fields while adding a new schedule waoww great to set it by default imppp
        //this.props.form.setFieldsValue({ time: moment(time, 'HH:mm:ss')});//set to current time imp to set with empty fields while adding a new schedule wao great working fine level
        //this.props.form.setFieldsValue({ time: null}); //new version to set it to null
        this.props.form.setFieldsValue({ time: moment(obj.start_datetime.split(' ')[1], 'HH:mm:ss') }); //new version to set moment type time
        ////////////////////

        /* new functionality for obis fetching when dailogue box opens for edit */

        //new fun///
          this.setState({
            obis_component_def_chk: 'open-edit-dailogue',
          });
        ///////////

      
        this.fetchedobisData(rowkey);
        //if(status_res_obis_fetching){}



        /* new functionality for obis fetching */




        /* temp_obj.push({
           key: rowkey,
           device_id: obj.device_id,
           interval_min: obj.interval_min,
           start_datetime: obj.start_datetime,
           end_datetime: obj.end_datetime,
          
 
         });*/

        //res_final_data.splice(i, 1, temp_obj );


      }//end of inner if 


      ///

      /* data.push({
         key: i+1,
         device_id: obj.device_id,
         interval_min: obj.interval_min,
         start_datetime: obj.start_datetime,
         end_datetime: obj.end_datetime,
        

       });*/

    } //end of for loop


    //////////////////

    //this.setState({ data : res_final_data });
    //* new functionality  /////////////////////////////////////*/


    this.setState({ modal2Visible, edit_row_key: rowkey });//VVVIMP to set
    //$("#interval_id").val(12);



  }

  setModal2UnVisible(modal2Visible) {
    console.log("close");
   

    //$(".single-search").show();

    //new fun///  should sets before make model unvisible imppp
    this.setState({
     obis_component_def_chk: 'close',
    });
    ///////////

    this.setState({ modal2Visible });

    $(".ant-select-dropdown").css("display", 'unset !important');
    $(".ant-select-dropdown").addClass("single-search");
    $(".analysis-raw-data-obisregisters").removeClass("single-search");//imp for obis dropdown

  }


  submitFormDataAddNewSchedule = async (form_data) => {
    const { data, offset } = this.state;
    const { deviceId } = this.props;

    var req_data = {};

    /////////////// validations//////////////////
    /////////////////////////////////

    if (form_data) {

      const res = await PostEditDeviceSchedulesFormData(form_data);
      if (res.fail) {
        console.log('PostAddNewDeviceScheduledFormData RESPONSE FAILED -> ', res);
        this.setState({ error: true });
        this.error_post_form_data();

      }//end of if
      else {
        console.log(res); //correct data 
        console.log(res.post_add_new_device_scheduled_data_response); //correct data
        console.log(res.post_add_new_device_scheduled_data_response_schedule_id); //correct data
        if (res.post_add_new_device_scheduled_data_response == true) { 

          this.setState({ add_new_schedule_id_response: res.post_add_new_device_scheduled_data_response_schedule_id });  //vimp to set new schedule id from api response
          
          this.success_form_submit_add_new_schedule(); 
          
          
          return true;
         }
        else if (res.post_add_new_device_scheduled_data_response == false) { this.failure_form_submit(); return false; }
        //if (res.length == 0) { this.success(); }//in case of not data in response
        //this.setState({ fetch_loading_chk: false });

        ////////////////////////////////////////
        //NEW functionality
        ////////////////////////////////////////

      }//end of else

    }//end of first if

  };



  submitFormData = async (form_data) => {
    const { data, offset } = this.state;
    const { deviceId } = this.props;

    var req_data = {};

    /////////////// validations//////////////////
    /////////////////////////////////

    if (form_data) {

      const res = await PostEditDeviceSchedulesFormData(form_data);
      if (res.fail) {
        console.log('PostEditDeviceSchedulesFormData RESPONSE FAILED -> ', res);
        this.setState({ error: true });
        this.error_post_form_data();

      }//end of if
      else {
        console.log(res); //correct data 
        console.log(res.post_add_new_device_scheduled_data_response); //correct data
        if (res.post_add_new_device_scheduled_data_response == true) { this.success_form_submit(); return true; }
        else if (res.post_add_new_device_scheduled_data_response == false) { this.failure_form_submit(); return false; }
        //if (res.length == 0) { this.success(); }//in case of not data in response
        //this.setState({ fetch_loading_chk: false });

        ////////////////////////////////////////
        //NEW functionality

        ////////////////////////////////////////


      }//end of else


    }//end of first if


  };


  fetchedobisData = async (sch_id) => {
    const { data, offset } = this.state;
    const { deviceId } = this.props;

    console.log(sch_id);
    var emp_arr=[];

    //var temp_commds_data = [];
    //temp_commds_data.push("Total Import Active Energy|1.8.0");//great works

     /*var temp_commds_data = ["Total Import Active Energy", "Current Bypass, Threshold (A)", "Current Bypass, Delay (s)",
     "Under Voltage Limit, Delay (s)", "Under Voltage Limit, Threshold (V)", "Relay Control Mode", 
     "Over Voltage Limit, Delay (s)", "Over Voltage Limit, Threshold (V)", "Over Current Limit, Delay (s)", "Over Current Limit, Threshold (A)"];*/
    


    /////////////// validations//////////////////
    /////////////////////////////////

    if (sch_id != '') {

      //this.setState({ obis_commands_data: temp_commds_data }); return true;


    
      

      const res = await GetDeviceScheduleCommandsData(sch_id);
      if (res.fail) {
        console.log('GetDeviceScheduleCommandsData RESPONSE FAILED -> ', res);
        this.setState({ error: true });
        this.error_get_device_schedule_commands_data();

      }//end of if
      else {
        console.log(res); //correct data 
        console.log(res.titles ); //NOT DEFINED  data
        if (res.titles.length > 0) { //this.success_get_obis_commands(); 
          this.setState({ obis_commands_data: res.titles }); 
          this.handleobisstatus(res.titles);   //vimp to call it here
         }
        else if (res.titles.length == 0) { //this.failure_get_obis_commands(); 
          this.setState({ obis_commands_data: [] }); //vimpp keep it mind
          this.handleobisstatus(emp_arr);   //vimp to call it here
           }
        //if (res.length == 0) { this.success(); }//in case of not data in response
        //this.setState({ fetch_loading_chk: false });

        ////////////////////////////////////////
        //NEW functionality

        ////////////////////////////////////////


      }//end of else

      


    }//end of first if


  };






  getapidata = async (chk) => {
    const { data, offset } = this.state;
    const { deviceId } = this.props;

    var req_data = {};

    //console.log(deviceId);

    /*if (chk === true) {//when coming from handlescrool
      var postdata_cpy = {};
      postdata_cpy = postdatareq;
      postdata_cpy['offset'] = offset;
      postdata_cpy['limit_param'] = SEARCH_LIMIT_CUSTOM;
      postdatareq = postdata_cpy;

    }*/
    if (chk === false) {//when coming from fetch button click 
      this.setState({
        offset: 0,
      });

    }

    /////////////// validations//////////////////

    if (deviceId == '') { this.warning(); this.setState({ fetch_loading_chk: false }); }

    /////////////////////////////////

    if (deviceId != '') {

      const res = await GetDeviceSchedulesModelData(deviceId, offset, SEARCH_LIMIT_CUSTOM);
      if (res.fail) {
        console.log('GetDeviceSchedulesModelData  RESPONSE FAILED -> ', res);
        this.setState({ error: true });
        this.error();

      }//end of if
      else {
        console.log(res); //correct data 
        console.log(res.data);//not correct
        if (res.length == 0) { this.success(); }//in case of not data in response
        this.setState({ fetch_loading_chk: false });

        ////////////////////////////////////////
        //NEW functionality

        ////////////////////////////////////////

        var res_data = res;

        this.setState({
          rs: res_data,
        });

        data.length = 0;
        var obj = '';

        for (let i = 0; i < res_data.length; i++) {

          obj = res_data[i];

          data.push({
            key: obj.id, //prev is i+1 //now actually obj.id is schedule id i.e primary key and storing it in a key
            schedule_id: obj.id,  //prev is  obj.device_id  
            interval_min: obj.interval_min,
            start_datetime: obj.start_datetime.split('T').join(' '),
            end_datetime: obj.end_datetime.split('T').join(' '),

          });
        }

        this.setState({ data });

      }//end of else


    }//end of first if


  };



  fetchdDeviceSchedulesData(e) {
    const { data } = this.state;
    //const { postrawdata } = this.props;

    this.setState({ fetch_loading_chk: true });

    this.getapidata(false); // imppp false is given to separate it from handle scrool call while scroliing when large data is received

  }


  addNewDeviceScheduledData(e) {
    const { data } = this.state;
    const { deviceId } = this.props;

    //console.log("add");
    //this.setState({ fetch_loading_chk: true });
    if (deviceId) {
      this.setState({ add_new_schedule_chk: true }); //imp to set and useful in form submit action

      this.setModal2Visible_ADD_New_Schedule();

    }
    else {
      this.warning_add_new_schedule();
      return 1;
    }



  }



  componentDidMount() {
    const { data } = this.state;
    this.setState({ token: localStorage.getItem('token') });

    //new func/////
    this.updateDimensions();
    //////////////

    //new tweaks
    window.addEventListener("resize", this.updateDimensions);
    //////////////

  }


  handleobisstatus(obis) {

    console.log(obis);
    var temp = [];
    for (let i = 0; i < obis.length; i++) {

      var parsedstr = obis[i].split('|');
      //console.log(parsedstr[1]);
      temp.push(parsedstr[1]);

    }
    this.setState({ obis_val: temp });  //vvimp to set it here

    //console.log(temp);//actual array
  };



  updateDimensions() {
    console.log("resize");

    if (window.innerWidth < 460) {
      this.setState({ margin_style: 15, margin_style_right: 0 });
    }
    else{
      this.setState({ margin_style: 0, margin_style_right: 10 });
    }

    //this.setState({width: $(window).width(), height: $(window).height()});

  }


  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  } 


  disabledDate(current) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    
    today = yyyy + '-' + mm + '-' + dd;
    let customDate = today;
    return current && current < moment(customDate, dateFormat);
  }


  /*cancel = () => {
    this.setState({ editingKey: '' });
  };*/

  /*save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }*/

  /*edit(key) {
    this.setState({ editingKey: key });
  }*/

  render() {

    const { add_new_schedule_chk, obis_component_def_chk, margin_style, margin_style_right, obis_commands_data } = this.state;
    const { deviceId } = this.props;

    const components = {
      body: {
        //cell: EditableCell,
      },
    };

    /*const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          //inputType: col.dataIndex === 'age' ? 'number' : 'text',
          //dataIndex: col.dataIndex,
          title: col.title,
          //editing: this.isEditing(record),
        }),
      };
    });*/

    const { getFieldDecorator } = this.props.form;
    //console.log(add_new_schedule_chk);

    //$("#intervalId").val(12);



    return (
      /*<div> 
     <Modal
     title="Vertically centered modal dialog"
     centered
     visible={this.state.modal2Visible}
     onOk={() => this.setModal2Visible(false)}
     onCancel={() => this.setModal2Visible(false)}
     >
     <p>some contents...</p>
     <p>some contents...</p>
     <p>some contents...</p>

     </Modal>
 
       <Table
         //components={components}
         bordered
         dataSource={this.state.data}
         columns={this.columns}
         rowClassName="editable-row"
         pagination={false}
        
       />

        </div>
        <Input.TextArea rows={4} placeholder="please enter url description" />

        */


      <div className="pane equal" style={{ height: '400px !important' }}>
        <Modal
          title={add_new_schedule_chk ? "Add New Device Scheduled Data" : "Edit Device Scheduled Data"}
          centered
          visible={this.state.modal2Visible}
          //closable={true}
          footer={null}
          width={650}
          bodyStyle={{ height: '650px', }}
          //onOk={() => this.setModal2Visible(false)}  //no effect on submit button
          onCancel={() => this.setModal2UnVisible(false)}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={add_new_schedule_chk ? this.handleSubmitNewSchedule : this.handleSubmit} >

            {/*<Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Owner">
                    {getFieldDecorator('owner', {
                        rules: [{ required: true, message: 'Please select an owner' }],
                    })(
                        <Select placeholder="Please select an owner">
                        <Option value="xiao">Xiaoxiao Fu</Option>
                        <Option value="mao">Maomao Zhou</Option>
                        </Select>
                    )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Type">
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: 'Please choose the type' }],
                    })(
                        <Select placeholder="Please choose the type">
                        <Option value="private">Private</Option>
                        <Option value="public">Public</Option>
                        </Select>
                    )}
                    </Form.Item>
                </Col>
                </Row>*/}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="DateTime&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Start Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;End Time)">
                  {getFieldDecorator('dateTime', {
                    rules: [{ required: true, message: 'Please choose the dateTime' }],
                  })(
                    <DatePicker.RangePicker  disabledDate={this.disabledDate} 
                      //value={this.state.dt_range_value}
                      onChange={this.onChange_date_range} format={dateFormat}
                      style={{ width: '80%' }}
                      getPopupContainer={trigger => trigger.parentNode}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>

              <Col span={12}>
                <Form.Item label="Obis_Registers" >

                  <ObisSelecterComponentScheduling heading="Obis Registers" obis_component_chk={obis_component_def_chk} 
                    device_schedule_commands_obis_data={obis_commands_data}
                    device_id={deviceId}
                    //onHeaderClick_adv_cancel={this.handleSort_adv_cancel}
                    //onHeaderClick={this.handleSort}
                    onHandleObisStatus={this.handleobisstatus}
                  />


                </Form.Item>
              </Col>

              <Col span={12} >
                <Form.Item label="Time">
                  {getFieldDecorator('time', {
                    rules: [{ required: true, message: 'Please enter time' }],
                  })(
                    <TimePicker minuteStep={10} secondStep={10} />
                  )}
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col span={12} offset={12}>
                <Form.Item label="Interval_min">
                  {getFieldDecorator('interval_min', {
                    rules: [{ required: true, message: 'Please enter interval_min in numbers' }],
                  })(<Input id="intervalId" type="number" placeholder="Please enter interval_min" />)}
                </Form.Item>

              </Col>
            </Row>

            <Row gutter={16}>
              
              <Col span={12} offset={12}>
                <Form.Item label="Status">
                  {getFieldDecorator('status', {
                    rules: [
                      {
                        required: true,
                        message: 'please check the status',
                      },
                    ],
                  })(<Checkbox checked={this.state.checked} onChange={this.onChange_checkbox}>Active/Inactive</Checkbox>)}
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
                </Button>
              <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </div>

          </Form>



        </Modal>


        {/*<Drawer
            title="Create a new account"
            width={500}
            
            //onClose={this.onClose}
            //visible={this.state.visible}
            placement={"top"}
            style={{ height: '500px' }}
            >
            <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please enter user name' }],
                    })(<Input placeholder="Please enter user name" />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Url">
                    {getFieldDecorator('url', {
                        rules: [{ required: true, message: 'Please enter url' }],
                    })(
                        <Input
                        style={{ width: '100%' }}
                        addonBefore="http://"
                        addonAfter=".com"
                        placeholder="Please enter url"
                        />
                    )}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Owner">
                    {getFieldDecorator('owner', {
                        rules: [{ required: true, message: 'Please select an owner' }],
                    })(
                        <Select placeholder="Please select an owner">
                        <Option value="xiao">Xiaoxiao Fu</Option>
                        <Option value="mao">Maomao Zhou</Option>
                        </Select>
                    )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Type">
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: 'Please choose the type' }],
                    })(
                        <Select placeholder="Please choose the type">
                        <Option value="private">Private</Option>
                        <Option value="public">Public</Option>
                        </Select>
                    )}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Approver">
                    {getFieldDecorator('approver', {
                        rules: [{ required: true, message: 'Please choose the approver' }],
                    })(
                        <Select placeholder="Please choose the approver">
                        <Option value="jack">Jack Ma</Option>
                        <Option value="tom">Tom Liu</Option>
                        </Select>
                    )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="DateTime">
                    {getFieldDecorator('dateTime', {
                        rules: [{ required: true, message: 'Please choose the dateTime' }],
                    })(
                        <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        getPopupContainer={trigger => trigger.parentNode}
                        />
                    )}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Description">
                    {getFieldDecorator('description', {
                        rules: [
                        {
                            required: true,
                            message: 'please enter url description',
                        },
                        ],
                    })(<Input.TextArea rows={4} placeholder="please enter url description" />)}
                    </Form.Item>
                </Col>
                </Row>
            </Form>
            <div
                style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                }}
            >
                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
                </Button>
                <Button onClick={this.onClose} type="primary">
                Submit
                </Button>
            </div>
            </Drawer>
            */}



        <h2 style={{ marginTop: '0px' }}><span >SCHEDULES LIST</span></h2>
        <div className="row">
          <div className="col-xs-12  col-sm-12 col-md-12  col-lg-12">
            <button
              disabled={false}
              className="btn btn-success"
              style={{ float: 'right', marginBottom: '0px' }}
              onClick={() => this.fetchdDeviceSchedulesData()}

            >Fetch schedules list
          </button>
     
            <button
              disabled={false}
              className="btn btn-success"
              style={{ float: 'right', marginBottom: '0px', marginRight: `${margin_style_right}px`, marginTop: `${margin_style}px`  }}
              onClick={() => this.addNewDeviceScheduledData()}

            >Add New Schedule
          </button>

          </div>
        </div>


        {/* this.fetchdDeviceSchedulesData()  */}
        {/*(scroll_loading_chk && offset == Math.floor(rs.length / SEARCH_LIMIT_CUSTOM)) || (fetch_loading_chk === true) ? <div style={{ textAlign: 'center' }}>
            <Spin indicator={antIcon} style={{ alignContent: 'center' }} /> </div> : ''  */}

        <div className="row">
          <div className="col-sm-12">
            <div className="pane equal" onScroll={this.handleScroll} style={{ padding: '15px 15px 0px', marginBottom: '0px' }}>
              <Table
                //components={components}
                locale={{ emptyText: 'PLEASE SELECT THE DEVICE ID TO GET SCHEDULES LIST' }}
                bordered
                dataSource={this.state.data}
                columns={this.columns}
                rowClassName="editable-row"
                pagination={false}
                scroll={{ x: 1000, y: 250 }}

              />


            </div>
          </div>
        </div>
      </div>

    );
  }
}


const WrapperEditableFormTable = Form.create()(RemotingSchedulingTabElement);

export default WrapperEditableFormTable;

