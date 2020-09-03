import React, { Component, PureComponent } from "react"
import '../../../scss/App.scss';

import { Switch, Route, Redirect } from 'react-router-dom'
//import Header from '../../components/Header/Header'
import { NavLink } from 'react-router-dom'
import Search from '../Search/Search'
import Collections from '../../components/Collections/Collections'
import Notes from '../../components/Notes/Notes'
import { withApollo } from 'react-apollo'
import Hamburger from './Hamburger'
import gql from 'graphql-tag'
import Permalink from '../../components/Collections/Permalink'
import LoginAlert from './LoginAlert'


/*

const USER_QUERY = gql`
  query UserQuery($UserId: Int!) {
    
      users(id:$UserId) {
        id
        fullname
        collectionGroups
        email
      }
    
  }
`
*/

const USER_QUERY = gql`
  query UserQuery($email: String) {
    
      users(email:$email) {
        id
        fullname
        collectionGroups
        email
      }
    
  }
`


class App extends PureComponent  {

  constructor(props){
    super(props);

   
    this.state = {
      userId: null,
      resources: {},
      fullname : '',
      isMobile: false,
      collectionGroups: [],
      data: [],
      saved_results: [], 
      saved_results_num: 0,
      email: '',
      google: {},
      googleSignedIn: false,
      openAlert: false,
      error:false

    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCollectionGroups = this.updateCollectionGroups.bind(this);
    this.handleSaveReource = this.handleSaveReource.bind(this);
    this.getSavedNum = this.getSavedNum.bind(this);
    this.getGoogleInfo = this.getGoogleInfo.bind(this);
    this.signOut = this.signOut.bind(this);
    this.openAlert = this.openAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.signIn = this.signIn.bind(this);
    this.alertElement = React.createRef();
    this.hbElement = React.createRef();


  }


  activeEvent = (match, location) => {
    if (window.location.pathname === "/" || match) {
        return true
    }

    return false
}

componentDidMount() {
  this.updateWindowDimensions()
  window.addEventListener("resize", this.updateWindowDimensions)
  //console.log(this.testProfile.id);
  //this.setState({userId: this.testProfile.id});
  //this.setState({data: this.testProfile.data});
 
  //console.log(data);
  if( localStorage.getItem('google') ){
    console.log( JSON.parse( localStorage.getItem('google') ));
    this.setState({google: JSON.parse( localStorage.getItem('google')) , googleSignedIn: true},  () => {
      console.log(this.state.google.email)
      this.signIn('');
    })
    //localStorage.setItem('google', localStorage.getItem('google') );

    //this.signIn('');

  }
}

signIn(link){
  console.log('sign in');
  console.log(this.state.google.email);
  const data = this.props.client.query({
    query: USER_QUERY,
    variables: { email: this.state.google.email},
  }).then(response => {
    console.log(response.data.users[0].email);
    console.log(response.data.users[0].id );


      if(response.data.users[0].id != null){
          this.setState({userId: response.data.users[0].id, email: response.data.users[0].email});
              const dataParse = JSON.parse(response.data.users[0].collectionGroups);
              const collectionGroups = [];


              for (let [key, value] of Object.entries(dataParse)) {
                //console.log(key);
                let collectionGroupName = key;
                collectionGroups.push(key)
              
              }

              console.log(collectionGroups)
              this.setState({collectionGroups: collectionGroups});
              this.setState({fullname: response.data.users[0].fullname}, () =>{
                  if(link != ''){
                  window.location.href = link;
                  }


              });
      }else{
        console.log('not a user')
      }

    
  }).catch(response => {
    localStorage.clear();
    
    console.log(response);
    console.log('not a user');
    this.setState({google: {}, googleSignedIn: false})
    this.setState({error:true})


  })
}
  
updateWindowDimensions = () => {
  let header = document.getElementById("header")
  let content = document.getElementById("content")

  if(window.innerWidth < 961){
   // this.setState({isMobile: true})
  }else{
   // this.setState({isMobile:false})
  }

  if (content && header != null) {
      content.style.height = ( window.innerHeight -   header.offsetHeight ) + "px"
  }


}

handleSaveReource(numofNew){
  //console.log(numofNew);

  document.getElementById('new').innerHTML = '<span class="circle">'+numofNew+'</span>';
   
}

clearSavedNum(){
document.getElementById('new').innerHTML = '';
}

openMobile(){
  if(window.innerWidth < 960){
    console.log('mobile');
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');

  }
}

getGoogleInfo(gObj,link){
  console.log(gObj.email);
  console.log(link);
  let getEmail = String(gObj.email);
  console.log(getEmail);

  var ifSteds = getEmail.endsWith("@stedwards.edu");
  console.log(ifSteds);

  if(ifSteds){
    this.setState({google: gObj, googleSignedIn: true}, () =>{
      localStorage.setItem('google', JSON.stringify(gObj));
      this.hbElement.current.closeElement();
      this.signIn(link);


    })
  }

  
  

}

signOut(){
  this.setState({google: {}, googleSignedIn: false})
  localStorage.removeItem('google');
  localStorage.clear();

  window.location.href = '/';
}

closeAlert(){
  
  //this.setState({openAlert: false});
  
}

openAlert(message, link){
  //let message = 'login to view';
  //let message = mess;
  this.alertElement.current.showAlert(message, link);
  //this.setState({openAlert: true})
}

notLoggedInAlert(){
        
  return(
      <div className="window-wrapper">
          <div className='window alert' >
                  <button className="window-close" onClick={ this.closeAlert  }>&times;</button>
                  <h4>Please login to view this page.</h4>
          </div>
      </div>
  )
}



getSavedNum = () => {
  return(
    <span id="new">

    {this.state.saved_results_num}

   </span>
   
   
   
  )
}



updateCollectionGroups(newOrder){
  //console.log('new order ' + newOrder)
 // this.setState({collection_groups: newOrder})
}

//<a id="mobileBtn" onClick={this.openMobile}>menu</a>

  render() {
    
    return(
        <div className="App ">
          <header className="header" id="header">
            <div><img src='../seu-logo.svg' /></div>
            <div id="top-header">
              <h1>Munday Library</h1> 
              <div>
              {this.state.googleSignedIn ? <img src={this.state.google.imageUrl} className='avitar'/> : ''}
              <Hamburger fullname={this.state.fullname} openMobile={this.openMobile} getGoogleInfo={this.getGoogleInfo} googleInfo={this.state.google} googleSignedIn={this.state.googleSignedIn} signOut={this.signOut} ref={this.hbElement}/>
              </div>
            </div>
          </header>
          <div className="wrapper" id="wrapper">
            <aside id="sidebar" className="sidebar">

            
              <div className="mobile-only" id="user-info-mobile">
                
              {this.state.googleSignedIn ?
                <div>
                 
                  <p>
                    Welcome, {this.state.google.name} , 
                  </p>
                </div>
                : ''}

              </div>
              <ul>
                <li>
                  <NavLink  to="/Search" activeClassName="active" isActive={this.activeEvent}>
                    Search
                  </NavLink >
              </li>
              { this.state.googleSignedIn ?
                <li>
                  <NavLink  to="/Collections" activeClassName="active" isActive={this.activeEvent}>
                    <span> Collections  <span id="new"></span> </span>
                  </NavLink >
                </li>
                : 
                <li>
                    <a onClick={() => this.openAlert('Log in to view your collections', '/Collections')}> <span id="new"></span>Collections </a>
                </li>
                }

                { this.state.googleSignedIn ?

                <li>
                  <NavLink  to="/Notes" activeClassName="active" isActive={this.activeEvent}>
                    <span> Notes   </span>
                  </NavLink >
                </li>

                :
                <li>
                    <a onClick={() => this.openAlert('Log in to view your notes', '/Notes')}> Notes</a>
                </li>

                }
              
              </ul>
            </aside>
            <section className="content" id="content">
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/search" />} />
                <Route exact path="/search" component={() => <Search userId={this.state.userId}  savedResource={this.handleSaveReource} openMobile={this.openMobile} collectionGroups={this.state.collectionGroups}  googleSignedIn={this.state.googleSignedIn}  openAlert={this.openAlert}/>   }  />
                <Route exact path="/collections" component={() => <Collections  userId={this.state.userId}  collection_groups={this.state.collection_groups} updateCollectionGroups={this.updateCollectionGroups}   savedResources={this.state.saved_results} clearSavedNum={this.clearSavedNum} openMobile={this.openMobile}/> } onUpdate={() => window.scrollTo(0, 0)}/>
                <Route exact path="/notes" component={() => <Notes userId={this.state.userId} openMobile={this.openMobile} userEmail={this.state.email}/>   }  />
                <Route path="/c/:collection_url" component={Permalink} />
                
                
              </Switch>
            </section>
          </div>

          <LoginAlert ref={this.alertElement} getGoogleInfo={this.getGoogleInfo}   />


          
          <div id="footer">
            <div className="footer-column">
            <img src='../seu-logo-white.svg' />
              <p>
               St. Edward's University<br /> 3001 South Congress<br />Austin, Texas 78704-6489
              </p>

            </div>


          </div>
        </div>
        
      );
    }
}

export default withApollo(App);
