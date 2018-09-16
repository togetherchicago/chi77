import React, { Component } from 'react';
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl


class Population extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount(){
    //   axios.get('localhost:5000/api/population').then( res => {
    //       this.state.population
    //   })
    console.log(LayersControl); 
  }

  render() {
    const center = [51.505, -0.09]

    return (
        <FeatureGroup>
            {/* <GeoJSON key={Math.random()} data={this.state.population} /> */}
        </FeatureGroup>
    )
  }
}

export default Population;