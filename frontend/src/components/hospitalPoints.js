import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Polygon } from 'react-leaflet';

class HospitalPoints extends Component {
    static defaultProps = {
        communityAreas: {},
      };
    
      render() {
        const { hospitals } = this.props;
    
        const markers = [];
        for (const hospital of hospitals) {
          markers.push(<Marker positions={hospital['lat_long']} key={hospital['name']}/>);
        }
    
        return (
          <LayerGroup>
            {markers}
          </LayerGroup>
        );
      }
}
export default connect(mapStateToProps)(HospitalPoints);
