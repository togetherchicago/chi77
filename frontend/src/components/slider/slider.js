import React, { Component } from 'react';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import { Subscribe } from 'unstated';
import Layer from '../LayerContainer';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const style = { };

function log(value) {
  console.log(value); //eslint-disable-line
}

class CustomizedRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lowerBound: 0,
      upperBound: 17000,
    };
  }

  render() {
    return (
        <Subscribe to={[Layer]}>
        {layer => (
            <div style={style}>
                <Range allowCross={false} defaultValue={[0, 17000]} onChange={e => layer.rangeFilter(e)} />
                {layer.state.lowerBound} to {layer.state.upperBound}
            </div>
        )}
        </Subscribe>
    );
  }
}

export default CustomizedRange;
