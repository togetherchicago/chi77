import React, { Component } from 'react';
import { Map, TileLayer, LayersControl } from 'react-leaflet';

import { CHI_POSITION, MAPBOX_TOKEN } from '../constants';
import BasePolygons from './basePolygons';
import HospitalPoints from './hospitalPoints';
import TrainStationPoints from './trainStationPoints';


class MapComp extends Component {
  render() {
    return (
      <Map center={CHI_POSITION} zoom={13} style={{height: '100%'}}>
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='BaseMap' checked='true'>
            <TileLayer
              url='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
              maxZoom={18}
              id='mapbox.streets'
              accessToken={MAPBOX_TOKEN}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name='Hospitals'>
            <HospitalPoints />
          </LayersControl.Overlay>

          <LayersControl.Overlay name='Train Stations'>
            <TrainStationPoints />
          </LayersControl.Overlay>

        </LayersControl>
        <BasePolygons />
      </Map>
    );
  }
}

export default MapComp;
