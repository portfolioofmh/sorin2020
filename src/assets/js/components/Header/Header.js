import React, { Component } from "react"


class Header extends React.Component {

    constructor(props){
      super(props);
     
     
    }

  
    render() {
      return(
        <header className="header" id="header">
          <div><img src='seu-logo.svg' /></div>
          <div id="top-header">
            <h1>Munday Library</h1>
            <a id="mobileBtn">menu</a>
          </div>
        </header>
        );
      }
  }
  
  export default Header;
  