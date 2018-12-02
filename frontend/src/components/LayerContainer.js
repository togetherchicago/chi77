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
      lowerBound: 0,
      upperBound: 1000,
      maxval: 1,
      lowerTimeBound:0,
      upperTimeBound: 1000,
      timeRange: ["test"]
    }
    this.setLayer = this.setLayer.bind(this);
    this.setFilter = this.setFilter.bind(this);

    this.onEachFeature = this.onEachFeature.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.compareTimes = this.compareTimes.bind(this);
    this.rangeFilter = this.rangeFilter.bind(this);
    this.rangeTimeFilter = this.rangeTimeFilter.bind(this);

    this.rangeFilter = _.debounce(this.rangeFilter, 50);

    this.rangeTimeFilter = _.debounce(this.rangeTimeFilter, 50);

  }


  getStyle(feature, layer){
    if (this.state.filterData !== null) {
        let val;
        
        if (this.state.filter === "population") {
            val = this.state.filterData[feature.properties.name10]
        } else if (this.state.filter === "income") {
            val = this.state.filterData[feature.properties.pri_neigh];
        }
        // console.log("getStyle")
        if (val === undefined) {
            return {color: '#808080'};
        }

        if (val < this.state.lowerBound|| val > this.state.upperBound) {
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
      this.setState({filter: newFilter, filterData: null})
      .then(() => {
          //maybe here make call to API for timestamps available

          /**
           * TODO
           * Instead of many if/else statements for the filter, 
           * Make it so we can just do
           * axios.get('http://localhost:5000/api/' + this.state.filter)
           */
        if (this.state.filter === "population") {
            axios.get('http://localhost:5000/api/population').then(res => {
              console.log("population Data:", res.data)
              let result = this.convertDict(res);
              this.setState({filterData: result[0], maxval: result[1], lowerBound: 0, upperBound: result[1]})
          })
          .then(() => {
            //axios.get(http://localhost:5000/getTimestampsavailable).th
            this.setState({timeRange: [2016, 2018], lowerTimeBound: 2016, upperTimeBound: 2018, min_year: 2016, max_time_val: 2018 })
            .then(() => {
                // console.log("typeof timerange", typeof(this.state.timeRange), this.state.timeRange);
            })
            
          });
        }//if population

        else if (this.state.filter === "income") {
            axios.get('http://localhost:5000/api/percapitaincome').then(res => {
                console.log("income data:", res.data)
                let result = this.convertDict(res);
                this.setState({filterData: result[0], maxval: result[1], lowerBound: 0, upperBound: result[1]})
            });//axios
        }//elif
      })//.then()
  }//setFilter

  rangeFilter(value) {
      this.setState({lowerBound: this.state.maxval * value[0] / 100, upperBound: this.state.maxval * value[1] / 100})
  }

  rangeTimeFilter(value) {
      console.log("this.state.max_time_val:", this.state.max_time_val, "value", value,
                    (this.state.max_time_val - this.state.min_year) * value[0]/100 + this.state.min_year )

    const min_time = (this.state.max_time_val - this.state.min_year) * value[0]/100 + this.state.min_year;

    //lowerTimeBound: this.state.max_time_val * value[0] / 100
    this.setState({lowerTimeBound: Math.floor(min_time), upperTimeBound: Math.floor(this.state.max_time_val * value[1] / 100)})
    .then(()=> {
        this.compareTimes();
    })
}

  compareTimes() {
    console.log("Compare times")
    let time_diff_data = {};
    if (this.state.filter === "population") {
        //TODO: change to api route for this.state.lowerTimeBound
        axios.get('http://localhost:5000/api/population').then(res => {
          let result = this.convertDict(res);
          time_diff_data = result[0];
      })
      .then(() => {
          console.log(this.state.lowerTimeBound)
        if (this.state.lowerTimeBound === 2016) {
            console.log('2016')
        }
        else if (this.state.lowerTimeBound === 2017) {
            console.log('2017')
            for (let idx in time_diff_data) {
                time_diff_data[idx] = this.state.maxval / 2;
            }
        }
        else if (this.state.lowerTimeBound === 2018) {
            console.log(2018)
            for (let idx in time_diff_data) {
                time_diff_data[idx] = 0;
            }
        }
        this.setState({filterData: time_diff_data, lowerBound: 0, upperBound: this.state.maxval})
      });
    }//if population
    
  }

}

export default Layer;  