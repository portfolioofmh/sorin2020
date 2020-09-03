import React, { Component } from "react"
//import RichTextEditor from './RichTextEditor'
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'
import { Mutation } from '@apollo/react-components';
import Accordion from "../Accordion/Accordion"
import Citation from "../Citation/Citation"
import { CirclePicker } from "react-color"
import Tags from './Tags'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Dropdown from 'react-dropdown';
import '../../../scss/dropdown.scss'
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment/min/moment-with-locales';


const COLLECTION_QUERY = gql`
  query CollectionQuery($CollectionId: Int!) {
      collections(id:$CollectionId) {
        id
        title
        permalink
        creator 
        updatedAt
        insertedAt
        notes{
            id
            body
        }
        published
        tags
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
        }
      }
  }
`

const CREATE_COLLECTION_MUTATION = gql`
    mutation CreateCollection($Title:String!, $UserId: Int!, $Group: String){
        createCollection(title: $Title, userId: $UserId, group: $Group){
            id
            title
            resources {
                id
                title
                type
                }
            }
    }
`


const CREATE_RESOURCE_MUTATION = gql`
mutation createResource($UserId: Int, $fields: ResourceFields!, $collectionId: Int, $position: Int){
  createResource(userId: $UserId, fields:$fields, collectionId: $collectionId, position:$position){
    id
    title
    userId
    collectionId
  }
}
`

const UPDATE_COLLECTION_MUTATION = gql`
   mutation updateCollection($CollectionId: Int!, $CollectionFields: CollectionFields!){
    updateCollection(id:$CollectionId, fields: $CollectionFields) {
        id
        published
        title
        resourceOrder
    }	
    }
`

const REMOVE_COLLECTION_MUTATION = gql`
 mutation removeCollection( $userId: Int!, $collectionId:Int!){
  removeCollection(userId: $userId, collectionId: $collectionId) {
    collectionGroups
  }
}
`

const UPDATE_RESOURCE_MUTATION = gql`
mutation updateResource($ResourceId: Int!, $ResourceFields: ResourceFields!){
    updateResource(id:$ResourceId, fields: $ResourceFields) {
      id
      title
      directUrl
    }	
  }
`

const UPDATE_TAGS_MUTATION = gql`
 mutation updateCollection($CollectionId: Int!, $CollectionFields: CollectionFields!){
  updateCollection(id:$CollectionId, fields: $CollectionFields) {
    id
    tags
  }	
}
`



const DELETE_RESOURCE_MUTATION = gql`
  mutation deleteResource($id: Int!){
  deleteResource(id:$id) {
    id
  }
}
`

const MOVE_RESOURCE_MUTATION = gql`
mutation moveResource($ResourceId: Int! $Position: Int!, $TargetCollectionId: Int!){
  moveResource(id: $ResourceId, position: $Position, targetCollectionId: $TargetCollectionId){
    id
  }
}
`

const RESOURCE_QUERY = gql`
    query getResource($ResourceId: Int!){
        resources(id:$ResourceId){
        id
        title
        creator 
        notes {
            id
            body
        }
        description
        date
        publisher
        type
        catalogUrl
        isPartOf
        directUrl
        subject

        }
    
  }
  
`

const CREATE_NOTES_MUTATION = gql`
    mutation createNote($body: String!, $userId: Int, $collectionId: Int, $resourceId: Int){
    createNote(body: $body, userId: $userId, collectionId: $collectionId, resourceId: $resourceId){
        id
        body
        
    }
    }
`


const UPDATE_NOTES_MUTATION = gql`
    mutation updateNote($body: String!, $noteId: ID!){
    updateNote(body: $body, id: $noteId){
        id
        body
    }
    }
`

const UPDATE_COLLECTION_COLOR_MUTATION = gql`
mutation changeColor($CollectionId: Int!, $CollectionFields: CollectionsUsersFields! ){
    updateCollectionsUsers(id:$CollectionId, fields: $CollectionFields){
      id
      color
    }
  }
  `

class CollectionsModal extends Component {
    constructor(props) {
        super(props);

        //console.log(props)

        this.state = {
            info: {},
            title: '',
            notes: {},
            edit_collection_title: '',
            UserId: '',
            color: null,
            alert:false,
            confirm: false,
            results: {},
            permalink: '',
            loading: false,
            directUrl:'',
            resourceData: {},
            tags: [],
            collectionData: {}, 
            makepublic: false, 
            noteBody: '',
            isPublic: false, 
            moveCollection: ''
        }

        this.createCollection = this.createCollection.bind(this);
        this.createResource = this.createResource.bind(this);
       
        this.editCollection = this.editCollection.bind(this);
        this.editResource = this.editResource.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.getCollectionInfo = this.getCollectionInfo.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);

        this.onClose = this.onClose.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.deleteResource = this.deleteResource.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.onTagsChange = this.onTagsChange.bind(this);
        this.makeCollectionPublic = this.makeCollectionPublic.bind(this);
        this.handleCollectionGroup = this.handleCollectionGroup.bind(this);
        this.moveCollection = this.moveCollection.bind(this);
        this.handleMoveToAnotherCollection = this.handleMoveToAnotherCollection.bind(this);
        this.moveResource = this.moveResource.bind(this);

    }


    componentDidMount() {


        

    }

    focusInputField = input => {
        if (input) {
            setTimeout(() => {
                input.focus()
            }, 100)
        }
    }

    onClose(){
        this.setState({
            info: {},
            title: '',
            notes: {},
            edit_collection_title: '',
            color: null,
            alert:false,
            confirm: false,
            results: {},
            permalink: '',
            loading: false,
            directUrl:'',
            noteBody: '',
            resourceData: {},
            tags: [],
            collectionData: {}, 
            makepublic: false, 
            isPublic: false,
            moveCollection: '',
            subjectsArray: []
        });
        this.props.closeCollectionsModal();
    }

    createCollection (e){
        e.preventDefault();

        const data = this.props.client.mutate({
            mutation: CREATE_COLLECTION_MUTATION ,
            variables: { Title: this.state.title, UserId: parseInt(this.props.userId), Group: this.props.collectionGroup},
          }).then(response => {

            console.log(response); 
            
            const newCollection = {id: response.data.createCollection.id, cUserId: response.data.createCollection.id,  title: this.state.title, resources: {}, writeAccess:true, color:null, published: false };

                this.onClose();

                this.props.formSubmit(newCollection, 'create_collection');
            
          });
        
    }

    createResource(e){
        e.preventDefault();

        //createResource($userId: Int, $fields: ResourceFields!, $collectionId: Int, $position: Int)

        //console.log("collectin id " + this.props.edit_Object.collectionId);
        
        let collectionId = this.props.edit_Object.collectionId;

        if(this.props.edit_Object.collectionId != this.props.edit_Object.cUserId){
            //collectionId  = this.props.edit_Object.cUserId;
        }

        const data = this.props.client.mutate({
            mutation: CREATE_RESOURCE_MUTATION ,
            variables: { UserId: parseInt(this.props.userId), fields: {title: this.state.title, directUrl: this.state.directUrl, type: "custom"}, collectionId: parseInt(collectionId), position: -1 },
          }).then(response => {

            console.log(response); 
            let r_id = response.data.createResource.id;

            const data = this.props.client.mutate({
                mutation: MOVE_RESOURCE_MUTATION ,
                variables: { ResourceId: parseInt(r_id), Position: -1, TargetCollectionId: parseInt(collectionId) },
              }).then(response => {
    
                console.log(response); 

                const newResource = {id: r_id, title: this.state.title, type: 'custom', collectionId: this.props.edit_Object.collectionId };

                
                this.onClose();

                this.props.formSubmit(newResource, 'create_resource');
                
              
                
              });
            
           
            
          });
        
    }

    handleTitle(event){
        this.setState({ title: event.target.value });
    }

    handleURL(event){
         this.setState({ directUrl: event.target.value });
     }

    handleEditTitle(event){
        this.setState(
            { edit_collection_title: event.target.value }
           
          );
    }

    handleColor= color => {
       this.setState({ color: color.hex });

       let colorId = this.props.edit_Object.cUserId;


        const data = this.props.client.mutate({
            mutation: UPDATE_COLLECTION_COLOR_MUTATION ,
            variables: { CollectionId: parseInt(colorId), CollectionFields:{"color": color.hex}},
          }).then(response => {

            console.log(response); 
            const newColor = {id: this.props.edit_Object.id, color: color.hex };

                this.props.formSubmit(newColor, 'edit_collection_color');
          });
    }

    handleClick = (e) => {
        if ( e.target.classList.contains("window-close") || e.target.classList.contains("window-wrapper") || e.target.classList.contains("action-modal") || e.target.classList.contains("button-title")) {
            e.preventDefault()
            this.onClose()
        }
    }

    editCollection (e){

        e.preventDefault();
        let col_color;

        if(this.props.edit_Object.color != this.state.color){
            col_color=this.state.color;
        }else{
            col_color=this.props.edit_Object.color;
        }

        let collectionId = this.props.edit_Object.id;

        if(this.props.edit_Object.id != this.props.edit_Object.cUserId){
           // collectionId  = this.props.edit_Object.cUserId;
        }


        const data = this.props.client.mutate({
            mutation: UPDATE_COLLECTION_MUTATION ,
            variables: { CollectionId: parseInt(collectionId), CollectionFields: {'title': this.state.edit_collection_title }},
          }).then(response => {


            const editedCollection = {id: this.props.edit_Object.id, cUserId: this.props.edit_Object.cUserId, title: this.state.edit_collection_title, resources: this.props.edit_Object.resources, writeAccess: true, color:this.state.color, published: this.state.isPublic };


                // no note update  if state note ===  props note
                // edit note
                // create note

                let noteBody;
                if(this.state.collectionData.notes!= null){
                    noteBody= this.state.collectionData.notes.body;
                }else{
                    noteBody = this.state.collectionData.notes
                }

                if(noteBody === this.state.noteBody){
                       // console.log('do nothing!');
                        this.props.formSubmit(editedCollection, 'edit_collection');
                        this.onClose();
                }

                else if(noteBody != this.state.noteBody && noteBody!= null){
                    //console.log('update notes! ' + this.state.noteBody);
                    const data = this.props.client.mutate({
                        mutation: UPDATE_NOTES_MUTATION ,
                        variables: {  body: String(this.state.noteBody),  noteId: parseInt(this.state.collectionData.notes.id) },
                      }).then(response => {
                        console.log(response);
                        this.props.formSubmit(editedCollection, 'edit_collection');
                        this.onClose();
                      });

                }else{
                    //console.log('add notes!');
                    const data = this.props.client.mutate({
                        mutation: CREATE_NOTES_MUTATION,
                        variables: {  body: String(this.state.noteBody) , collectionId: parseInt(collectionId),  userId: parseInt(this.props.userId) },
                      }).then(response => {
        
                        console.log(response);
                        this.props.formSubmit(editedCollection, 'edit_collection');
                        this.onClose();
                      });
                }
            
          });
        

        
    }

    editResource (e){
        e.preventDefault();

        let notesBody;
        if(this.state.resourceData.notes!= null){
            notesBody= this.state.resourceData.notes.body;
        }else{
            notesBody = this.state.resourceData.notes
        }

       // console.log('notesBody: ' + notesBody + '   this.state.noteBody:  ' + this.state.noteBody)

        if(notesBody === this.state.noteBody){
        //if(notesBody === this.state.noteBody){
                console.log('do nothing!');
                if(this.state.resourceData.type != 'custom'){this.onClose();}
        }

        else if(notesBody != this.state.noteBody && notesBody!= null){
           // console.log('update notes!');
            const data = this.props.client.mutate({
                mutation: UPDATE_NOTES_MUTATION ,
                variables: {  body: String(this.state.noteBody),  noteId: parseInt(this.state.resourceData.notes.id) },
              }).then(response => {
                console.log(response);
                if(this.state.resourceData.type != 'custom'){this.onClose();}
              });

        }else{
            //console.log('add notes!');
            const data = this.props.client.mutate({
                mutation: CREATE_NOTES_MUTATION,
                variables: {  body: String(this.state.noteBody) , resourceId: parseInt(this.props.edit_Object.id),  userId: parseInt(this.props.userId) },
              }).then(response => {

                console.log(response);
                if(this.state.resourceData.type != 'custom'){this.onClose();}
              });
        }

        if(this.state.resourceData.type === 'custom'){

        const data = this.props.client.mutate({
            mutation: UPDATE_RESOURCE_MUTATION ,
            variables: { ResourceId: parseInt(this.props.edit_Object.id), ResourceFields: {'title': this.state.edit_collection_title , "directUrl": this.state.directUrl}},
          }).then(response => {

            const editResource = {id: parseInt(this.props.edit_Object.id), title: this.state.edit_collection_title };
            this.onClose();
            this.props.formSubmit(editResource, 'edit_resource');

          });

        }

    }

    resourceNotes(){

    }

    deleteCollection(e){
        e.preventDefault();
        this.setState({alert: true});
    
    }

    deleteResource(e){
        e.preventDefault();

        this.setState({alert: true});
    
    }

    handleCollectionGroup(option){
            this.setState({moveCollection:option.target.value} )     
    }

    handleMoveToAnotherCollection(option){
        this.setState({moveCollection:option.target.value} )     
}

    moveCollection(){

        let moveTo = this.state.moveCollection;
        
        if(moveTo != ''){
            const movedCollection = {newGroup: moveTo, id: this.props.edit_Object.cUserId};
            this.onClose();
            this.props.formSubmit(movedCollection, 'move_Collection');
        }


        

    }

    moveResource(){
        let moveTo = this.state.moveCollection;
        
        if(moveTo != ''){
            const movedResource = {id: this.props.edit_Object.id, newColId: parseInt(moveTo), prevColId: parseInt(this.props.edit_Object.collectionId) };
            this.onClose();
            this.props.formSubmit(movedResource, 'move_Resource');
        }
    }

    confirmDelete(){
        if(this.props.modal_type  === 'edit_resource'){
            console.log('to delete ' + this.props.edit_Object.id);

            const data = this.props.client.mutate({
                mutation: DELETE_RESOURCE_MUTATION,
                variables: { id: parseInt(this.props.edit_Object.id)  },
              }).then(response => {
    
                console.log(response);
                this.props.formSubmit(this.props.edit_Object, 'delete_resource');
                this.onClose();
              });
            

        }else if(this.props.modal_type  === 'edit_collection'){

            let deleteId = this.props.edit_Object.id;
            
            if(this.props.edit_Object.id != this.props.edit_Object.cUserId){
                //deleteId = this.props.edit_Object.cUserId;
            }

            const data = this.props.client.mutate({
                mutation: REMOVE_COLLECTION_MUTATION,
                variables: { userId: parseInt(this.props.userId), collectionId: parseInt(deleteId)  },
              }).then(response => {
    
                console.log(response);
                this.props.formSubmit(this.props.edit_Object, 'delete_collection');
                this.onClose();
              });

            
        }
;
        
    }

    alert(){
        
        return(
            <div className="window-wrapper">
                <div className='window alert' >
                    { this.state.makepublic ?
                        <div>
                        <h4>Are you sure you want to publish this collection? Once published, it can be deleted, but not unpublished.</h4>
                        <button className="btn delete" type="submit" onClick={this.onClose}>Deny</button>
                        <button className="btn save" type="submit" onClick={this.makeCollectionPublic}>Make public</button>
                        </div>

                        :
                        <div>
                        <h4>Are you sure?</h4>
                        <button className="btn delete" type="submit" onClick={this.onClose}>Deny</button>
                        <button className="btn save" type="submit" onClick={this.confirmDelete}>Proceed</button>
                        </div>
                    }
                </div>
            </div>
        )
    }

    makeCollectionPublic(){
        const data = this.props.client.mutate({
            mutation: UPDATE_COLLECTION_MUTATION ,
            variables: { CollectionId: parseInt(this.props.edit_Object.id), CollectionFields: {'published': true }},
          }).then(response => {

            console.log(response); 
            this.props.formSubmit({id: this.props.edit_Object.id }, 'make_public');
            this.onClose();

          });
    }

    getCollectionInfo(id, title){
        this.setState({
            edit_collection_title: title
        });

        const data = this.props.client.query({
            query: COLLECTION_QUERY,
            variables: { CollectionId: parseInt(id)  },
          }).then(response => {

            console.log(response);
          });

    }

    onNoteChange(id, content){
        this.setState({ notes: content});
    }

    handleNoteChange(data){
        this.setState({noteBody: data})
      }


    handleMakePublic = () => {
        this.setState({alert: true, makepublic: true});
        
    }

    onTagsChange = (tags, changed) => {

        let addOrDelete = tags.indexOf(changed[0])

        let collectionId = this.props.edit_Object.id;

        if(this.props.edit_Object.collectionId != this.props.edit_Object.cUserId){
            //collectionId  = this.props.edit_Object.cUserId;
        }

         // save tag
            const data = this.props.client.mutate({
                mutation: UPDATE_TAGS_MUTATION ,
                variables: { CollectionId: parseInt(collectionId ),  "CollectionFields": {"tags": tags }  },
              }).then(response => {
    
                console.log(response); 
                this.setState({tags: tags, loading: false},
                    () => this.ViewForm() );
                
                
              });

        if (addOrDelete != -1) {
          
        }

        if (addOrDelete === -1) {
            // delete tag
           // deleteCollectionTag(this.props.channel, this.props.id, changed[0])
        }
    }

    createNotes(){
        if(this.state.collectionData.notes!= null){

          


        }else{
            //console.log(this.state.noteBody)
            //console.log(parseInt(this.props.edit_Object.id))
            //console.log(parseInt(this.props.userId))

            //mutation createNote($body: String!, $userId: Int, $collectionId: Int, $resourceId: Int){
            const data = this.props.client.mutate({
                mutation: CREATE_NOTES_MUTATION,
                variables: {  body: this.state.noteBody , collectionId: parseInt(this.props.edit_Object.id),  userId: parseInt(this.props.userId) },
              }).then(response => {

                console.log(response);

 
              });
        }
    }

   
    ViewForm(){


        if(this.props.modal_type === 'edit_collection' && !this.state.loading){
           
            let permalink;
            this.state.loading = true;

            let collectionId = this.props.edit_Object.id;
           
            if(this.props.edit_Object.id != this.props.edit_Object.cUserId){
                //collectionId  = this.props.edit_Object.id;


            }

           
            
            const data = this.props.client.query({
                query: COLLECTION_QUERY,
                variables: { CollectionId: parseInt(collectionId)  },
                fetchPolicy:'network-only'
              }).then(response => {
                
                console.log(response);
                let noteBody;

                if(response.data.collections[0]){
                    if(response.data.collections[0].notes){
                        noteBody = response.data.collections[0].notes.body
                    }else{
                        noteBody = null
                    }
                }
                

                


                this.setState({
                    edit_collection_title: response.data.collections[0].title, 
                    collectionData: response.data.collections[0], 
                    tags: response.data.collections[0].tags,
                    notes: noteBody, 
                    noteBody: noteBody,
                    color: this.props.edit_Object.color,
                   isPublic:response.data.collections[0].published
                });

                permalink = response.data.collections[0].permalink;

            
              });

              

        }
        let resourceData 
        if(this.props.modal_type === 'edit_resource' && !this.state.loading){
          
        
           var subjectsArray;
           
           const data = this.props.client.query({
               query: RESOURCE_QUERY,
               variables: { ResourceId: parseInt(this.props.edit_Object.id)  },
               fetchPolicy:'network-only'
             }).then(response => {
               
               console.log(response);
                this.state.loading = true;
               resourceData = response.data.resources[0];

               let noteBody;
                if(response.data.resources[0].notes){
                    noteBody = response.data.resources[0].notes.body
                }else{
                    noteBody = null
                }
               this.setState({resourceData:resourceData, edit_collection_title: resourceData.title, directUrl: resourceData.directUrl, noteBody: noteBody})

               //console.log(response.data.resources[0].subject)
               let subjects = String(response.data.resources[0].subject);

               subjectsArray =  subjects.split(';');
               //console.log(subjectsArray);

               if(subjectsArray.length === 1 ){

                let subjects = String(subjectsArray);

                subjectsArray =  subjects.split(',');

               }


               this.setState({subjectsArray: subjectsArray});
               


             });



        }
    let groupsArray = [];
        if(this.props.modal_type === 'edit_collection' ){
             

            for (var i = 0; i < this.props.collectionGroups.length; i++) {
                if (this.props.collectionGroups[i]['name'] != this.props.collectionGroup  ) {
                    groupsArray.push( this.props.collectionGroups[i]['name']  )
                }
            }


        var localTime  = moment.utc( this.state.collectionData.updatedAt  ).toDate();
        localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

        }


       

        
        let collectionsArray = [];
        if(this.props.modal_type === 'edit_resource' ){
                

            for (var i = 1; i < this.props.currentCollections.length; i++) {
                //console.log(this.props.currentCollections[i]['cUserId']);
                if (this.props.currentCollections[i]['cUserId'] != this.props.edit_Object.cUserId  && this.props.currentCollections[i]['writeAccess'] ) {
                    let collectionObject = {title: this.props.currentCollections[i]['title'] , id: this.props.currentCollections[i]['id'] }
                    collectionsArray.push(collectionObject )
                }
            }


        }

        

       

        





        return(
            <div className="window-wrapper" onClick={this.handleClick} >
                <div className={'window '+ this.props.modal_type} >


                    <button className="window-close" onClick={ this.onClose  }>&times;</button>

                    <div className={this.props.modal_type+"-form"} >

                    {
                    this.props.modal_type === 'create_collection' ? 

                        
                            <form onSubmit={ this.createCollection}>
                                <div className={this.props.modal_type+"-container"}>
                                    <h2 className={"resource-title blue-text"}> Create Collection </h2>
                                    <label>Title <span className="required">*</span></label>
                                    <input type="text" className="full-width" name="add-collection-title" onChange={ this.handleTitle.bind(this )   }   autoComplete="off" required={true} placeholder="Title" ref={this.focusInputField}/>
                                    
                                    
                                </div>
                                <div className="controls">
                                    <button className="btn save" onClick={this.createCollection} type="submit">Create</button>
                                </div>

                                
                                
                            </form>
                       

                    : '' }


{
                    this.props.modal_type === 'create_resource' ? 

                        
                            <form >
                                <div className={this.props.modal_type+"-container"}>
                                    <h2 className={"resource-title blue-text"}> Create Resource </h2>
                                    <label>Title <span className="required">*</span></label>
                                    <input type="text" className="full-width" name="add-collection-title" onChange={ this.handleTitle.bind(this )   }   autoComplete="off" required={true} placeholder="Title" ref={this.focusInputField}/>
                                    <label>Direct link <span className="required">*</span></label>
                                    <input type="text" className="full-width" name="add-url-title" onChange={ this.handleURL.bind(this )   }   autoComplete="off" required={true} placeholder="Direct URL" />
                                    
                                    
                                </div>
                                <div className="controls">
                                    <button className="btn save" onClick={this.createResource} type="submit">Create</button>
                                </div>

                                
                                
                            </form>
                       

                    : '' }

                 

                    {
                       
                       
                    this.props.modal_type === 'edit_collection' ? 

                       
                            <form>
                                <div className={this.props.modal_type+"-container"}>

                                    <div className="window-left" style={{"maxHeight":(( window.innerHeight -   300 ) + "px" )}}>
                                       
                                        
                                        {
                                        this.props.edit_Object.writeAccess ? 

                                        <div>
                                        <label  className="blue-text">Collection Title <span className="required">*</span></label>
                                        <input type="text" className="full-width" name="edit-collection-title"  onChange={  this.handleEditTitle.bind(this )   } value={this.state.edit_collection_title} id={'edit-collection' + this.props.edit_Object.id} />

                                        <p className="time-info">Created on: <b className="blue-text"><Moment  format="D MMM YYYY">{this.state.collectionData.insertedAt}</Moment></b> | Last updated: <b  className="blue-text"> <Moment  fromNow>{localTime}</Moment> </b> </p>

                                        
                                        <label  className="blue-text">Notes</label>
                                        
                                       
                                        
                                        

                                        <CKEditor
                                            editor={ ClassicEditor }
                                            data={
                                                this.state.collectionData.notes != null
                                                ? this.state.collectionData.notes.body
                                                : ""
                                                }
                                            onInit={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                //console.log( 'Editor is ready to use!', editor );
                                            } }
                                            onChange={ ( event, editor ) => {
                                                const data = editor.getData();
                                                this.handleNoteChange(data);
                                                //console.log( { event, editor, data } );
                                            } }
                                            onBlur={ ( event, editor ) => {
                                               // console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                               // console.log( 'Focus.', editor );
                                            } }
                                        />

                                    <label className="blue-text">Tags</label>
                                    <Tags
                                        data={this.state.collectionData.tags || []}
                                        onChange={this.onTagsChange}
                                    />

                                      


                                        </div>

                                        :
                                        <div>
                                        
                                        <h3 className="blue-text">{this.state.edit_collection_title}</h3>
                                        <p className="time-info">Created on: <b className="blue-text"><Moment  format="D MMM YYYY">{this.state.collectionData.insertedAt}</Moment></b> | Last updated: <b  className="blue-text"><Moment  fromNow>{this.state.collectionData.updatedAt}</Moment></b> </p>
                                        
                                        
                                        <label className="blue-text">Notes</label>

                                        
                                        
                                        
                                       
                                       
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

                                       

                                       

                                      


                                       
                                         <Tags data={this.state.collectionData.tags || []} onChange={() => { return false }} disabled={true} />
                                        </div>

                                        

                                        }

                                        { this.state.collectionData.resources ?
                                        
                                           
                                         <Accordion title="View Citations">
                                            <Citation data={this.state.collectionData.resources} />
                                        </Accordion>
                                    
                                            : ''
                                        }

                                        

                                       


                                       
    
                                        
                                    </div>

                                    <div className="window-right">

                                    {this.props.index != 0 && (
                                <Accordion title="Share">
                                    {this.props.edit_Object.writeAccess ? (
                                        <div>
                                            {this.props.edit_Object.published ?
                                             <div>
                                                 <label className="makepublic sub-title">Published
                                                     <br />
                                                     <span className="make-public-small">
                                                         A published collection is findable from the search bar, where other users will be able to view, clone, or import them. Publishing cannot be undone.
                                                     </span>
                                                 </label>
                                             </div>
                                            :
                                             <div>
                                                 <label className="makepublic inline" htmlFor="makepublic">
                                                     Publish: <input
                                                                  type="checkbox"
                                                                  id="makepublic"
                                                                  className="make-public-checkbox"
                                                                  onChange={this.handleMakePublic}
                                                                  checked={this.state.collectionData.published  ? this.state.collectionData.published : false}
                                                                 
                                                     />
                                                     <br />
                                                     <span className="make-public-small">
                                                         Publishing makes collections findable from the search bar, where other users will be able to view, clone, or import them. Publishing cannot be undone.
                                                     </span>
                                                 </label>
                                             </div>
                                            }
                                        </div>
                                    ) :
                                     <div>
                                         <label className="makepublic sub-title">Published
                                             <br />
                                             <span className="make-public-small">
                                                 A published collection is findable from the search bar, where other users will be able to view, clone, or import them. Publishing cannot be undone.
                                             </span>
                                         </label>
                                     </div>
                                    }

                                    <label>
                                        <a
                                            href={"/c/" +  this.state.collectionData.permalink}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            PermaLink
                                        </a>
                                    </label>
                                    <input
                                        className="add-text exp close full-width"
                                        type="text"
                                        readOnly={true}
                                        value={ this.state.collectionData.permalink ? this.state.collectionData.permalink : ''}
                                    />
                                    
                                  
                                </Accordion>
                            )}


                                    <Accordion title="Collection Color">
                                <CirclePicker
                                    width={"100%"}
                                    colors={[
                                        "#fbc3bf",
                                        "#e2a0b7",
                                        "#f0baf9",
                                        "#ccb4f7",
                                        "#b7c0f5",
                                        "#a8d6fb",
                                        "#c7e8f7",
                                        "#c5eff5",
                                        "#78f7eb",
                                        "#b0f3b3",
                                        "#cef79f",
                                        "#f2fb98",
                                        "#ffeb3b",
                                        "#f9c732",
                                        "#f7bf6e",
                                        "#f59374",
                                        "#c7d8e0",
                                        "#d8d8d8"
                                    ]}
                                    onChangeComplete={this.handleColor}
                                />
                            </Accordion>

                            

                            <Accordion title="Move Collection">
                                <div>

                                <select id="collectionGroups" onChange={this.handleCollectionGroup } >
                                <option value='' >Select a collection Group</option>


                                    { groupsArray.map( (collections_group, index) => {



                                            return (

                                               

                                                <option value={collections_group} key={index}>{collections_group}</option>

                                               
                                            )

                                   
                                
                                        })
                                    }

                                    </select>

                                    {this.state.moveCollection ?

                                    <button className="btn save" onClick={this.moveCollection}>Move Collection</button>
                                    : ''
                                    }
                                    


                                </div>

                           

                              
                            </Accordion>

                           

                                    </div>
                                    
                                    
                                </div>
                                <div className="controls">

                                    
                                    <button className="btn delete" onClick={this.deleteCollection}>Delete</button>
                                    {
                                        this.props.edit_Object.writeAccess ? 
                                    <button className="btn save" type="submit" onClick={this.editCollection}>Save</button>
                                    :
                                    <button className="btn save" type="submit" onClick={this.onClose}>Save</button>
                                    }
                                    
                                
                                </div>
                                
                            </form>




                       

                    : '' }




{
                    this.props.modal_type === 'edit_resource' && this.state.loading ? 

                       
                            <form>
                                <div className={this.props.modal_type+"-container"}>

                                    <div className="window-left" style={{"maxHeight":(( window.innerHeight -   300 ) + "px" )}}>
                                       
                                        <label  className="blue-text">Resource Title</label>

                                        {this.state.resourceData.type === 'custom'  ? 
                                        
                                        <div>

                                        <input type="text" className="full-width" name="edit-collection-title"  onChange={  this.handleEditTitle.bind(this )   } value={this.state.edit_collection_title} id={'edit-collection' + this.props.edit_Object.id} />

                                        <label  className="blue-text">Direct link</label>
                                             <input type="text" className="full-width" name="add-url-title" onChange={ this.handleURL.bind(this )   }   autoComplete="off" required={true} placeholder="Direct URL" value={this.state.directUrl} />

                                        </div>
                                        :

                                        <h3><span className="blue-text">{this.state.resourceData.title}</span> <i>{this.state.resourceData.date}</i></h3>

                                        }


                                    
                                       
                                       
                                        



                                        <p><i>{this.state.resourceData.isPartOf}</i></p>

                                        <label  className="blue-text">Notes</label>

                                       

                                        <CKEditor
                                            editor={ ClassicEditor }
                                            disabled={!this.props.edit_Object.canEdit}
                                            data={
                                                this.state.resourceData.notes != null
                                                ? this.state.resourceData.notes.body
                                                : ""
                                                }
                                            onInit={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                //console.log( 'Editor is ready to use!', editor );
                                            } }
                                            onChange={ ( event, editor ) => {
                                                const data = editor.getData();
                                                this.handleNoteChange(data);
                                                //console.log( { event, editor, data } );
                                            } }
                                            onBlur={ ( event, editor ) => {
                                                //console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                                //console.log( 'Focus.', editor );
                                            } }
                                        />


                                        <Accordion
                                            title={"Item Info"}
                                            titleClass={"more-info"}
                                        >
                                            {this.state.resourceData.creator && (
                                                <div>
                                                    <h4 className="more-info">Author(s):</h4>
                                                    <ul className={"subjects"}>
                                                        {this.state.resourceData.creator.map((subject, index) => (
                                                            <li key={"subjects-" + subject + "-" + index}>
                                                                <a href= {"/search?query=" + subject}>
                                                                    {subject}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {this.state.subjectsArray && (
                                                <div>
                                                    <h4 className="more-info">Subject(s):</h4>
                                                    <ul className={"subjects"}>
                                                        {this.state.subjectsArray.map((subject, index) => (
                                                            <li key={"subjects-" + subject + "-" + index}>
                                                                <a href= {"/search?query=" + subject}>
                                                                    {subject}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {this.state.resourceData.description && (
                                                <div>
                                                    <h4 className="more-info">Description:</h4>
                                            
                                                    {this.state.resourceData.description}
                                                </div>
                                            )}

                                            {this.state.resourceData.publisher && (          
                                                <div>
                                                    <h4 className="more-info">Publication:</h4>
                                            
                                                    {this.state.resourceData.publisher}
                                                </div>
                                            )}
                                        </Accordion>
                                        <Accordion title={"Citations"} titleClass={"more-info"}>
                                            <Citation data={this.state.resourceData} />
                                        </Accordion>


                                        
                                    </div>

                                    <div className="window-right">

                                    {this.state.resourceData.catalogUrl  ?  
                                    <a
                                            title="Go To Link"
                                            className="resource-box-link btn full-widt btn goto"
                                            target="_blank"
                                            href={ 
                                                !this.state.resourceData.catalogUrl.match(/^[a-zA-Z]+:\/\//) ?
                                                    "//" + this.state.resourceData.catalogUrl : this.state.resourceData.catalogUrl }
                                        >
                                            Go To Resource
                                        </a>

                                        :

                                        ''}

                                    {this.state.resourceData.directUrl  ?  
                                    <a
                                            title="Go To Link"
                                            className="resource-box-link btn full-width btn goto"
                                            target="_blank"
                                            href={ 
                                                !this.state.resourceData.directUrl.match(/^[a-zA-Z]+:\/\//) ?
                                                    "//" + this.state.resourceData.directUrl : this.state.resourceData.directUrl }
                                        >
                                            Go To Resource
                                        </a>

                                        :

                                        ''}

                                {this.props.edit_Object.canEdit ?

                                <Accordion title="Move Resource">
                                <div>

                                <select id="collectionGroups" onChange={this.handleMoveToAnotherCollection } >


                                <option value='' >Select a collection</option>


                                    { collectionsArray.map( (collection, index) => {



                                            return (

                                               

                                                <option value={collection.id} key={index}>{collection.title}</option>

                                               
                                            )

                                   
                                
                                        })
                                    }

                                    </select>

                                    {this.state.moveCollection ?

                                    <button className="btn save" onClick={this.moveResource}>Move Resource</button>
                                    : ''
                                    }
                                    


                                </div>

                           

                              
                            </Accordion>

                            : ''}





                                    </div>
                                    
                                    
                                </div>
                                {this.props.edit_Object.canEdit ?
                                <div className="controls">

                                    
                                   
                                    <button className="btn delete" onClick={this.deleteResource}>Delete</button>
                                   
                                    <button className="btn save" onClick={this.editResource} type="submit">Save</button>
                                   
                                    
                                
                                </div>
                                : ''
                                 }
                                
                            </form>




                       

                    : '' }

                    </div>




                </div>
            </div>
        )
    }

    render() {
       

        return (


            <div className="modals">
                 {
                    
                    this.props.open_modal && !this.state.alert ?
                        this.ViewForm()
                        :
                        ''
                }

                {
                    this.state.alert ?
                    this.alert()
                    :
                    ''

                }

            </div>

            
            
        )
    }
}

export default withApollo(CollectionsModal)