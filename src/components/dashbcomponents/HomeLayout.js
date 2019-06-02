import React from 'react';
import { NavLink } from 'react-router-dom';
import { getGraphData } from '../../API/readings';
import $ from "jquery";


class HomeLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            graph_data_1: null,
            graph_data_2: null,
            graph_data_3: null,
            meters: null,
            terminals: null,
            customers: null,
            menu: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const instance = this;

        const res = await getGraphData();
        if (res.fail) {
            console.log('DASHBOARD DATA FETCH FAILED -> ', res);
        } else {
            instance.setState({
                graph_data_1: res.data_1,
                graph_data_2: res.data_2,
                graph_data_3: res.data_3,
                terminals: res.terminals,
                customers: res.customers,
                meters: res.meters,
            });

            /*$.plot(
                $("#monthly-stats"),
                [{ data: instance.state.graph_data_1 }, { data: instance.state.graph_data_2 }, { data: instance.state.graph_data_3 }],
                {
                    lines: {
                        show: true,
                        lineWidth: 0,
                        fill: true
                    },
                    points: {
                        show: false,
                        radius: 3,
                    },
                    shadowSize: 0,
                    grid: {
                        clickable: true,
                        hoverable: true,
                        borderWidth: 1,
                        borderColor: "#f6f6f6",
                        tickColor: "#f6f6f6",
                    },
                    colors: ["#d2527f", "#19B5FE", "#e26a6a"],
                    tooltip: true,
                    tooltipOpts: {
                        content: "%x = %y",
                        backgroundColor: "#000000",
                    },
                }
            );
            */
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onAuth(values.userName, values.password);
            }
        });
    };

    render() {
        if (localStorage.getItem('token') === null) {
            window.location = '/login';
        }
        return (
            <div id="content">
                <div className="container-fluid">
                    <div className="row" style={{ padding: '5px 15px', marginRight: '0px' }}>
                        <div className="col-md-9" style={{ height: '450px', backgroundColor: '#fff' }}>
                            <div className="grid-stack-item-content">
                                <div className="widget widget-monthly-statistics">
                                    <div className="widget-content container-fluid">
                                        <div className="row text-center">
                                            <div className="col-xs-4">
                                                <div style={{ display: 'block', width: '100%' }}>
                                                    <h4 style={{ fontSize: '21px' }}>Collection Performance</h4>
                                                    <h5 style={{ fontSize: '21px' }}>67%</h5>
                                                    <span className="label label-success"><i className="fa fa-arrow-circle-up"></i> 100.00%</span><br />
                                                    <small>on last month</small>
                                                </div>{/* fit-text */}
                                            </div>{/* col */}
                                            <div className="col-xs-4">
                                                <div style={{ display: 'block', width: '100%' }}>
                                                    <h4 style={{ fontSize: '21px' }}>Average Online Rate</h4>
                                                    <h5 style={{ fontSize: '21px' }}>$1655</h5>
                                                    <span className="label label-success"><i className="fa fa-arrow-circle-up"></i> 70.00%</span><br />
                                                    <small>on last month</small>
                                                </div>{/* fit-text */}
                                            </div>{/* col */}
                                            <div className="col-xs-4">
                                                <div style={{ display: 'block', width: '100%' }}>
                                                    <h4 style={{ fontSize: '21px' }}>Profit</h4>
                                                    <h5 style={{ fontSize: '21px' }}>$5075</h5>
                                                    <span className="label label-danger"><i className="fa fa-arrow-circle-down"></i> 1.0%</span><br />
                                                    <small>on last month</small>
                                                </div>{/* fit-text */}
                                            </div>{/* col */}
                                        </div>{/* row */}
                                        <div className="flot-chart monthly-statistics-chart" style={{ left: '-10px' }}>
                                            <div id="monthly-stats" className="flot line"></div>
                                        </div>{/* flot-chart */}
                                    </div>{/* widget-content */}
                                </div>{/* widget */}
                            </div>{/* grid-stack-item-content */}
                            {/* /grid-stack-item */}
                        </div> {/* /col 9  */}
                        <div className="col-md-3" style={{ height: '150px' }}>
                            <div className="grid-stack-item-content">
                                <div className="widget social-stats">
                                    <span className="drag fa"></span>
                                    <div className="widget-content">
                                        <div className="item social youtube">
                                            <span className="social-title">Number of Terminal</span>
                                            <span className="social-count">8,500<small>NEW</small></span>
                                            <span className="social-icon"><i className="fa fa-code-fork"></i></span>
                                        </div>
                                    </div>{/* widget-content */}
                                </div>{/* widget */}

                            </div>{/* grid-stack-item-content */}
                            {/* /grid-stack-item */}
                        </div>
                        <div className="col-md-3" style={{ height: '150px', top: '5px' }}>
                            <div className="grid-stack-item-content">
                                <div className="widget social-stats">
                                    <span className="drag fa"></span>
                                    <div className="widget-content">
                                        <div className="item social twitter">
                                            <span className="social-title">Number of Meter</span>
                                            <span className="social-count">153 <small>NEW</small></span>
                                            <span className="social-icon"><i className="fa fa-bar-chart"></i></span>
                                        </div>
                                    </div>{/* widget-content */}
                                </div>{/* widget */}

                            </div>{/* grid-stack-item-content */}
                            {/* /grid-stack-item */}
                        </div>
                        <div className="col-md-3" style={{ height: '150px', top: '5px' }}>
                            <div className="grid-stack-item-content">
                                <div className="widget social-stats">
                                    <span className="drag fa"></span>
                                    <div className="widget-content">
                                        <div className="item social linkedin">
                                            <span className="social-title">Number of Customer</span>
                                            <span className="social-count">250<small>NEW</small></span>
                                            <span className="social-icon"><i className="fa fa-users"></i></span>
                                        </div>
                                    </div>{/* widget-content */}
                                </div>{/* widget */}
                            </div>{/* grid-stack-item-content */}
                            {/* /grid-stack-item */}
                        </div>
                    </div>
                </div>
                <div className="container-fluid" style={{ padding: '0px 15px', marginTop: '-10px' }}>
                    <nav className="floating-nav floating-nav-dashboard">
                        <div className="f-nav-content f-nav-content-dashboard">
                            <ul>
                                <li>
                                    <NavLink to='/roles' className="nav-link" activeclassname="active">
                                        <i className="fa fa-tasks fa-2x" />
                                        <div className="fit-text">
                                            <span>Role</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/users' className="nav-link" activeclassname="active">
                                        <i className="fa fa-user fa-2x" />
                                        <div className="fit-text"><span>User</span></div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/notice-managment' className="nav-link" activeclassname="active">
                                        <i className="fa fa-bullhorn fa-2x" />
                                        <div className="fit-text"><span>Notice Management</span></div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/operating-log' className="nav-link" activeclassname="active">
                                        <i className="fa fa-crosshairs fa-2x" />
                                        <div className="fit-text"><span>Operating Log</span></div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/login-log' className="nav-link" activeclassname="active">
                                        <i className="fa fa-external-link fa-2x" />
                                        <div className="fit-text"><span>Login Log</span></div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/notice' className="nav-link" activeclassname="active">
                                        <i className="fa fa-newspaper-o fa-2x" />
                                        <div className="fit-text"><span>My Notice</span></div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/subscribe' className="nav-link" activeclassname="active">
                                        <i className="fa fa-thumbs-up fa-2x" />
                                        <div className="fit-text"><span>Subscribe</span></div>
                                    </NavLink>
                                </li>

                            </ul>
                        </div>
                    </nav>

                </div>

                <div className="container-fluid">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default HomeLayout;
