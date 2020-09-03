import React, { Component } from "react"
import { connect } from "react-redux"
import GoogleLogin from 'react-google-login';


class Hamburger extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false
        }

        this.toggleVisible = this.toggleVisible.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        
        this.signOut = this.signOut.bind(this);
        this.closeElement = this.closeElement.bind(this)
    }
    
    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyPress)
    }
/*
    componentWillUnMount() {
        document.body.removeEventListener("keydown", this.handleKeyPress)
    }
    */

    handleKeyPress(e) {
        if (e.keyCode == 27 && this.state.isVisible == true) {
            this.setState({isVisible: false})
        }
        if(window.innerWidth < 960){
        this.props.openMobile();
        }
    }

    

      signOut(){

        this.props.signOut();
      }

    toggleVisible(e) {
        

        if(window.innerWidth < 960){
            this.props.openMobile();
        }else{
            if (e.target === e.currentTarget || e.target.classList.contains("hamburger")) {
                this.setState({isVisible: !this.state.isVisible})
            }
        }
    }

    closeElement(){
        this.setState({isVisible: false})
    }
    
    render() {
        return (
            <div className="navigation">
                <a className={ this.state.isVisible? "open-hamburger hamburger-wrapper" : "hamburger-wrapper"} onClick={this.toggleVisible}>
                    <div className="hamburger top-bar"></div>
                    <div className="hamburger mid-bar"></div>
                    <div className="hamburger mid-bar2"></div>
                    <div className="hamburger bottom-bar"></div>
                </a>

                {this.state.isVisible && <Menu {...this.props} onKeyPress={this.handleEscapeKeyPress} onClick={this.toggleVisible} toggleVisible={this.toggleVisible}/>}
            </div>
        )
    }

    /*
 <ul>
                        {this.props.session.currentUser ? 
                            <li>
                        Welcome, {this.props.session.currentUser.fullname}<br />
                                <a href="/auth/signout" onClick={this.signOutUser}>Sign Out</a>
                            </li> :
                            <li>
                                <a href={"/auth/google?state=" + encodeURIComponent(login_state)}>Sign In</a>
                            </li>
                        }
                        <li><a href="/about">About {this.props.settings.app_name}</a></li>
                    </ul>

    */
}

class Menu extends Hamburger {
    constructor(props) {
        super(props)
        this.responseGoogle = this.responseGoogle.bind(this);
    }

    signOutUser = () => {
        //signOut(this.props.session.channel)
    }

    responseGoogle(response){
        //console.log(response.profileObj);
        this.setState({isVisible: false})
        this.props.getGoogleInfo(response.profileObj, '/search');
        this.props.toggleVisible();
        
      }

    render() {
        //let params = this.props.location.search ? this.props.location.search : ""
       // let login_state = JSON.stringify({url: this.props.location.pathname + params})
        
        return (
            <div className="navigation-wrapper" onClick={this.props.onClick} onKeyPress={this.props.onKeyPress}>
                <div className="navigation-menu">
                    <h4> Sorin 2.0</h4>

                    <ul id="user-info">
                      
                        

                            {!this.props.googleSignedIn ?

                            <li>
                            <GoogleLogin
                                clientId="896802988306-pcbt2u7dkffqu5rbhm9ciabhgpeqn1sf.apps.googleusercontent.com"
                                render={renderProps => (
                                <button className="signIn" onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign In</button>
                                )}
                                buttonText="Login"
                                onSuccess={this.responseGoogle}
                                //onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />

                            </li>

                            : 
                            <li>
                                 
                            Welcome, {this.props.googleInfo.name} <br />
                                    <a onClick={this.signOut}>Sign Out</a> 
                                </li> 
                        }

                        <li><a href="/about">About Sorin</a></li>
                    </ul>
                   
                </div> 
            </div>
        )
    }
}

export default Hamburger