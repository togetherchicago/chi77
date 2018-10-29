import { Container } from 'unstated'
import axios from 'axios';
import tractFile from '../data/censustracts.geojson';
import neighborhoodFile from '../data/neighborhoods.geojson';
import precinctFile from '../data/precincts.geojson';
import wardFile from '../data/wards.geojson';
import zipFile from '../data/zipcodes.geojson';

class Layer extends Container {
  constructor () {
    super()
    axios.get(tractFile).then(res => {
      this.setState({domain: res.data})
    })
    this.state = {
      layer: 'tracts', //[tracts, neighborhood, precint, ward, zip]
    }
    this.setLayer = this.setLayer.bind(this);
    this.selectLayer = this.selectLayer.bind(this);
  }

  selectLayer(domain) {
      if (this.state.layer === "tract") {
        axios.get(tractFile).then(res => {
            this.setState({domain: res.data})
        })
      }
      else if (this.state.layer === "neighborhood") {
          axios.get(neighborhoodFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "precinct") {
          axios.get(precinctFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "ward") {
          axios.get(wardFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "zip") {
          axios.get(zipFile).then(res => {
              this.setState({domain: res.data})
          })
      }
  }

  setLayer (newLayer) {
    let domain = newLayer
    this.setState({ layer: domain  })
    .then(() => {
      this.selectLayer(domain);
    })
  }

  getLayer() {
    return this.state;
  }
}

export default Layer  