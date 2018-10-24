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


class SideBar extends Component{
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onClick(e) {
    console.log(e)

    let layer = new Layer();

    layer.setLayer(e);

  }

  render() {


    let layer = new Layer();

    let cur_layer = layer.state.layer

    return (
      <div className="sidebar">
        <div className="item-container">
            <UncontrolledDropdown className="items">
              <DropdownToggle caret>
                {cur_layer}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Domains</DropdownItem>
                <DropdownItem name="tract" onClick={e => this.onClick(e.target.name)}>Census Tract</DropdownItem>
                <DropdownItem name="neighborhood"onClick={e => this.onClick(e.target.name)}>Neighborhood</DropdownItem>
                <DropdownItem name="precinct"onClick={e => this.onClick(e.target.name)}>Precinct</DropdownItem>
                <DropdownItem name="ward"onClick={e => this.onClick(e.target.name)}>Ward</DropdownItem>
                <DropdownItem name="zip"onClick={e => this.onClick(e.target.name)}>Zip</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
      </div>
    );
  };
}
SideBar.propTypes = {
  // domainSelect: PropTypes.func.isRequired,
}
export default SideBar;
