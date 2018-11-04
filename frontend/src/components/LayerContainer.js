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
      layer: 'Census Tract', //[tracts, neighborhood, precint, ward, zip]
      filter: 'Nothing',
      filterData: null,
      upperBound: 17000,
      lowerBound: 0,

    }
    this.setLayer = this.setLayer.bind(this);
    this.selectLayer = this.selectLayer.bind(this);

    this.setFilter = this.setFilter.bind(this);

    this.onEachFeature = this.onEachFeature.bind(this);
    this.getStyle = this.getStyle.bind(this);
  }


  getStyle(feature, layer){
    //   console.log('hit')
      const MAXPOP = 17000;
    if (this.state.filterData !== null) {
        const pop = this.state.filterData[feature.properties.name10]
        
        if (pop < this.state.lowerBound|| pop > this.state.upperBound) {
            return {color: 'none'}
        }

        if (pop > 11000){
            return {color: '#E50800'}
        }
        else if (pop > 10000){
            return {color: '#E72008'}
        }
        else if (pop > 9000){
            return {color: '#E93910'}
        }
        else if (pop > 8000){
            return {color: '#EB5218'}
        }
        else if (pop > 7000){
            return {color: '#EE6A20'}
        }
        else if (pop > 6000){
            return {color: '#F08329'}
        }
        else if (pop > 5000){
            return {color: '#F29C31'}
        }
        else if (pop > 4000){
            return {color: '#F5B439'}
        }
        else if (pop > 3000){
            return {color: '#F7CD41'}
        }
        else if (pop > 2000){
            return {color: '#F9E649'}
        }
        else {
            return {color: '#FDFF94'}
        }
    }
    
}
  onEachFeature(feature, layer){
    if (this.state.filterData !== null) {
        layer.bindPopup('Census Tract: ' + feature.properties.name10 + '<br/>' +
            'Population: ' + this.state.filterData[feature.properties.name10])
    }
}

  selectLayer(domain) {
      if (this.state.layer === "Census Tract") {
        axios.get(tractFile).then(res => {
            this.setState({domain: res.data})
        })
      }
      else if (this.state.layer === "Neighborhood") {
          axios.get(neighborhoodFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "Precinct") {
          axios.get(precinctFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "Ward") {
          axios.get(wardFile).then(res => {
              this.setState({domain: res.data})
          })
      }
      else if (this.state.layer === "Zip") {
          axios.get(zipFile).then(res => {
              this.setState({domain: res.data})
          })
      }
  }

  setLayer (newLayer) {
    if (newLayer === this.state.layer) {
        return;
    }
    let domain = newLayer
    this.setState({ layer: domain, filter: "Nothing", filterData: null  })
    .then(() => {
      this.selectLayer(domain);
    })
  }

  selectFilter(filter) {
      if (this.state.filter === "population") {
          axios.get('http://localhost:5000/api/population').then(res => {
            console.log("selectFilter Data:", res.data)
            let tract_pop = {}
            for (let idx in res.data) {
                tract_pop[res.data[idx].domain] = res.data[idx].value
            }
            this.setState({filterData: tract_pop})
        })
      }
  }

  setFilter(newFilter) {
      console.log("newFilter", newFilter)
      this.setState({filter: newFilter, filterData: null})
      .then(() => {
          this.selectFilter(newFilter)
      })
  }

  rangeFilter(value) {
    //   console.log(value[0], value[1])
      this.setState({lowerBound: 17000 * value[0] / 100, upperBound: 17000 * value[1] / 100})
  }
  getLayer() {
    return this.state;
  }
}

export default Layer  