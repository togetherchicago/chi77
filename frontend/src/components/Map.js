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

import axios from 'axios';

import tractFile from '../data/censustracts.geojson';
import neighborhoodFile from '../data/neighborhoods.geojson';
import precinctFile from '../data/precincts.geojson';
import wardFile from '../data/wards.geojson';
import zipFile from '../data/zipcodes.geojson';

import { Subscribe } from 'unstated';
import Layer from './LayerContainer';


class LMap extends Component {

    constructor(props){
        super(props);
        this.state = {
            population: []
        }
    }



    componentDidMount(){
        /** 
         * this may not be the best way to do this, but we could not find a better way 
         * to access layer within this function.
        */
        const layer_ = new Layer();

        if (layer_.state.layer === "tract") {
            axios.get(tractFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (layer_.state.layer === "neighborhood") {
            axios.get(neighborhoodFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (layer_.state.layer === "precinct") {
            axios.get(precinctFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (layer_.state.layer === "ward") {
            axios.get(wardFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (layer_.state.layer === "zip") {
            axios.get(zipFile).then(res => {
                this.setState({domain: res.data})
            })
        }
    }

    render(){

        const center = [41.8781, -87.69];

        return (
            <Subscribe to={[Layer]}>
            {layer => (
                <Map onbaselayerchange={(e) => layer.setLayer(e)} center={center} zoom={11} minZoom={9}>
                    <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FeatureGroup>
                        <GeoJSON
                        key={Math.random()}
                        //renders map from layer
                        data={layer.state.domain}
                        //renders the styling for the map
                        style={layer.getStyle}
                        //runs a function on each feature/geoJSON object on map
                        onEachFeature = {layer.onEachFeature}/>
                    </FeatureGroup>

                </Map>
            )}
            </Subscribe>
        )
    }
}

export default LMap;
