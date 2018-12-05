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

class CustomizedRange extends React.Component {
  constructor(props) {
    //passed props from sidebar.js.
    super(props);
   
    /**
     * right now, we have nothing in state because we are just tracking lowerBound and upperBound,
     * which we get from props anyways
     */
    this.state = {
    };
  }

  render() {
    return (
        //subscribes to state
        <Subscribe to={[Layer]}>
        {layer => (
          //<Range ...> is the slider which we import from rc-slider
          //our onChange function lives in the state, because the state needs to be alerted
          //when the slider moves so it can alter the map.
            <div style={style}>
                <Range allowCross={false} 
                defaultValue={[this.props.lowerBound, this.props.upperBound]} 
                onChange={e => layer.rangeFilter(e)} />
                {this.props.lowerBound} to {this.props.upperBound}
            </div>
        )}
        </Subscribe>
    );
  }
}

export default CustomizedRange;
