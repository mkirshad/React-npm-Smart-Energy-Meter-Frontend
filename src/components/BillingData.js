import React from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';

import { getBillingData } from '../API/readings';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default class BillingData extends React.Component {
  state = {
    columnDefs: [
      { headerName: 'id', field: 'id', editable: true },
      { headerName: 'msn', field: 'msn', editable: true },
      { headerName: 'global_device_id', field: 'global_device_id', editable: true },
      { headerName: 'meter_datetime', field: 'meter_datetime', editable: true },
      { headerName: 'active_energy_pos_t1', field: 'active_energy_pos_t1', editable: true },
      { headerName: 'active_energy_pos_t2', field: 'active_energy_pos_t2', editable: true },
      { headerName: 'active_energy_pos_t3', field: 'active_energy_pos_t3', editable: true },
      { headerName: 'active_energy_pos_t4', field: 'active_energy_pos_t4', editable: true },
      { headerName: 'active_energy_pos_tl', field: 'active_energy_pos_tl', editable: true },
      { headerName: 'active_energy_neg_t1', field: 'active_energy_neg_t1', editable: true },
      { headerName: 'active_energy_neg_t2', field: 'active_energy_neg_t2', editable: true },
      { headerName: 'active_energy_neg_t3', field: 'active_energy_neg_t3', editable: true },
      { headerName: 'active_energy_neg_t4', field: 'active_energy_neg_t4', editable: true },
      { headerName: 'active_energy_neg_tl', field: 'active_energy_neg_t1', editable: true },
      { headerName: 'reactive_energy_pos_t1', field: 'reactive_energy_pos_t1', editable: true },
      { headerName: 'reactive_energy_pos_t2', field: 'reactive_energy_pos_t2', editable: true },
      { headerName: 'reactive_energy_pos_t3', field: 'reactive_energy_pos_t3', editable: true },
      { headerName: 'reactive_energy_pos_t4', field: 'reactive_energy_pos_t4', editable: true },
      { headerName: 'reactive_energy_pos_tl', field: 'reactive_energy_pos_tl', editable: true },
      { headerName: 'reactive_energy_neg_t1', field: 'reactive_energy_neg_t1', editable: true },
      { headerName: 'reactive_energy_neg_t2', field: 'reactive_energy_neg_t2', editable: true },
      { headerName: 'reactive_energy_neg_t3', field: 'reactive_energy_neg_t3', editable: true },
      { headerName: 'reactive_energy_neg_t4', field: 'reactive_energy_neg_t4', editable: true },
      { headerName: 'reactive_energy_neg_tl', field: 'reactive_energy_neg_tl', editable: true },
    ],
    rowData: []
  };

  async componentDidMount() {
    const res = await getBillingData();
    if (res.fail) {
      console.log('Billing Data Fetch failed -> ', res);
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
        <br/><br/><br/><br/><br/>
        <h1>Billing view</h1>
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
