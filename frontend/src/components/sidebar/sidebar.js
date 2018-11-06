import React, { Component } from 'react';
import './sidebar.css';
import{Provider, Subscribe, Container} from 'unstated';
import Layer from '../LayerContainer'
import {SplitButton, MenuItem, ButtonToolbar,DropdownButton, Dropdown, DropdownMenu, DropdownToggle, Button} from 'react-bootstrap/lib'
import CustomizedRange from '../slider/slider'


class SideBar extends Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.state = {
      isOpen: false,
      domain: 'tract',
      sliderActive: false,
      bsStyle: 'default'
    };
  }

  handleClick(bsStyle) {
    if (this.state.bsStyle ==='default'){
        return "primary"
    } else {
        return "default"
    }
  }
  onClick(e) {
    console.log(e)
    this.setState({domain: e})
  }

  renderButtons(title,i){
    return(   <Subscribe key={i+title} to={[Layer]}>
      {layer => (
        <div className='items'>
          <Button
          title={title}
          key={'button'+title+i}
          id={'button'+title+i}
          bsStyle={this.state.bsStyle}
          onClick={e => {
            layer.setFilter(e.target.name);
            document.getElementById('slider'+title+i).classList.toggle('hidden');
            document.getElementById('button'+title+i).classList.toggle('btn-'+this.handleClick());
          }}
        >{title}
      </Button>
      <div className='slider hidden' key={'2'-i} id={'slider'+title+i}><CustomizedRange></CustomizedRange></div>
    </div>
  )}
</Subscribe>)
  }

  render() {
    console.log(this.state);
    console.log(this.renderButtons());


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
              Lorem ipsum dolor sit amet, fermentum dapibus fusce volutpat, pellentesque in. Eleifend nostrum leo sit netus mauris orci, facilisis vel posuere elementum. Neque sit arcu enim ac aliquet vivamus. Phasellus lectus, fermentum commodo amet, pulvinar at vel pede dui tristique. Quam hic viverra orci.
            </div>
            <div className="domainSection">
              <div className="sectionHeader">
                Geographic Area
              </div>
              <DropdownButton
                title= {layer.state.layer}
                id='dropdown-button-basic'
                data-toggle="dropdown"
                onToggle={!this.state.isOpen}
              >
                <MenuItem name="Census Tract" onClick={e => layer.setLayer(e.target.name)} eventKey="1">Census Tract</MenuItem>
                <MenuItem name="Neighborhood" onClick={e => layer.setLayer(e.target.name)} eventKey="2">Neighborhood</MenuItem>
                <MenuItem name="Precinct" onClick={e => layer.setLayer(e.target.name)} eventKey="3">Precinct</MenuItem>
                <MenuItem name="Ward" onClick={e => layer.setLayer(e.target.name)} eventKey="4">Ward</MenuItem>
                <MenuItem name="Zip" onClick={e => layer.setLayer(e.target.name)} eventKey="5">Zip</MenuItem>
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
