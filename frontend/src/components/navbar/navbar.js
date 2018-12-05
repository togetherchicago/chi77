import React, { Component} from 'react';
import { Navbar, Nav, FormGroup, FormControl, Button } from 'react-bootstrap/lib';
import 'bootstrap/dist/css/bootstrap.css';
import './navbar.css';


/**
 * This code is for the navbar that lives at the top of the application
 * As of now, it has no functionality, and is just in as a scaffold
 */
class NavBar extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {

    return (
      <Navbar className="navbar">
        <div className="searchbar">
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>{' '}
          <Button type="submit">Submit</Button>
        </div>
        <div className="linkSection">
          <a href="#">About</a>
          <div className="profile">
            <img src="./assets/imgs/profile-temp.png" className="profileImage"/>
            <a href="#">temporary name</a>
          </div>
        </div>
      </Navbar>
      );
    };
  }
  export default NavBar;
