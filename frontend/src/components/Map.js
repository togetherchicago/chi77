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
        this.getStyle = this.getStyle.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
    }


    onEachFeature(feature, layer){
        var self = this;
        for (var i = 0; i < this.state.population.length; i++){
            if (self.state.population[i]['census_tract'] == feature.properties.name10){
                layer.bindPopup('Census Tract: ' + feature.properties.name10 + '<br/>' +
                    'Population: ' + self.state.population[i]['pop_100'])
            }
        }

    }

    getStyle(feature, layer){
        var self = this;
        for (var i = 0; i < self.state.population.length; i++){
            if (self.state.population[i]['census_tract'] == feature.properties.name10){
                var pop = self.state.population[i]['pop_100']
                if (pop > 11000){
                    return {color: '#E50800'}
                }
                else if (pop > 10000){
                    return {color: '#E72008'}
                }
                else if (pop > 9000){
                    return {color: '#E93910'}
                }
                else if (pop > 8000){
                    return {color: '#EB5218'}
                }
                else if (pop > 7000){
                    return {color: '#EE6A20'}
                }
                else if (pop > 6000){
                    return {color: '#F08329'}
                }
                else if (pop > 5000){
                    return {color: '#F29C31'}
                }
                else if (pop > 4000){
                    return {color: '#F5B439'}
                }
                else if (pop > 3000){
                    return {color: '#F7CD41'}
                }
                else if (pop > 2000){
                    return {color: '#F9E649'}
                }
                else {
                    return {color: '#FDFF94'}
                }
            }
        }
    }

    componentDidMount(){

        const temp = new Layer();

        console.log("layer", temp.state.layer)

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

        return (
            <Subscribe to={[Layer]}>
            {layer => (

                
                <Map onbaselayerchange={(e) => layer.setLayer(e)} center={center} zoom={11} minZoom={9}>
                    <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FeatureGroup>
                        <GeoJSON key={Math.random()} data={this.state.domain} />
                    </FeatureGroup>

                </Map>
            )}
            </Subscribe>
        )
    }
}

export default LMap;
