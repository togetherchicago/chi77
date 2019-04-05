import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Polygon } from 'react-leaflet';

import { getCommunityAreas } from '../selectors';

class BasePolygons extends Component {
  static defaultProps = {
    communityAreas: {},
  };

  render() {
    const { communityAreas } = this.props;

    const polygons = [];
    for (const area in communityAreas) {
      polygons.push(<Polygon positions={communityAreas[area]['geometry']} weight={2} key={area}/>);
    }

    return (
      <LayerGroup>
        {polygons}
      </LayerGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    communityAreas: getCommunityAreas(state),
  };
}

export default connect(mapStateToProps)(BasePolygons);
