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
import Counter from './CounterContainer'


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

  render() {
    return (
      <div className="sidebar">
        <div className="item-container">
            <UncontrolledDropdown className="items">
              <DropdownToggle caret>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Domains</DropdownItem>
                <DropdownItem onClick={() => this.props.domainSelect("CensusTract")}>Census Tract</DropdownItem>
                <DropdownItem>Neighborhood</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Another Action</DropdownItem>
              </DropdownMenu>
              <Subscribe to={[Counter]}>
                {counter => (
                  <div>
                    <button onClick={() => counter.decrement()}>-</button>
                    <span>{counter.state.count}</span>
                    <button onClick={() => counter.increment()}>+</button>
                  </div>
                )}
              </Subscribe>
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
