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
    this.onClick = this.onClick.bind(this);
    this.state = {
      isOpen: false,
      domain: 'tract'
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


  render() {
    return (
      <Subscribe to={[Layer]}>
      {layer => (
        <div className="sidebar">
          <div className="item-container">
            <UncontrolledDropdown className="items">
              <DropdownToggle caret>
                {layer.state.layer}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Domains</DropdownItem>
                <DropdownItem name="tract" onClick={e => layer.setLayer(e.target.name)}>Census Tract</DropdownItem>
                <DropdownItem name="neighborhood"onClick={e => layer.setLayer(e.target.name)}>Neighborhood</DropdownItem>
                <DropdownItem name="precinct"onClick={e => layer.setLayer(e.target.name)}>Precinct</DropdownItem>
                <DropdownItem name="ward"onClick={e => layer.setLayer(e.target.name)}>Ward</DropdownItem>
                <DropdownItem name="zip"onClick={e => layer.setLayer(e.target.name)}>Zip</DropdownItem>
              </DropdownMenu>
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
