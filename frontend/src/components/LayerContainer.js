import { Container } from 'unstated'
import axios from 'axios';
import tractFile from '../data/censustracts.geojson';
import neighborhoodFile from '../data/neighborhoods.geojson';
import precinctFile from '../data/precincts.geojson';
import wardFile from '../data/wards.geojson';
import zipFile from '../data/zipcodes.geojson';
import _ from 'lodash';

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
      upperBound: 0,
      lowerBound: 0,

    }
    this.setLayer = this.setLayer.bind(this);
    // this.selectLayer = this.selectLayer.bind(this);

    this.setFilter = this.setFilter.bind(this);

    this.onEachFeature = this.onEachFeature.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.rangeFilter = _.debounce(this.rangeFilter, 50);
  }


  getStyle(feature, layer){
    if (this.state.filterData !== null) {
        
        let val;
        if (this.state.filter === "population") {
            val = this.state.filterData[feature.properties.name10]
        } else if (this.state.filter === "income") {
            val = this.state.filterData[feature.properties.pri_neigh];
        }

        console.log("Maxval", this.state.maxval)

        if (val === undefined) {
            return {color: '#808080'};
        }

        if (val < this.state.lowerBound|| val > this.state.upperBound) {
            console.log(val, this.state.lowerBound, this.state.upperBound)
            return {color: '#808080'}
        }
        if (val >= this.state.maxval * .99){
            return {color: '#E50800'}
        }
        else if (val > this.state.maxval * .9){
            return {color: '#E72008'}
        }
        else if (val > this.state.maxval * .8){
            return {color: '#E93910'}
        }
        else if (val > this.state.maxval * .7){
            return {color: '#EB5218'}
        }
        else if (val > this.state.maxval * .6){
            return {color: '#EE6A20'}
        }
        else if (val > this.state.maxval * .5){
            return {color: '#F08329'}
        }
        else if (val > this.state.maxval * .4){
            return {color: '#F29C31'}
        }
        else if (val > this.state.maxval * .3){
            return {color: '#F5B439'}
        }
        else if (val > this.state.maxval * .2){
            return {color: '#F7CD41'}
        }
        else if (val > this.state.maxval * .1){
            return {color: '#F9E649'}
        }
        else {
            return {color: '#FDFF94'}
        }
    }
    
}
  onEachFeature(feature, layer){
    if (this.state.filterData !== null && this.state.filter === "population") {
        layer.bindPopup('Census Tract: ' + feature.properties.name10 + '<br/>' +
            'Population: ' + this.state.filterData[feature.properties.name10])
        } 

    else if (this.state.filterData !== null && this.state.filter === "income") {
        layer.bindPopup('Neighborhood: ' + feature.properties.pri_neigh + '<br/>' +
            'Income: ' + this.state.filterData[feature.properties.pri_neigh]) 
    }
    
}

//   selectLayer(domain) {

//   }

  setLayer (newLayer) {
    if (newLayer === this.state.layer) {
        return;
    }
    let domain = newLayer
    this.setState({ layer: domain, filter: "Nothing", filterData: null  })
    .then(() => {
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
    });
  }

  selectFilter(filter) {
      if (this.state.filter === "population") {
          axios.get('http://localhost:5000/api/population').then(res => {
            console.log("population Data:", res.data)
            let result = this.convertDict(res);
            this.setState({filterData: result[0], maxval: result[1], upperBound: result[1]})
        });

      } else if (this.state.filter === "income") {
          axios.get('http://localhost:5000/api/percapitaincome').then(res => {
              console.log("income data:", res.data)
              let result = this.convertDict(res);
              this.setState({filterData: result[0], maxval: result[1], upperBound: result[1]})
          });
      }
  }

  convertDict(res) {
    let dict = {}
    let maxVal = 0;
    for (let idx in res.data) {

        if (res.data[idx].value > maxVal) {
            maxVal = res.data[idx].value;
        }

        dict[res.data[idx].domain] = res.data[idx].value
    }
    return [dict, maxVal];
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
      this.setState({lowerBound: this.state.maxval * value[0] / 100, upperBound: this.state.maxval * value[1] / 100})
  }
  getLayer() {
    return this.state;
  }
}

export default Layer  