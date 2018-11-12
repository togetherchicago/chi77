import React, { Component } from 'react';
import{Subscribe} from 'unstated';
import Layer from '../LayerContainer'
import CustomizedRange from '../slider/slider'
import {MenuItem, DropdownButton, Button} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.css';
import './sidebar.css';


class SideBar extends Component{
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.state = {
      isOpen: false,
      domain: 'tract',
      sliderActive: false,
      bsStyle: 'default'
    };
  }

  // handleClick(bsStyle) {
  //   if (this.state.bsStyle ==='default'){
  //       return "primary"
  //   } else {
  //       return "default"
  //   }
  // }

  handleFilter(e, layer){
    layer.setFilter(e.target.name)
    // if (document.getElementById(id).classList.contains('btn-primary')){
    //   layer.setFilter(e.target.name);
    // } else {
    //   layer.setFilter('nothing');
    // }
  }

  renderButtons(title,i){
    return(   <Subscribe key={'subscribe'+i} to={[Layer]}>
      {layer => (
        <div className='items'>
          <Button
          name={title}
          key={'button'+title+i}
          id={'button'+title+i}
          bsStyle={this.state.bsStyle}
          onClick={e=>{
            this.handleFilter(e, layer);
            document.getElementById('slider'+title+i).classList.toggle('hidden');
            document.getElementById('button'+title+i).classList.toggle('btn-primary');
            
          }}
        >{title}
      </Button>
      <div className='slider hidden' key={'slider'+title+i} id={'slider'+title+i}><CustomizedRange></CustomizedRange></div>
    </div>
  )}
</Subscribe>)
  }

  render() {

    const DEMOGRAPHICS=[
      'population','age','income','unemployment'
    ];
    const HOUSING=[
      'price','low income'
    ];
    const HEALTHCARE=[
      'insurance','hospitals'
    ];
    const TRANSPORTATION=[
      'public transit','bike lanes','accidents'
    ];
    const EDUCATION=[
      'public schools','private schools','school grades'
    ];
    const PUBLICSERVICES=[
      'police stations','food pantries','government offices','religious organizations'
    ];
    const CRIME=[
      'assault','burglary','robbery'
    ];

    return (
      <Subscribe to={[Layer]}>
      {layer => (
        <div className="sidebar">
          <div className="item-container">

            <div className="logo">Logo</div>

            <div className="tagline">tagline</div>
            
            <div className="intro-text">
              Welcome to Chi77
            </div>

            <div className="domainSection">

              <div className="sectionHeader">
                Geographic Area
              </div>
              
              <DropdownButton title= {layer.state.layer} id='dropdown-button-basic' data-toggle="dropdown">

                <MenuItem name="Census Tract" 
                onClick={e =>{layer.setLayer(e.target.name); this.setState({domain: e.target.name}); }}>
                    Census Tract 
                    </MenuItem>

                <MenuItem name="Neighborhood"
                  onClick={e =>{layer.setLayer(e.target.name);this.setState({domain: e.target.name});}}>
                  Neighborhood
                </MenuItem>

                <MenuItem name="Precinct"
                  onClick={e =>{layer.setLayer(e.target.name);this.setState({domain: e.target.name});}}>
                  Precinct
                </MenuItem>

                <MenuItem
                  name="Ward"
                  onClick={e =>{layer.setLayer(e.target.name);this.setState({domain: e.target.name});}}>
                  Ward
                </MenuItem>

                <MenuItem
                  name="Zip"
                  onClick={e =>{layer.setLayer(e.target.name);this.setState({domain: e.target.name});}}>
                  Zip
                </MenuItem>
              </DropdownButton>
          </div>

              <div className="filterSection">
                <div className="sectionHeader">
                  Filters
                </div>
                <div className="filterHeader">Demographics</div>
                {DEMOGRAPHICS.map(this.renderButtons)}

                <div className="filterHeader">Housing</div>
                {HOUSING.map(this.renderButtons)}

                <div className="filterHeader">Healthcare</div>
                {HEALTHCARE.map(this.renderButtons)}

                <div className="filterHeader">Transportation</div>
                {TRANSPORTATION.map(this.renderButtons)}

                <div className="filterHeader">Education</div>
                {EDUCATION.map(this.renderButtons)}

                <div className="filterHeader">Public Services</div>
                {PUBLICSERVICES.map(this.renderButtons)}

                <div className="filterHeader">Crime</div>
                {CRIME.map(this.renderButtons)}

            </div>
          </div>
        </div>
      )}
      </Subscribe>
    );
  };
}
SideBar.propTypes = {
  // domainSelect: PropTypes.func.isRequired,
}
export default SideBar;
