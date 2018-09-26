import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LMap from './components/Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <LMap />
      </div>
    );
  }
}

export default App;
