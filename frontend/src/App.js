import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import logo from './logo.svg';
import './App.css';
import LMap from './components/Map';
import SideBar from './components/sidebar/sidebar';
import NavBar from './components/navbar/navbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <SideBar />
        <div id="mapwrap"><LMap /></div>
      </div>
    );
  }
}

export default App;
