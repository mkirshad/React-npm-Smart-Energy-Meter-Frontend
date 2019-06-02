import React from 'react';







class TestReport extends React.Component {
  /*  here you can also create funtions and no need to bind in constructor  */

  constructor(props) {

    super(props);
    this.state = {
      mtr_msn: '',
      mtr_addr: '',



    }

  }

  componentDidMount() {

    document.title = "Vertex AMR - Analysis Raw Data";//woww graet works easily

    console.log("there");

  }






  render() {
    

    /////////////////////////
    //new funtionality
    console.log(this.props.location);
    //const {params}= this.props;
    //const {qstr}= this.params;
    //console.log(qstr);
    /////////////////////////
    //you can't set states in render but can use it's values






    return (
      <div>
        <h1>  fff </h1>
      </div>
    );
  }
}

export default TestReport;
