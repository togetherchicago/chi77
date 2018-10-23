import { Container } from 'unstated'

class Layer extends Container {
  constructor () {
    super()
    this.state = {
      layer: ''
    }
    this.setLayer = this.setLayer.bind(this)
  }
  setLayer (newLayer) {
    this.setState({ layer: newLayer.name  })
    console.log(this.state);
  }
}

export default Layer  