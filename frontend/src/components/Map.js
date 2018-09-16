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
    GeoJSON
  } from 'react-leaflet';
  
class LMap extends Component {
    
    constructor(props){
        super(props); 
    }

    render(){
        const center = [41.8781, -87.69];
        return (
            <Map center={center} zoom={11} minZoom={9}>
              
              <TileLayer
                attribution=""
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
              />
            </Map>
        )    
    }
}

export default LMap; 