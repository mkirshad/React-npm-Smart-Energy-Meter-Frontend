import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/auth';
import InstantaneousData from "./components/InstantaneousData";

import LoginForm from "./components/LoginForm";

import DashboardLayout from './containers/dashbcontainers/DashboardLayout';
import DashboardHome from "./components/dashbcomponents/DashboardHome";
import Dashboard from "./components/dashbcomponents/pages/Dashboard";
import Users from "./components/dashbcomponents/pages/Users";
import Roles from "./components/dashbcomponents/pages/Roles";
import NoticeManagement from "./components/dashbcomponents/pages/NoticeManagement";
import OperationLog from "./components/dashbcomponents/pages/OperationLog";
import LoginLog from "./components/dashbcomponents/pages/LoginLog";
import Notice from "./components/dashbcomponents/pages/Notice";
import Subscribe from "./components/dashbcomponents/pages/Subscribe";

import EventsData from "./components/EventsData";
import BillingData from "./components/BillingData";
import MonthlyBillingData from "./components/MonthlyBillingData";
import RemotingSearch from "./components/RemotingComponents/RemotingSearch";

import RemotingReading from "./components/RemotingComponents/RemotingReading";
import Reading from "./components/RemotingComponents/pages/Reading";
import RealtimeOperating from "./components/RemotingComponents/pages/RealtimeOperating";
import Settings from "./components/RemotingComponents/pages/Settings";
import AdvancedSettings from "./components/RemotingComponents/pages/AdvancedSettings";
import Security from "./components/RemotingComponents/pages/Security";
import Terminal from "./components/RemotingComponents/pages/Terminal";
import MeterDownload from "./components/RemotingComponents/pages/MeterDownload";
import TariffUpdate from "./components/RemotingComponents/pages/TariffUpdate";
import RemotingMulti from "./components/RemotingComponents/pages/RemotingMulti";

import RawData from "./components/AnalysisComponents/pages/RawData";
import HourlyConsumption from "./components/AnalysisComponents/pages/HourlyConsumption";
import DailyConsumption from "./components/AnalysisComponents/pages/DailyConsumption";
import MonthlyConsumption from "./components/AnalysisComponents/pages/MonthlyConsumption";
import TestReport  from "./components/AnalysisComponents/pages/TestReport";




class App extends Component {
  constructor(props) {
    super(props);
    this.renderWithLayout = this.renderWithLayout.bind(this);
  }

  renderWithLayout = (Component) => (
    <DashboardLayout {...this.props}>
      <Component/>
    </DashboardLayout>
  );

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter basename="/">
          <Switch>
            <Route exact path='/' render={() => this.renderWithLayout(LoginForm)}/>
            <Route exact path='/login' render={() => this.renderWithLayout(LoginForm)}/>
            <Route exact path='/Events' render={() => this.renderWithLayout(EventsData)}/>
            <Route exact path='/Instantaneous' render={() => this.renderWithLayout(InstantaneousData)}/>
            <Route exact path='/Billing' render={() => this.renderWithLayout(BillingData)}/>
            <Route exact path='/MonthlyBilling' render={() => this.renderWithLayout(MonthlyBillingData)}/>

            <Route path='/dashboard' render={() => this.renderWithLayout(Dashboard)}/>
            <Route path='/roles' render={() => this.renderWithLayout(Roles)}/>
            <Route path='/users' render={() => this.renderWithLayout(Users)}/>
            <Route path='/notice-management' render={() => this.renderWithLayout(NoticeManagement)}/>
            <Route path='/operation-log' render={() => this.renderWithLayout(OperationLog)}/>
            <Route path='/login-log' render={() => this.renderWithLayout(LoginLog)}/>
            <Route path='/notice' render={() => this.renderWithLayout(Notice)}/>
            <Route path='/subscribe' render={() => this.renderWithLayout(Subscribe)}/>

            <Route path='/reading' render={() => this.renderWithLayout(RemotingReading)}/>
            <Route path='/remoting-reading' render={() => this.renderWithLayout(Reading)}/>
            <Route path='/remoting-realtime-operating' render={() => this.renderWithLayout(Reading)}/>
            <Route path='/remoting-settings' render={() => this.renderWithLayout(Reading)}/> 
            <Route path='/remoting-scheduling' render={() => this.renderWithLayout(Reading)}/>
            <Route path='/remoting-advanced-settings' render={() => this.renderWithLayout(AdvancedSettings)}/>
            <Route path='/remoting-security' render={() => this.renderWithLayout(Security)}/>
            <Route path='/remoting-terminal' render={() => this.renderWithLayout(Terminal)}/>
            <Route path='/remoting-meter-download' render={() => this.renderWithLayout(MeterDownload)}/>
            <Route path='/remoting-tariff-update' render={() => this.renderWithLayout(TariffUpdate)}/>
            <Route path='/remoting-multi' render={() => this.renderWithLayout(RemotingMulti)}/>

            
            <Route path='/analysis_test_report(/:qstr)' render={() => this.renderWithLayout(TestReport)}/>
            <Route path='/analysis_test_report' render={() => this.renderWithLayout(TestReport)}/>
            <Route path='/analysis-raw-data' render={() => this.renderWithLayout(RawData)}/>
            <Route path='/analysis-hourly-consumption' render={() => this.renderWithLayout(HourlyConsumption)}/>
            <Route path='/analysis-daily-consumption' render={() => this.renderWithLayout(DailyConsumption)}/>
            <Route path='/analysis-daily-consumption(/:a) ' render={() => this.renderWithLayout(DailyConsumption)}/>
            <Route path='/analysis-monthly-consumption' render={() => this.renderWithLayout(MonthlyConsumption)}/>
            
            
            
            {/*<Route exact path='/Remoting-Reading' render={() => this.renderWithLayout(RemotingReading)}/>*/}
            <Route to='/search' render={() => this.renderWithLayout(RemotingSearch)}/>
            <Route exact path='/home' render={() => this.renderWithLayout(DashboardHome)}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
