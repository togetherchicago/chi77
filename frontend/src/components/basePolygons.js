import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Popup, Polygon } from 'react-leaflet';

import { getCommunityAreas } from '../selectors';

class BasePolygons extends Component {
  static defaultProps = {
    communityAreas: {},
  };

  render() {
    const { communityAreas } = this.props;
    const polygons = [];
    const names = [];
    const name = "communityAreas[area]['name'] + more info"

    for (const area in communityAreas) {
      const p = <Polygon
        positions={communityAreas[area]['geometry']}
        weight={2}
        key={area}
        fillOpacity={0}
        bindPopup = { name }
      />;

      const q = <Popup>
        {communityAreas[area]['name']}
        <p>+ more info</p>
      </Popup>;
      
      names.push(q)
      polygons.push(p);
    }

    return (
      <div>
        {/* {names} */}
        <LayerGroup>
        {polygons}
      </LayerGroup>
      </div>
      
    );
  }
}

function mapStateToProps(state) {
  return {
    communityAreas: getCommunityAreas(state),
  };
}

export default connect(mapStateToProps)(BasePolygons);
