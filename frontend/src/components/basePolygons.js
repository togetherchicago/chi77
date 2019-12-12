import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Popup, Polygon } from 'react-leaflet';
import { Button } from 'react-bootstrap';

import { updateOverlayAC } from '../-general/actions';
import { getCommunityAreas } from '../selectors';

class BasePolygons extends Component {
  static defaultProps = {
    communityAreas: {},
    updateOverlay: () => {},
  };

  render() {
    const { communityAreas, updateOverlay } = this.props;
    const polygons = [];

    for (const area in communityAreas) {
      const p = <Polygon
        positions={communityAreas[area]['geometry']}
        weight={2}
        key={area}
        fillOpacity={0}
        color="#646464"
      >
        <Popup>
          {communityAreas[area]['name']}
          <br />
          <Button
            variant="link"
            size="sm"
            onClick={() => {updateOverlay(area);}}
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

function mapDispatchToProps(dispatch) {
  return {
    updateOverlay: (slug) => dispatch(updateOverlayAC(slug)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasePolygons);
