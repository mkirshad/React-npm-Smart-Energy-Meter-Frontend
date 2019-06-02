import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import CanvasJSReact from './canvasjs.react'
import { PostAnalysisHourlyConsumptionData, getGraphData } from '../../API/readings';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import { Table, Alert, message, Icon, Spin, Input, Button } from 'antd';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



class HourlyConsumptionGraph extends React.Component {


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
            x_axis_hour_val: '',
            filters_chk: '',
            searchText: '',
            options: [],
            dataPoints_rec: [],


        };

        this.handleScroll = this.handleScroll.bind(this);
        this.getapidata = this.getapidata.bind(this);
        this.visitorsChartDrilldownHandler = this.visitorsChartDrilldownHandler.bind(this);

    }


    warning = () => {
        message.warning('Please Select all the Required filters.', 6);
    };

    success = () => {
        message.success('No data found for selected filters.', 6);
    };


    handleScroll = (e) => {

    }


    visitorsChartDrilldownHandler(e) {
        let { history } = this.props;
        console.log(e.dataPoint.x);
        console.log(e.dataPoint.y);

        /*history.push({ //done waoow
            pathname: '/analysis-raw-data',
            search: 'name=jhon&amp;age=24',
            state: { detail: "123" }
           });*/


        /*return (
            <Redirect to="/analysis-raw-data" />
           );not working */



    }

    getapidata = async (postdatareq, chk) => {
        const { activeGroup, data, offset } = this.state;
        var temp_options = '';
        var req_data = {};
        var points = [];
        var points_average = [];
        var points_max_demand = [];
        var consumption_cpy = [];
        let avg = undefined;

        /////////////////////////////////
        var curdt = postdatareq['curr_date'];
        //console.log(postdatareq['device_id']);
        //console.log(postdatareq['curr_date']);

        //prev version perfectly working and tested if (postdatareq['device_id'] == '' || isNaN(postdatareq['device_id'])) { console.log("inside"); this.warning(); this.setState({ fetch_loading_chk: false }); }

        if (postdatareq['device_id'].length == 0 || postdatareq['curr_date'] == '' || isNaN(postdatareq['curr_date'])) { console.log("inside"); this.warning(); this.setState({ fetch_loading_chk: false }); }

        /////////////////////////////////
        //prev version perfectly working and tested   if (postdatareq['device_id'] !== '')
        if (postdatareq['device_id'].length > 0 && postdatareq['curr_date'] != '' && !isNaN(postdatareq['curr_date'])) {

            req_data['hourly-consumption-data'] = postdatareq;

            const res = await PostAnalysisHourlyConsumptionData(req_data);
            if (res.fail) {
                console.log('PostAllMsnsIds RESPONSE FAILED -> ', res);
                this.setState({ error: true });
                //this.warning();


            }//end of if
            else {
                //console.log(res.hourly_consumption_data_response);
                this.setState({ fetch_loading_chk: false });

                if (res.hourly_consumption_data_response == '') { this.success(); }//in case of not data in response

                else {

                    //NEW functionality
                    //this.setState({ filters_chk: true });
                    ///////////////////////////////////////////
                    for (var i = 0; i < res.hourly_consumption_data_response.length; i++) {

                        var obj = res.hourly_consumption_data_response[i];
                        /*----storing consumtios for finding maximum consumption---*/
                        if (obj[1] != null) { //imp for null consumptions values
                            consumption_cpy.push(parseFloat(obj[1], 10));
                        }
                        /*----storing consumtios for finding maximum consumption---*/

                        if (obj[1] != null) { //imp for null consumptions values
                            points.push({
                                x: parseInt(obj[0], 10),
                                y: parseFloat(obj[1], 10)
                            });

                        }


                    }//end of 1st for loop

                    /*----storing consumptions for finding average consumption---*/
                    //console.log(consumption_cpy);
                    if(consumption_cpy.length > 0){  //imp check for empty array
                    let sum = consumption_cpy.reduce((previous, current) => current += previous);
                    avg = sum / consumption_cpy.length;
                    avg = avg.toFixed(4);
                    }//end of imp check for empty array
                    else if (consumption_cpy.length == 0) { this.success();  //imp message to show when empty array
                    }
                    /*----storing consumptions for finding average consumption---*/

                    for (var i = 0; i < res.hourly_consumption_data_response.length; i++) {

                        var obj = res.hourly_consumption_data_response[i];

                        if (obj[1] != null) { //imp for null consumptions values

                            points_average.push({
                                x: parseInt(obj[0], 10),
                                y: parseFloat(avg, 10)
                            });

                            points_max_demand.push({
                                x: parseInt(obj[0], 10),
                                y: parseFloat(Math.max(...consumption_cpy), 10)
                            });

                        }  //end of second if


                    }//end of 2nd for loop   

                    /*----storing consumptions for finding average consumption---*/


                }//end of inner else 

                //console.log(points);
                /*-----------*/
                var msg_str = '';
                if (consumption_cpy.length == 0) { msg_str = 'undefined' }
                else { msg_str = Math.max(...consumption_cpy) }
                /*------------*/
                /////////////////////////////////////////

                temp_options = {
                    animationEnabled: true,
                    theme: "light2",
                    title: {
                        fontSize: 18,
                        text: "Hourly Consumptions" + " (Maximum Demand " + msg_str + ")",
                    },
                    axisX: {
                        minimum: 0,
                        maximum: 23,
                        title: curdt + " (Hours)",
                        gridThickness: 1,
                        includeZero: true,
                        lineThickness: 3,
                    },
                    axisY: {
                        minimum: 0,
                        title: "Consumption",
                        gridThickness: 1,
                        includeZero: true,
                        lineThickness: 3,
                    },
                    legend: {
                        fontFamily: "calibri",
                        fontSize: 25,
                        horizontalAlign: "center", // left, center ,right 
                        verticalAlign: "top",  // top, center, bottom
                    },
                    data: [{

                        //dataPoints: points,
                        //showInLegend: true,//likewise  title
                        //legendText: "Maximum Demand "+ Math.max(...consumption_cpy),
                        //legendMarkerType: "square",
                        //name: "New Visitors",
                        cursor: "pointer",
                        click: this.visitorsChartDrilldownHandler,
                        type: "spline",
                        dataPoints: points,
                        toolTipContent: "Hour: {x} <br/> Consumption: {y}", 
                    },
                    {

                        showInLegend: true,//likewise  title
                        legendText: "Avarage Demand " + parseFloat(avg, 10),
                        legendMarkerType: "square",
                        //name: "New Visitors",
                        //click: this.visitorsChartDrilldownHandler,
                        type: "spline",
                        dataPoints: points_average,
                    },
                    {
                        //dataPoints: points,  points_max_demand
                        //showInLegend: true,//likewise  title
                        //legendText: "Maximum Demand "+ Math.max(...consumption_cpy),
                        //legendMarkerType: "square",
                        //cursor: "pointer",
                        //type: "spline",
                        //dataPoints: points_max_demand,

                    }]


                };

                this.setState({
                    options: temp_options,

                });


            }//end of else outer


        }//end of first if



    };


    async fetchAnalysisRawData(e) {
        const { activeGroup, data, postdata } = this.state;
        const { postconsumptiondata } = this.props;
        this.setState({ postdata: postconsumptiondata });
        this.setState({ fetch_loading_chk: true });
        this.getapidata(postconsumptiondata, false);

    }


    async componentDidMount() {
        const { options } = this.state;
        const { history_props_detail_chk, postconsumptiondata } = this.props;

        if (history_props_detail_chk) {  //vvvimp check to call api when props gets set
            this.setState({ postdata: postconsumptiondata });
            this.setState({ fetch_loading_chk: true });
            this.getapidata(postconsumptiondata, false);
        }

        else {

            this.setState({ token: localStorage.getItem('token') });
            const instance = this;
            var temp_options = '';
            var points = [];

            const res = await getGraphData();
            if (res.fail) {
                console.log('DASHBOARD DATA FETCH FAILED -> ', res);
            } else {
                //res.data_1
                instance.setState({
                    graph_data_1: res.data_1,

                });

                /*---------------------------*/
                var a = 1;
                var b = 2;

                /*for (var i = 0; i < res.data_1.length; i++) {
    
                    points.push({
                        x: a++,
                        y: b++
                    });
                }
                */
                temp_options = {
                    animationEnabled: true,
                    theme: "light2",
                    title: {
                        fontSize: 18,
                        text: "Hourly Consumptions"
                    },
                    axisX: {
                        title: "Hours",
                        gridThickness: 1,
                        includeZero: true,
                        lineThickness: 3,
                    },
                    axisY: {
                        title: "Consumption",
                        gridThickness: 1,
                        includeZero: true,
                        lineThickness: 3,
                    },
                    legend: {
                        fontFamily: "calibri",
                        fontSize: 25,
                    },
                    data: [{
                        //dataPoints: points,
                        showInLegend: false,//likewise  title
                        legendMarkerType: "square",
                        //name: "New Visitors",
                        cursor: "pointer",
                        click: this.visitorsChartDrilldownHandler,
                        type: "spline",
                        dataPoints: points,


                    }],
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 5,
                                source: 'auto'
                            }
                        }],

                        yAxes: [{

                            type: 'linear',
                            ticks: {

                                maxTicksLimit: 5,

                                stepSize: 2
                            }
                        }]
                    }



                };//end of temp_options


                this.setState({
                    options: temp_options,

                });


            }

        }//end of outer else 


    }




    render() {

        const { activeGroup, data, error, scroll_loading_chk, offset, rs, fetch_loading_chk } = this.state;
        const { deviceId, msn_status, getSize } = this.props;


        return (

            <div className="pane equal" style={{ height: '400px !important' }}>
                {error ? <Alert
                    message="Warning"
                    description="Please Select all the Required filters."
                    type="warning"
                    closable
                    showIcon
                /> : <span />}

                <h2 style={{ marginTop: '15px' }}><span >Analysis - Hourly Consumption Graph</span></h2>
                <button
                    disabled={false}
                    className="btn btn-success"
                    style={{ float: 'right', marginBottom: '10px' }}
                    onClick={() => this.fetchAnalysisRawData()}

                >Show Graph
                </button>

                {(fetch_loading_chk === true) ? <div style={{ textAlign: 'center' }}>
                    <Spin indicator={antIcon} style={{ alignContent: 'center' }} /> </div> : ''}

                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12 col-md-12">

                        <div className="" onScroll={this.handleScroll} style={{ margin: '0 5px 20px 5px', backgroundColor: '#fff', height: '595px', padding: '15px 15px 0px', marginBottom: '0px', }}>
                            <div className="flot-chart monthly-statistics-chart" style={{ top: '70px', height: '388px' }}>
                                <CanvasJSChart options={this.state.options}
                                /* onRef={ref => this.chart = ref} */
                                />
                            </div>{/* flot-chart */}

                        </div>
                    </div>
                </div>
            </div>


        );
    }
}


export default withRouter(HourlyConsumptionGraph);

