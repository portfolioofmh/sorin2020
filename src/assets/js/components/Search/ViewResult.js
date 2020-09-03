import React, { Component } from "react"
import Accordion from "../Accordion/Accordion"
import Citation from "../Citation/Citation"
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'
import { Mutation } from '@apollo/react-components';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Tags from '../Collections/Tags'
import PermalinkResource from '../Collections/PermalinkResource'
import Moment from 'react-moment';

const ADD_RESOURCE_MUTATION = gql`
   mutation createResource($userId: Int, $fields: ResourceFields!){
  createResource(userId: $userId, fields:$fields){
    id
    title
    userId
  }
}

`

const COLLECTION_QUERY = gql`
    query CollectionQuery($permalink: String) {
      collections(permalink:$permalink) {
        id
        title
        permalink
        notes{
            id
            body
        }
        published
        tags
        resourceOrder
        resources {
            id
            title
            creator 
            description
            date
            publisher
            type
            catalogUrl
            isPartOf
            callNumber
            subject
            notes {
                id
                body
            }
        }
      }
  }
`

class ViewResult extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
            collectionData: {},
            currentIndex: 0,
            hasCatalogResults: false,
            loaded: false
        }
        
        this.state = {
            saveit: "save to collections",
            clicked: ""
        }

        //console.log(this.props);
        this.checkIfSaved = this.checkIfSaved.bind(this);
        this.ViewResult = this.ViewResult.bind(this);
        this.onClose = this.onClose.bind(this);
        this.cloneCollection = this.cloneCollection.bind(this);

        /*

        console.log(this.props);

        let isAlreadySaved = this.props.allReadySaved.includes(this.props.index);
 
        if(isAlreadySaved){
         this.setState({
             saveit: "saved!",
             clicked: " clicked"
         })
        }

        */

        
    }

    componentDidMount(){
        this.checkIfSaved();

    }

    checkIfSaved(){
        console.log(this.props);

        let isAlreadySaved = this.props.allReadySaved.includes(this.props.index);
 
        if(isAlreadySaved){
         this.setState({
             saveit: "saved!",
             clicked: " clicked"
         })
        }
    }

    handleClick = (e) => {
        if ( e.target.classList.contains("window-close") || e.target.classList.contains("window-wrapper") || e.target.classList.contains("action-modal") || e.target.classList.contains("button-title")) {
            e.preventDefault()
            this.onClose()
        }
    }
    
    onSave = (e) => {
        e.preventDefault();
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

                let creator = this.props.data.creator;

                //console.log(creator);
                
            

                let subjects = String(this.props.data.subject);
                var subjectsArray = subjects.split(';').map(e => e.split(','));

                //console.log(subjectsArray);



                if(creator != null){
                    //creator = creator.toString();
                }

                

                const sendData = {
                    "title": this.props.data.title,
                    "creator": creator,
                    "description": this.props.data.description,
                    "date": this.props.data.date,
                    "publisher": this.props.data.publisher,
                    "type": this.props.data.type,
                    "catalogUrl": this.props.data.catalog_url,
                    "isPartOf": this.props.data.is_part_of, 
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
    }

    onClose = () => {
        this.props.closeResourceModal();
        this.setState({loaded: false});
    }

    resetSaveItState = () => {
        
    }

  
    checkInbox = (resource) => {
        
    }

    cloneCollection = () => {
        this.props.openCloneModal(this.props.data.id);
    }

    componentDidMount() {
        /*
        this.setState({
            data: this.props.data,
            currentIndex: this.props.index + 1,
            hasCatalogResults: this.props.search.searchResults.catalogs.num_results > 0,
            resultLength: this.props.search.searchResults.catalogs.results.length
        })
        
        this.checkInbox(this.props.data)
        */

      
    }

    nextResource = () => {

        if(this.props.index+1 < this.props.numOfResults){
            this.props.changeResourceModal(this.props.index+1);
        }
        //console.log(this.props.index);

        let isAlreadySaved = this.props.allReadySaved.includes(this.props.index+1);
 
        if(isAlreadySaved){
         this.setState({
             saveit: "saved!",
             clicked: " clicked"
         })
        }else{
            this.setState({
                saveit: "save to collections",
                clicked: ""
            })
        }

        

               // this.checkIfSaved();

        

        /*
        if (this.state.hasCatalogResults && this.state.currentIndex < this.state.resultLength) {
            let nextResource = this.props.search.searchResults.catalogs.results[this.state.currentIndex]
            
            this.setState({
                data: nextResource,
                currentIndex: this.state.currentIndex + 1
            })
        }

        return 
        */
    }

    previousResource = () => {

        if(this.props.index-1 > 0){
            this.props.changeResourceModal(this.props.index-1);
        }

        let isAlreadySaved = this.props.allReadySaved.includes(this.props.index-1);
 
        if(isAlreadySaved){
         this.setState({
             saveit: "saved!",
             clicked: " clicked"
         })
        }else{
            this.setState({
                saveit: "save to collections",
                clicked: ""
            })
        }

        /*
        if (this.state.hasCatalogResults && this.state.currentIndex > 1) {
            let prevResource = this.props.search.searchResults.catalogs.results[this.state.currentIndex - 2]
            
            this.setState({
                data: prevResource,
                currentIndex: this.state.currentIndex - 1
            })
        }

        return
        */
    }

    isPrev = () => {
        /*
        if (this.state.hasCatalogResults) {
            if (this.state.currentIndex <= this.state.resultLength) {
                if (this.state.currentIndex == 1) {
                    return ""
                }
                
                return " more"
            }
            return ""
        }
        return ""
        */


        if(this.props.index-1 > 0){
            return " more"
        }
        else{
            return ""
        }
    }


    isNext = () => {

        if(this.props.index+1 < this.props.numOfResults){
            return " more"
        }
        else{
            return ""
        }
        /*
        if (this.state.hasCatalogResults) {
            if (this.state.currentIndex <= this.state.resultLength) {
                if (this.state.currentIndex == this.state.resultLength) {
                    return ""    
                }

                return " more"
            }
            return ""
        }
        return ""
        */
    }

    ViewResult(){

        let data = this.state.data || this.props.data

        let isAlreadySaved = this.props.allReadySaved.includes(this.props.index);


        if( data.permalink && !this.state.loaded){

            const data = this.props.client.query({
                query: COLLECTION_QUERY,
                variables: { permalink: this.props.data.permalink  },
                fetchPolicy:'network-only'
              }).then(response => {
                
                console.log(response);
                this.setState({collectionData:response.data.collections[0], loaded:true});

              

            });

        }

        //console.log(isAlreadySaved);
        //this.checkIfSaved();

     
        

        let subjects = data.subject ? data.subject[0].split(" ; ") : []
        return (
            <div className="window-wrapper" onClick={this.handleClick}>
                <div className="window">
                    <button className="window-close" onClick={ this.onClose  }>&times;</button>

                    <div  className="resource-form">



                        <div className="container">


                            <div className="resource-column-left">
                                <span  className={"arrow arrow-up" + this.isPrev()}onClick={this.previousResource}>Prev</span>
                                <div className={"resource-box-icon icon " + data.type} />
                                <span  className={"arrow arrow-down"+ this.isNext() } onClick={this.nextResource}>Next</span>
                            </div>

                            

                            {data.type === 'collection' ?

                            <div id="searchCollection" className="resource-column-middle " style={{"maxHeight":(( window.innerHeight -   300 ) + "px" )}}>

                                        <label className="type blue-text">                    
                                        {data.type} </label>
        
                                    <h2 className={"full-width resource-title blue-text"}>
                                        {data.title} 
                                    </h2>
                                    <p>Created by: {data.creator} </p>
                                   
                                    <p className="time-info">Created on: <b className="blue-text"><Moment  format="D MMM YYYY">{data.insertedAt}</Moment></b> | Last updated: <b  className="blue-text"><Moment  fromNow>{data.updatedAt}</Moment></b> </p>
                                    

                                    {data.tags && (
                                        <div>
                                            <label className="type blue-text"> Tags</label>
                                            <ul className={"subjects"}>
                                                {data.tags.map((tag, index) => (
                                                    <li key={"subject-" + tag + "-" + index}>
                                                        <a href= {"/search?query=" + tag+ "&filters=[queryPlace:SUB]"}>
                                                            {tag}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {this.state.collectionData && this.state.loaded ? 

                                    <div>
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        data={
                                            this.state.collectionData.notes != null
                                            ? this.state.collectionData.notes.body
                                            : "No Notes"
                                            }
                                        disabled={true}
                                        onInit={ editor => {
                                            // You can store the "editor" and use when it is needed.
                                            //console.log( 'Editor is ready to use!', editor );
                                        } }
                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            this.handleNoteChange(data);
                                            // console.log( { event, editor, data } );
                                        } }
                                        onBlur={ ( event, editor ) => {
                                            //console.log( 'Blur.', editor );
                                        } }
                                        onFocus={ ( event, editor ) => {
                                            //console.log( 'Focus.', editor );
                                        } }
                                    />

                                   
                                   

                                    <Accordion title={"Resources"} titleClass={"more-info"}>
                                        <div id="searchCollectionResources" className="resource-group ">
                                            { this.state.collectionData.resources.map((resource, index) => {
                                                return (
                                                    <PermalinkResource
                                                        key={resource.id}
                                                        data={resource}
                                                        index={index} />
                                                )
                                            })  }
                                        </div>
                                    </Accordion>


                                    </div>

                                    : ''}


                                    



                                  
                                    

                            </div>





                            :

                            <div className="resource-column-middle" style={{"maxHeight":(( window.innerHeight -   300 ) + "px" )}}>



                                <label className="type">                    
                                        {data.type} 

                                        {data.call_number && (
                                            <span className="callNumber available green">  - Munday Library Stacks {data.call_number} - {data.availability_status}</span>
                                        )}
                                    </label>
                        
                                    <h2 className={"full-width resource-title blue-text"}>
                                        {data.title} <span><i>({data.date})</i></span>
                                    </h2>
                
                                    {data.is_part_of && (
                                        <p><i>{data.is_part_of}</i></p>
                                    )}
                                
                                    {data.creator && (
                                        <div>
                                            <h4 className="more-info">Author(s):</h4>
                                            <ul className={"subjects"}>
                                                {data.creator.map((creator, index) => (
                                                    <li key={"creator-" + creator + "-" +index}>
                                                        <a href= {"/search?query=" + creator  }>
                                                            {creator}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {data.description && (
                                        <div>
                                            <h4 className="more-info">Description:</h4>
                                            {data.description}
                                        </div>
                                    )}

                                    {data.publisher && (
                                        <div>
                                            <h4 className="more-info">Publication:</h4>
                                            {data.publisher}
                                        </div>
                                    )}

                                    {data.subject && (
                                        <div>
                                            <h4 className="more-info">Subject(s):</h4>
                                            <ul className={"subjects"}>
                                                {subjects.map((subject, index) => (
                                                    <li key={"subject-" + subject + "-" + index}>
                                                        <a href= {"/search?query=" + subject + "&filters=[queryPlace:SUB]"}>
                                                            {subject}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                   
                                
                                    
                                    {data.format && (
                                        <div>
                                            <p><b>FORMAT: </b>
                                                {data.format}
                                            </p>
                                        </div>
                                    )}

                                    {data.language && (
                                        <div>
                                            <p><b >LANGUAGE: </b>
                                                {data.language}
                                                
                                            </p>
                                        </div>
                                    )}

                                    {data.doi && (
                                        <div>
                                            <p><b >DOI: </b>
                                                {data.doi}
                                            </p>
                                        </div>  
                                    )}

                                    {data.identifier && (
                                        <Accordion
                                            title={"Item URL"}
                                            titleClass={"more-info"}
                                        >
                                            <input
                                                type="text"
                                                className="full-width"
                                                readOnly={true}
                                                name="url"
                                                placeholder="Item URL"
                                                value={data.catalog_url}
                                            />
                                        </Accordion>
                                    )}

                                    <Accordion title={"Citations"} titleClass={"more-info"}>
                                        <Citation data={data} />
                                    </Accordion>

                                
                                </div>


                            }


                                

                            <div className="resource-column-right">

                               {this.props.googleSignedIn ? 
                                <div>
                            {data.type === 'collection' ?

                                    <a className={"btn save green-bg full-width"} onClick={this.cloneCollection} >
                                    <span className="flag">Clone</span>
                                    </a>

                            :

                            <a className={"btn save green-bg full-width" + this.state.clicked}  onClick={this.onSave}>
                                <span className="flag">{this.state.saveit}</span>
                            </a>


                            }

                                </div>

                                :

                                <div><p>Please login in to save item to a collection</p></div>

                        }



                                 
                                
                                    {data.catalog_url && 
                                        <a
                                            title="Go To Link"
                                            className="resource-box-link btn full-width goto"
                                            target="_blank"
                                            href={ 
                                                !data.catalog_url.match(/^[a-zA-Z]+:\/\//) ?
                                                    "//" + data.catalog_url : data.catalog_url }
                                        >
                                            Go To Resource
                                        </a>
                                    }

                                        {data.permalink && 
                                        <a
                                            title="Go To Collection"
                                            className="resource-box-link btn full-width goto"
                                            target="_blank"
                                            href={'/c/'+data.permalink}
                                        >
                                            Go To Collection
                                        </a>
                                    }
                                </div>
                        </div>



                    </div>
                </div>
            </div>
        )

    }

    render() {

       // this.checkIfSaved();
       

        return (


            <div className="modals">
                 {
                    
                    this.props.isOpen ?
                        this.ViewResult()
                        :
                        ''
                }

            </div>

            
            
        )
    }
}

export default withApollo(ViewResult)