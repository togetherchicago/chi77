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


    this.state = {
        //our map mounts starting with Census Tract as active layer
        //TODO change this variable to something that makes more sense
        layer: 'Census Tract',
        //
        //maybe change this to 'domain_data', and change layer to 'domain'
        domain: null,
        //initially, we have no filter
        filter: 'Nothing',
        //we start with no filter data. when I tried initializing as [] I get errors, but null worked.
        filterData: null,
        //we set upperbound to 1000, so the sliders are separated when mounted
        // we may need to change upperBound to a larger number in future, but this worked for now.
  
        /**
         * TODO: currently, we just track upperBound and lowerBound as single variables.
         *        When the application grows, we will begin tracking multiple filters at once.
         *        We have not thought extensively about how to fix this, but my thought is
         *        you could store this as a dictionary, where the key is something
         *        like census_tract_population, and values could be a list where 
         *        list[0] = lower, list[1] = upper.
         */
        upperBound: 1000,
        lowerBound: 0,
        //this is used later as we add filters, and will get set to the max value for whatever we are 
        //filtering
        maxval: 1,
  
      }
    //initialize domain with res.data.
    axios.get(tractFile).then(res => {
      this.setState({domain: res.data})
    })
    

    //make sure you bind any additional functions you write.
    //if you dont know why to, google will give better explanation than me.
    this.setLayer = this.setLayer.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.rangeFilter = this.rangeFilter.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.getStyle = this.getStyle.bind(this);


    //debounce is used so that way the slider does not call the layer to update state 
    // for ever single point. When you change a bound by thousands, the slider
    // becomes unusably slow. Look up lodash documentation for questions.
    this.rangeFilter = _.debounce(this.rangeFilter, 50);
  }



  //this gets called from map.js whenever the state changes.
  //gets called one "feature" at a time.
  //feature = geoJSON block.
  //Note: the layer parameter may not be used yet, but we kept it incase you find a case
  //in the future in which you want it.
  getStyle(feature, layer){
      //make sure only runs if actually have data to filter
    if (this.state.filterData !== null) {
        let val;
        if (this.state.filter === "population") {
            val = this.state.filterData[feature.properties.name10]
        } else if (this.state.filter === "income") {
            val = this.state.filterData[feature.properties.pri_neigh];
        }
        //sometimes data doesnt exist. if this happens, we gray it out.
        if (val === undefined) {
            return {color: '#808080'};
        }

        //if data is outside bounds, gray out. 
        //TODO: Differentiate between nonexistant data and out of bounds data
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
  //this function also runs each time state changes.
  //currently just used to add popups. 
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

  /**
   * 
   * TODO: right now, when we change from one domain to another, 
   *        it does not hide the slider filters that had been open.
   *        
   *        this should be changed so when a new domain is chosen, 
   *        the filter sliders disapear, and their data is forgotten.
   */
  setLayer (domain) {
    if (domain === this.state.layer) {
        return;
    }
    //when we set a new domain, get rid of the filter
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

  /**
   * this file reads in filter data, such as population
   * and returns a list, where the first value is
   * a dictionary that stores the data by domain: value
   * 
   * The second value is the maximum value of the dataset. THis will
   * be used when it is returned.
   * */
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

       
       //set new filter, and whipe filterData for now.
      this.setState({filter: newFilter, filterData: null})
      .then(() => {
        /**
        * TODO
        * Instead of many if/else statements for the filter, 
        * Make it so we can just do
        * axios.get('http://localhost:5000/api/' + this.state.filter)
        */
        if (this.state.filter === "population") {
            //this API route is going to be changed ASAP, but is not complete yet so 
            //I have not been able to update it myself.
            axios.get('http://localhost:5000/api/population').then(res => {
              //returns list where result[0] is dictionary of data, result[1] is maxval
              let result = this.convertDict(res);
              /**
               * set data, maxval, and the lower and upper bounds
               * we separate maxval and upperBound, because upperBound will change
               * as the user uses the slider, but maxVal must remain constant for styling.
               */
              this.setState({filterData: result[0], maxval: result[1], lowerBound: 0, upperBound: result[1]})
          });

        }
        else if (this.state.filter === "income") {
            axios.get('http://localhost:5000/api/percapitaincome').then(res => {
                let result = this.convertDict(res);
                this.setState({filterData: result[0], maxval: result[1], lowerBound: 0, upperBound: result[1]})
            });//axios
        }//elif
      })//.then()
  }//setFilter

  //this is used to set the upper and lower bounds of the filter. Called from slider.js
  rangeFilter(value) {
      this.setState({lowerBound: this.state.maxval * value[0] / 100, upperBound: this.state.maxval * value[1] / 100})
  }

}

export default Layer
