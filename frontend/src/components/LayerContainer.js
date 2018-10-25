import { Container } from 'unstated'
import axios from 'axios';
import tractFile from '../data/censustracts.geojson';

class Layer extends Container {
  constructor () {
    super()
    this.state = {
      layer: 'tract' //[tracts, neighborhood, precint, ward, zip]
    }
    this.setLayer = this.setLayer.bind(this);
    
  }

  setLayer (newLayer) {
    let domain = newLayer
    this.setState({ layer: domain  })
    .then(() => {
      console.log("container domain", domain)
      console.log("container this.state:", this.state);
    })
    
  }
  getLayer() {
    return this.state;
  }
}

export default Layer  