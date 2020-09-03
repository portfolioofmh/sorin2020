import React, { Component } from "react"
import ErrorBoundary from "../Error/Error"

import ReactDOM from "react-dom"

import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'
import { Mutation } from '@apollo/react-components';

const ADD_RESOURCE_MUTATION = gql`
   mutation createResource($userId: Int, $fields: ResourceFields!){
  createResource(userId: $userId, fields:$fields){
    id
    title
    type
  }
}

`


const USER_QUERY = gql`
  query UserQuery($UserId: Int!) {
    
      users(id:$UserId) {

        collectionGroups
        resources {
          id
          title
          type
        }
      }
    
  }
`

class SearchResult extends Component {

    
    

    componentDidMount() {
 

        

 
      }


   

    constructor(props) {
        super(props)

        this.state = {
            saveit: <span>save to collections</span>,
            clicked: "",
            appClass: ''
        }

        //console.log(this.props.allReadySaved)

        //this.onShow = this.onShow.bind(this);
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.props.googleSignedIn){
            if (this.state.saveit != "saved!") {
                //if (!this.props.session.currentUser) {
                    this.setState({
                        saveit: "saving...",
                        clicked: " clicked"
                    })
    
                    /*
    
                    title
                    creator 
                    description
                    date
                    publisher
                    type
                    catalogUrl
                    isPartOf
    
    
                    */
    
                    //console.log(this.props.data)
    
                    let creator = this.props.data.creator
    
                    if(creator != null){
                        //creator = creator.toString();
                    }
                    let subjects = String(this.props.data.subject);
                    var subjectsArray = subjects.split(';').map(e => e.split(','));
    
                    //console.log(subjectsArray);
    
    
                    
    
                    const sendData = {
                        "title": this.props.data.title,
                        "creator": creator,
                        "description": this.props.data.description,
                        "date": this.props.data.date,
                        "publisher": this.props.data.publisher,
                        "type": this.props.data.type,
                        "catalogUrl": this.props.data.catalog_url,
                        "isPartOf": this.props.data.is_part_of, 
                        "callNumber" : this.props.data.call_number,
                        "subject": this.props.data.subject
    
    
                    }
    
                    
    
                    
    
    
                    const data = this.props.client.mutate({
                        mutation: ADD_RESOURCE_MUTATION ,
                        variables: {  userId: parseInt(this.props.userId), fields: sendData },
                      }).then(response => {
            
                        console.log(response); 
                        
                        this.props.savedResource(this.props.index);
            
                        this.setState({
                            saveit: "saved!",
                            clicked: " clicked"
                        })
            
    
                        
                      });
                     
    
    
                    // save item to local storage
    
                    /*
                    this.props.dispatch(
                        openModal({
                            id: uuidv4,
                            type: "confirmation",
                            buttonText: ["Sign in", "Cancel"],
                            onConfirm: () => {
                                let params = this.props.location.search ? this.props.location.search : "";
                                let login_state = JSON.stringify({url: this.props.location.pathname + params});
    
                                saveResourceToCookie(this.props.data, login_state)
                            },
                            onCancel: () => {
                                this.resetSaveItState()
                            },
                            onClose: () => {
                                this.resetSaveItState()
                            },
                            text: "Would you like to sign in and save this item?"
                        })
                        
                    )
                    */
                } else {
                    this.setState({
                        saveit: "saved!",
                        clicked: " clicked"
                    })
                    /*
                    let inbox = this.props.collections.collections.map( collection => {
                        if (collection.data.collection.id === this.props.session.inbox_id) {
                            return collection
                        }
                    })
        
                    if (inbox.length > 0) {
                        createResource(inbox[0].channel, this.props.session.inbox_id, this.props.data)
                        this.props.dispatch(addSaveNotification())
                    } else {
                        this.setState({
                            saveit: "Not Saved!",
                            clicked: " error"
                        })
                    }
                    */
                //}    
            }

        }else{
            this.props.openAlert('Log in to save item to your collections', '');
        }
       
    }

    openResource = () => {
        //console.log('openResource ' + this.props.index + this.props.data.title);
        this.props.openResourceModal(this.props.index, this.props.data);
        //const view = <ViewResult index={this.props.index} data={this.props.data}  />;
       /*
        return(
           <ViewResult index={this.props.index} data={this.props.data}  />
       )
       */
      //const modal = document.getElementById('modal')
      //return ReactDOM.createPortal(view, modal)
            

    }

    render() {
        const data = this.props.data


       
        
        return (
            <article className={'result ' + this.state.appClass} id={"search-result-" + (this.props.index)} >
              <ErrorBoundary>
              <span className="count">{this.props.index + 1}</span>
                <div className={"icon " + data.type}></div>
                <div className="info">
                      <small className="type">{data.type}</small> 
                    <h4 className="title">
                    <a target="_blank" onClick={this.openResource}>{data.title} <i>({data.date})</i></a>
                    </h4>
                    <div className="contrib">
                      
                        <span><i>{data.creator ? data.creator.join("; "): ""}</i></span>
                        
                        <p>
                        {data.contributor ? data.contributor.join("; "): ""}
                        </p>


                        <p>{data.is_part_of}</p>
                        
                        { data.call_number && data.availability_status == "available" && <span className="callNumber available">{data.call_number} - Available for checkout</span> }
                        
                        { data.call_number && data.availability_status == "unavailable" && <span className="callNumber unavailable">{data.call_number} - Currently unavailable</span> }

                       
                    </div>
                </div>

                <div className="actions">
                    <a className={"save" + this.state.clicked} data-context="L" onClick={this.onSave}>
                        <span className="flag">{this.state.saveit}</span>
                    </a>
                </div>
                </ErrorBoundary> 
            </article>
        )
    }
    

}

export default withApollo(SearchResult)