import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Popup, Polygon } from 'react-leaflet';
import { Button } from 'react-bootstrap';

import { getCommunityAreas } from '../selectors';

class BasePolygons extends Component {
  static defaultProps = {
    communityAreas: {},
  };

  render() {
    const { communityAreas } = this.props;
    const polygons = [];

    for (const area in communityAreas) {
      const p = <Polygon
        positions={communityAreas[area]['geometry']}
        weight={2}
        key={area}
        fillOpacity={0}
      >
        <Popup>
          {communityAreas[area]['name']}
          <br />
          <Button
            variant="link"
            size="sm"
            onClick={() => {console.log(area);}}
          >+ more info</Button>
        </Popup>
      </ Polygon>;

      polygons.push(p);
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
