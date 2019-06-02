import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { getEventData } from '../API/readings';

class EventsData extends React.Component {

  state = {
    columnDefs: [
      { headerName: 'id', field: 'id', editable: true },
      { headerName: 'msn', field: 'msn', editable: true },
      { headerName: 'global_device_id', field: 'global_device_id', editable: true },
      { headerName: 'meter_datetime', field: 'meter_datetime', editable: true },
      { headerName: 'event_code', field: 'event_code', editable: true },
      { headerName: 'event_description', field: 'event_description', editable: true },
      { headerName: 'mdc_read_datetime', field: 'mdc_read_datetime', editable: true },
    ],
    rowData: [],
    s_cookie: null
  };

  async componentDidMount() {
    const res = await getEventData();
    if (res.fail) {
      console.log('CANT FETCH EVENTS -> ', res);
    } else {
      this.setState({ rowData: res });
    }
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{ paddingLeft: '50px', height: '200px', width: '600px' }}
      >
        <h1>Events view</h1>
        <Menu />

        <AgGridReact
          pagination={true}
          enableFilter={true}
          enableSorting={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}>
        </AgGridReact>
      </div>
    );
  }

}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  }
};

export default connect(null, mapDispatchToProps)(EventsData);














