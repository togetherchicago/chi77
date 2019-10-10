import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerGroup, Polygon } from 'react-leaflet';
import _ from 'lodash';

import { getCommunityAreas, getFilterAreasByNumOfHospitals } from '../selectors';

class BasePolygons extends Component {
  static defaultProps = {
    communityAreas: {},
    filterAreasByNumOfHospitals: -1,
  };

  render() {
    const { communityAreas, filterAreasByNumOfHospitals } = this.props;
    const polygons = [];

    for (const area in communityAreas) {
      const p = <Polygon positions={communityAreas[area]['geometry']} weight={2} key={area}/>;

      // If filtering by num of hospitals
      if (filterAreasByNumOfHospitals > 0
        && (!communityAreas[area]['hospitals']
          || _.size(communityAreas[area]['hospitals']) < filterAreasByNumOfHospitals)
      ) continue; // Skip over

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
    filterAreasByNumOfHospitals: getFilterAreasByNumOfHospitals(state),
  };
}

export default connect(mapStateToProps)(BasePolygons);
