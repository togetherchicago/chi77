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
    console.log("slider props", this.props);
    this.state = {
      lowerBound : this.props.lowerBound,
      upperBound : this.props.upperBound
    }
  }

  render() {
    if (this.props.type === "time") {
      // console.log("hit", this.props.lowerBound, this.props.upperBound)
      return (
        <Subscribe to={[Layer]}>
        {layer => (
            <div style={style}>
                <Range allowCross={false} 
                // min={this.props.min_year}
                defaultValue={[this.props.lowerBound, this.props.upperBound]}
                onChange={e => layer.rangeTimeFilter(e)} 
                />

                {this.props.lowerBound} to {this.props.upperBound}
            </div>
        )}
        </Subscribe>
      );
    }
    else {
      console.log("hit", this.props.lowerBound, this.props.upperBound)
      return (
        <Subscribe to={[Layer]}>
        {layer => (
            <div style={style}>
                <Range allowCross={false} 
                defaultValue={[this.props.lowerBound,this.props.upperBound]} 
                onChange={e => layer.rangeFilter(e)} 
                />
                
                {this.props.lowerBound} to {this.props.upperBound}
            </div>
        )}
        </Subscribe>
      );
    }

    
  }
}

export default CustomizedRange;
