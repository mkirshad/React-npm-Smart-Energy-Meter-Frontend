import React from "react";

class YearPickerComponent extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      result: '',
      value: ''
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange = (event) => {
    this.setState({
      value: event.target.value
    });


    this.props.onHandlecurrentyearstatus(event.target.value);

  }

  componentDidMount() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy;

    this.setState({
      value: today
    });
    this.props.onHandlecurrentyearstatus(today);


  }



  render() {
    const { result } = this.state;
    const { hgt, heading, type } = this.props;

    //console.log(result);


    return (

      <div>
        <div id="" style={{ margin: '0 5px 20px 5px', padding: '15px', backgroundColor: '#fff', height: '130px', paddingTop: '0px' }}>
          <h2><span className="pane-h2">Calender (Select Year)</span></h2>

          <select onChange={this.handleSelectChange} style={{ width: '100%' }} value={this.state.value}  >
            <option disabled >Select Year</option>
            <option value="2010">2010</option>
            <option value="2011">2011</option>
            <option value="2012">2012</option>
            <option value="2013">2013</option>
            <option value="2014">2014</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>

          </select>

        </div>
      </div>


    );
  }
}

export default YearPickerComponent;