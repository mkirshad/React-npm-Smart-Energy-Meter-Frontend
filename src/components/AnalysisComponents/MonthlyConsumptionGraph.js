import React from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import CanvasJSReact from './canvasjs.react'
import { PostAnalysisHourlyConsumptionData, getGraphData, PostAnalysisMonthlyConsumptionData } from '../../API/readings';
import { SEARCH_LIMIT, API_ENDPOINT, ENDPOINTS } from '../../API/config';
import { Table, Alert, message, Icon, Spin, Input, Button } from 'antd';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class MonthlyConsumptionGraph extends React.Component {


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
            msns_arr_cpy: [],
            curr_year_cpy: ''


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
        const { msns_arr_cpy, curr_year_cpy } = this.state;
        let { history, postconsumptiondata } = this.props;
        var mm = '';

        console.log(e.dataPoint.x);
        console.log(e.dataPoint.y);

        if (e.dataPoint.x < 10) {
            mm = '0' + e.dataPoint.x;
        }

        /*history.push({ //done waoow in history .push passing querystring parameters is not correct 
            pathname: '/analysis-daily-consumption',
            //search: 'name=jhon&amp;age=24',
            state: { req_month: (curr_year_cpy +"/"+ (mm).toString() ), req_msns: msns_arr_cpy, status_chk: true }
           });*/
        //${postconsumptiondata['msns_titles']}

        window.open(`/analysis-daily-consumption?req_month=${curr_year_cpy + "/" + (mm).toString()}&req_msns=${msns_arr_cpy}&req_msns_titles=${postconsumptiondata['msns_titles']}`);

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
        var selctyear = postdatareq['selected_year'];
        //console.log(postdatareq['device_id']);
        //console.log(postdatareq['selected_year']);

        this.setState({ msns_arr_cpy: postdatareq['device_id'] });//imppp to save the variable 
        this.setState({ curr_year_cpy: postdatareq['selected_year'] });//imppp to save the variable 


        //prev version perfectly working and tested if (postdatareq['device_id'] == '' || isNaN(postdatareq['device_id'])) { console.log("inside"); this.warning(); this.setState({ fetch_loading_chk: false }); }
        //now below conditions are very inportant to avooid exceptions
        if (postdatareq['device_id'].length == 0 || postdatareq['selected_year'] == '' || isNaN(postdatareq['selected_year'])) { console.log("inside"); this.warning(); this.setState({ fetch_loading_chk: false }); }

        /////////////////////////////////
        //prev version perfectly working and tested   if (postdatareq['device_id'] !== '')
        if (postdatareq['device_id'].length > 0 && postdatareq['selected_year'] != '' && !isNaN(postdatareq['selected_year'])) {

            req_data['monthly-consumption-data'] = postdatareq;

            const res = await PostAnalysisMonthlyConsumptionData(req_data);
            if (res.fail) {
                console.log('PostAllMsnsIds RESPONSE FAILED -> ', res);
                this.setState({ error: true });
                //this.warning();


            }//end of if
            else {
                //console.log(res.monthly_consumption_data_response);
                this.setState({ fetch_loading_chk: false });
                if (res.monthly_consumption_data_response == '') { this.success(); }//in case of not data in response

                else {
                    //NEW functionality
                    //this.setState({ filters_chk: true });
                    ///////////////////////////////////////////
                    for (var i = 0; i < res.monthly_consumption_data_response.length; i++) {

                        var obj = res.monthly_consumption_data_response[i];
                        /*----storing consumtios for finding maximum consumption---*/
                        if (obj[1] != null) { //imp for null consumptions values
                            consumption_cpy.push(parseFloat(obj[1], 10));
                        }
                        /*----storing consumtios for finding maximum consumption---*/
                        if (obj[1] != null) { //imp for null consumptions values


                            let split_val = obj[0].split('-');
                            let x_axis_val = parseInt((split_val[1]), 10);

                            points.push({
                                x: x_axis_val,
                                y: parseFloat(obj[1], 10)
                            });

                        }//end of second if

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

                    for (var i = 0; i < res.monthly_consumption_data_response.length; i++) {

                        var obj = res.monthly_consumption_data_response[i];

                        if (obj[1] != null) {  //imp for null consumptions values

                            let split_val = obj[0].split('-');
                            let x_axis_val = parseInt((split_val[1]), 10);


                            points_average.push({
                                x: x_axis_val,
                                y: parseFloat(avg, 10)
                            });

                            points_max_demand.push({
                                x: parseInt(x_axis_val, 10),
                                y: parseFloat(Math.max(...consumption_cpy), 10)
                            });

                        }//end of second if


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
                        text: "Monthly Consumptions" + " (Maximum Demand " + msg_str + ")",
                    },
                    axisX: {
                        minimum: 1,
                        maximum: 12,
                        title: "(Months)",
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
                        toolTipContent: "Month: {x} <br/> Consumption: {y}", 
                    },
                    {
                        //dataPoints: points,
                        showInLegend: true,//likewise  title
                        legendText: "Avarage Demand " + parseFloat(avg, 10),
                        legendMarkerType: "square",
                        //name: "New Visitors",
                        //cursor: "pointer",
                        click: this.visitorsChartDrilldownHandler,
                        type: "spline",
                        dataPoints: points_average,
                    },
                    {
                        //showInLegend: true,//likewise  title
                        //legendText: "Maximum Demand "+ Math.max(...consumption_cpy),
                        //legendMarkerType: "square",
                        //cursor: "pointer",
                        //type: "spline",
                        //dataPoints: points_max_demand,

                    }
                    ]


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

            //////////////////////////////////////////////////////
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
                    text: "Monthly Consumptions"
                },
                axisX: {
                    title: "(Months)",
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

                <h2 style={{ marginTop: '15px' }}><span >Analysis - Monthly Consumption Graph</span></h2>
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


export default withRouter(MonthlyConsumptionGraph);

