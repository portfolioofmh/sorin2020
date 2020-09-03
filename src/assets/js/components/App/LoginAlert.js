import React, { Component } from "react"
import GoogleLogin from 'react-google-login';

class LoginAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            message: '',
            link: ''

        }
        this.onClose = this.onClose.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);


    }

    onClose = () => {
        this.setState({ alert: false, message: '' })
        //this.props.closeCollectionsModal();
    }

   

      showAlert(message, link){
          console.log(link);
        this.setState({ alert:true, message: message, link: link })  
      }

      responseGoogle(response){
        console.log(response.profileObj);
        let getLink = this.state.link;
        this.props.getGoogleInfo(response.profileObj, getLink );
        this.setState({link: ''})
      }

      fail(){

      }

     


    render() {
        return(
            <div className="modals">

                
                       
                    {this.state.alert ? 
                        <div id="modal">
                        <div className="window-wrapper" onClick={ this.onClose  }>
                            <div className='window alert' >
                                    <button className="window-close" onClick={ this.onClose }>&times;</button>
                                    <h4>{this.state.message}</h4>
                                    <GoogleLogin
                                        clientId="896802988306-pcbt2u7dkffqu5rbhm9ciabhgpeqn1sf.apps.googleusercontent.com"
                                        render={renderProps => (
                                        <button className="signIn" onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign In</button>
                                        )}
                                        buttonText="Login"
                                        onSuccess={this.responseGoogle}
                                        onFailure={this.fail}
                                        cookiePolicy={'single_host_origin'}
                                        
                                    />

                            </div>
                        </div>
                      </div>

                        :
                        ''
                        }
                   

            </div>
        )
    }

}export default LoginAlert