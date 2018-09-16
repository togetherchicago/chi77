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
const { BaseLayer, Overlay } = LayersControl
  
class LMap extends Component {
    
    constructor(props){
        super(props); 
        this.state = {}
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
                            <GeoJSON key={Math.random()} data={this.state.tracts} />
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
                    {/* End Base Layers */}

                </LayersControl>

            </Map>
        )    
    }
}

export default LMap; 