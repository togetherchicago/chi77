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

const { BaseLayer, Overlay } = LayersControl
  
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
        axios.get(tractFile).then(res => {
            this.setState({tracts: res.data})
        })
        axios.get(neighborhoodFile).then(res => {
            this.setState({neighborhoods: res.data})
        })
        axios.get(precinctFile).then(res => {
            this.setState({precincts: res.data})
        })
        axios.get(wardFile).then(res => {
            this.setState({wards: res.data})
        })
        axios.get(zipFile).then(res => {
            this.setState({zipcodes: res.data})
        })

        axios.get('http://localhost:5000/api/population').then(res => {
            console.log(res.data)
            this.setState({population: res.data})
        })
    }

    render(){
        const center = [41.8781, -87.69];
        return (
            <Map center={center} zoom={11} minZoom={9}>

                <TileLayer
                attribution=""
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
                />
                <LayersControl position="topright">

                    {/* Base Layers */}
                    <BaseLayer checked name="Tracts">
                        <FeatureGroup>
                            <GeoJSON ref='tracts' key={Math.random()} data={this.state.tracts} />
                        </FeatureGroup>
                    </BaseLayer>

                    <BaseLayer name="Neighborhoods">
                        <FeatureGroup>
                            <GeoJSON key={Math.random()} data={this.state.neighborhoods} />
                        </FeatureGroup>
                    </BaseLayer>

                    <BaseLayer name="Precincts">
                        <FeatureGroup>
                            <GeoJSON key={Math.random()} data={this.state.precincts} />
                        </FeatureGroup>
                    </BaseLayer>

                    <BaseLayer name="Wards">
                        <FeatureGroup>
                            <GeoJSON key={Math.random()} data={this.state.wards} />
                        </FeatureGroup>
                    </BaseLayer>

                    <BaseLayer name="Zip Codes">
                        <FeatureGroup>
                            <GeoJSON key={Math.random()} data={this.state.zipcodes} />
                        </FeatureGroup>
                    </BaseLayer>

                    <BaseLayer name="Population">
                        {/* <Population /> */}
                        <FeatureGroup>
                            <GeoJSON 
                                key={Math.random()} 
                                data={this.state.tracts} 
                                style={this.getStyle}
                                onEachFeature = {this.onEachFeature}/>
                        </FeatureGroup>
                    </BaseLayer>
                    {/* End Base Layers */}

                    {/* Overlays */}
                    {/* <Overlay name="Population">
                        <Population />
                    </Overlay> */}
                    {/* End Overlays */}

                </LayersControl>

            </Map>
        )    
    }
}

export default LMap; 