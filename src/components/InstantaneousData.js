import React from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { connect } from 'react-redux';
import Pagination from "react-js-pagination";

import { getInstantaneousData } from '../API/readings';

class InstantaneousData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: 'id', field: 'id', editable: true },
        { headerName: 'msn', field: 'msn', editable: true },
        { headerName: 'global_device_id', field: 'global_device_id', editable: true },
        { headerName: 'meter_datetime', field: 'meter_datetime', editable: true },
        { headerName: 'signal_strength', field: 'signal_strength', editable: true },
        { headerName: 'current_tarrif_register', field: 'current_tarrif_register', editable: true },
        { headerName: 'current_phase_a', field: 'current_phase_a', editable: true },
        { headerName: 'current_phase_b', field: 'current_phase_b', editable: true },
        { headerName: 'current_phase_c', field: 'current_phase_c', editable: true },
        { headerName: 'voltage_phase_a', field: 'voltage_phase_a', editable: true },
        { headerName: 'voltage_phase_b', field: 'voltage_phase_b', editable: true },
        { headerName: 'voltage_phase_c', field: 'voltage_phase_c', editable: true },
      ],
      rowData: [],
      activePage: 1,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  async componentDidMount() {
    const res = await getInstantaneousData();
    if (res.fail) {
      console.log('Failed instantaneous_data call -> ', res);
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
        <br/><br/><br/>
        <h1>InstantaneousData view</h1>

        <AgGridReact
          enableFilter={true}
          enableSorting={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}>
        </AgGridReact>

        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={5}
          totalItemsCount={20}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    token: state.token
  }
};

export default connect(mapStateToProps)(InstantaneousData);














