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

import Population from './Population';

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
        const temp = new Layer();

        if (temp.state.layer === "tract") {
            axios.get(tractFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (temp.state.layer === "neighborhood") {
            axios.get(neighborhoodFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (temp.state.layer === "precinct") {
            axios.get(precinctFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (temp.state.layer === "ward") {
            axios.get(wardFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else if (temp.state.layer === "zip") {
            axios.get(zipFile).then(res => {
                this.setState({domain: res.data})
            })
        }
        else {
            console.log("Heck")
        }




        // axios.get('http://localhost:5000/api/population').then(res => {
        //     // console.log(res.data)
        //     this.setState({population: res.data})
        // })
    }

    render(){
        const center = [41.8781, -87.69];
        console.log("Hit")

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
                        data={layer.state.domain}
                        style={layer.getStyle}
                        onEachFeature = {layer.onEachFeature}/>
                    </FeatureGroup>

                </Map>
            )}
            </Subscribe>
        )
    }
}

export default LMap;
