// From American Panorama toolkit v0.1.16
// @ https://github.com/americanpanorama/panorama
import PropTypes from 'prop-types';
import { Path, PropTypes as LeafletPropTypes } from 'react-leaflet';
import { LeafletDonut } from './L.Donut';

export default class Donut extends Path {
  // Radii are in meters
  static propTypes = {
    center: LeafletPropTypes.latlng.isRequired,
    outerRadius: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
  };

  static defaultProps = {};

  constructor() {
    super();
  }

  componentWillMount() {
    const {center, outerRadius, innerRadius, ...props} = this.props;
    super.componentWillMount();
    this.leafletElement = new LeafletDonut(center, outerRadius, innerRadius, this.getPathOptions(props));
  }

  componentDidUpdate(prevProps) {
    if (this.props.center !== prevProps.center) {
      this.leafletElement.setLatLng(this.props.center);
    }

    if (this.props.outerRadius !== prevProps.outerRadius || this.props.innerRadius !== prevProps.innerRadius) {
      this.leafletElement.setRadius(this.props.outerRadius, this.props.innerRadius);
    }

    this.setStyleIfChanged(prevProps, this.props);
  }
}
