import { TimePicker } from 'antd';
import React from 'react'

class TimePickerComponent extends React.Component {
  state = {
    value: null,
  };

  onChange = (time) => {
    const { heading } = this.props;
    //console.log(heading);
    //console.log(time);
    this.setState({ value: time });
    if (time != null) {
      //console.log(time._d);//great work
    }


    //sending back the parameters
    if (heading == 'fromtime') {
      if (time != null) {
        var t = time._d;

        this.props.onHandleFromTimeStatus(t);
      }

    }

    if (heading == 'totime') {

      if (time != null) {
        var t = time._d;

        this.props.onHandleToTimeStatus(t);
      }

    }

  }

  render() {
    const { heading } = this.props;
    var str = `select ${heading}`;

    return (
      <div style={{ paddingBottom: '12px' }}>

        <TimePicker placeholder={str} value={this.state.value} onChange={this.onChange} />;
      </div>
    );
  }
}

export default TimePickerComponent;

