import React, { Component } from 'react';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import './sidebar.css';
import{Provider, Subscribe, Container} from 'unstated'; 
import Layer from '../LayerContainer'

import CustomizedRange from '../slider/slider'

class SideBar extends Component{
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      isOpen: false,
      domain: 'tract',
      sliderActive: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onClick(e) {
    this.setState({domain: e})
  }

  renderSlider() {
    if (this.state.sliderActive) {
      return <CustomizedRange></CustomizedRange>
    }
    else {
      return <div></div>
    }
}

  render() {

    return (
      <Subscribe to={[Layer]}>
      {layer => (
        <div className="sidebar">
          <div className="item-container">
            <UncontrolledDropdown className="items">
              <DropdownToggle caret>
                Domain: {layer.state.layer}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Domains</DropdownItem>
                <DropdownItem name="Census Tract" onClick={e => layer.setLayer(e.target.name)}>Census Tract</DropdownItem>
                <DropdownItem name="Neighborhood"onClick={e => layer.setLayer(e.target.name)}>Neighborhood</DropdownItem>
                <DropdownItem name="Precinct"onClick={e => layer.setLayer(e.target.name)}>Precinct</DropdownItem>
                <DropdownItem name="Ward"onClick={e => layer.setLayer(e.target.name)}>Ward</DropdownItem>
                <DropdownItem name="Zip"onClick={e => layer.setLayer(e.target.name)}>Zip</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="items">
              <DropdownToggle caret>
                Filter by: {layer.state.filter}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Filters</DropdownItem>
                <DropdownItem name="nothing" onClick={e => {layer.setFilter(e.target.name); this.setState({sliderActive: false});}}>Nothing</DropdownItem>
                <DropdownItem name="population"onClick={e => {layer.setFilter(e.target.name); this.setState({sliderActive: true});}}>Population</DropdownItem>
                
              </DropdownMenu>
              {this.renderSlider()}
            
             </UncontrolledDropdown>
             


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
