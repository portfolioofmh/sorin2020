import React, { Component } from "react"
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment/min/moment-with-locales';




const CREATE_NOTES_MUTATION = gql`
    mutation createNote($body: String!, $userId: Int, $title:String){
    createNote(body: $body, userId: $userId, title: $title){
        id
        body
    	title
        
    }
}
`


const UPDATE_NOTES_MUTATION = gql`
    mutation updateNote($body: String!, $noteId: ID!, $noteTitle: String ){
    updateNote(body: $body, id: $noteId, title: $noteTitle){
        id
        body
    }
    }
`

const DELETE_NOTES_MUTATION = gql`
   mutation deleteNote($noteId: ID!){
    deleteNote(id: $noteId){
    id
  }
}
`

const GET_NOTE_QUERRY = gql`
   query NoteQuery($noteId: Int){
    note(id: $noteId){
    id
    title
    body

  }
}
`

class NotesModal extends Component {
    _isMounted = false;
 

  constructor(props){
      
    super(props);

    this.state = {
      NoteBody: '',
      loading:false,
      NoteTitle: '',
      alert:false

    }

    this.handleChange = this.handleChange.bind(this);
    this.onClose = this.onClose.bind(this);

    this.ViewForm = this.ViewForm.bind(this);
    this.editNote = this.editNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.getTitle = this.getTitle.bind(this);

  }

  handleClick = (e) => {
        if ( e.target.classList.contains("window-close") || e.target.classList.contains("window-wrapper") || e.target.classList.contains("action-modal") || e.target.classList.contains("button-title")) {
            e.preventDefault()
            this.onClose()
        }
    }

    onClose(){
        this.setState({
            NoteBody: '',
            loading: false,
            NoteTitle: '',
            alert: false
        });
        this.props.closeNotesModal();
    }

  handleChange(data){
    this.setState({NoteBody: data})
  }

  handleNoteTitle(event){
    this.setState({ NoteTitle: event.target.value });
  }

  componentDidMount() {
    this._isMounted = true;

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  editNote (e){
    e.preventDefault();
    let notesBody = this.props.noteObject.body;

    let getNoteTitle = this.state.NoteTitle;

    if(getNoteTitle === undefined || getNoteTitle === ''){
        getNoteTitle = this.props.noteObject.orginTitle;
    }


    let getNoteBody = this.state.NoteBody;

    if(getNoteBody === undefined || getNoteBody === ''){
        getNoteBody = this.props.noteObject.body;
    }

    

   // if(this.state.NoteBody != undefined ){
        console.log('update notes!');

       


        const data = this.props.client.mutate({
            mutation: UPDATE_NOTES_MUTATION ,
            variables: {  body: String(getNoteBody),  noteId: parseInt(this.props.noteObject.id), noteTitle: getNoteTitle},
          }).then(response => {
            console.log(response);
            this.onClose();
            this.props.formSubmit();
          });

          /*
    }else{
        console.log('do nothing');
        this.onClose();
    }
    */
        
  }

  createNote(e){
    e.preventDefault();

    if(this.state.NoteBody != ''){
        const data = this.props.client.mutate({
            mutation: CREATE_NOTES_MUTATION ,
            variables: {  body: String(this.state.NoteBody),  userId: parseInt(this.props.userId), title: this.state.NoteTitle },
          }).then(response => {
            console.log(response);


            this.onClose();
            this.props.formSubmit();
          });
    }else{
        console.log('do nothing');
        this.onClose();
    }
  }

  deleteNote(e){
    e.preventDefault();

    this.setState({alert: true});

    }

    confirmDelete(){
        
            console.log('to delete ' + this.props.noteObject.id);

            const data = this.props.client.mutate({
                mutation: DELETE_NOTES_MUTATION,
                variables: { noteId: parseInt(this.props.noteObject.id)  },
            }).then(response => {

                console.log(response);
                //this.props.formSubmit(this.props.edit_Object, 'delete_resource');
                this.props.formSubmit();
                this.onClose();
            });
            

        
    }


    alert(){
        
        return(
            <div className="window-wrapper">
                <div className='window alert' >
                    
                        <div>
                        <h4>Are you sure?</h4>
                        <button className="btn delete" type="submit" onClick={this.onClose}>Deny</button>
                        <button className="btn save" type="submit" onClick={this.confirmDelete}>Proceed</button>
                        </div>
                    
                </div>
            </div>
        )
    }

    getTitle(){
       

            const  { data, error, loading, refetch, networkStatus } = this.props.client.query({
                query: GET_NOTE_QUERRY,
                variables: { noteId: parseInt(this.props.noteObject.id)  },
                fetchPolicy:'network-only'
              }).then(response => {
                console.log(response)
                let noteTitle = response.data.note.title;
                if(!noteTitle){
                    noteTitle = this.props.noteObject.orginTitle;
                }
                this.setState({NoteTitle: noteTitle, NoteBody: response.data.note.body})

              }

              );
        
      
        
    }

  ViewForm(){

  
    //this.state.NoteBody = this.props.noteObject.body;

    //this.setState({NoteBody: this.props.noteObject.body})

    //console.log(this.props.modal_type);

    var localTime;
    var localTime2;

    if( (this.props.modal_type  === 'edit_note' && this.state.NoteTitle === undefined) ||  (this.props.modal_type  === 'edit_note' && this.state.NoteTitle === '')){
        this.getTitle();
       
    }

    if(this.props.modal_type  === 'edit_note' ){
        localTime  = moment.utc(  this.props.noteObject.updated  ).toDate();
        localTime2 = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

        console.log(this.props.noteObject.updated);
        console.log(localTime);

    }


    
    


    


    


    return(
        <div className ="notes-container">

{
                
                this.props.modal_type  === 'edit_note' ?

               

           
                <form onSubmit={ this.editNote}>
                    <div className="edit_resource-container">
                        
                        <div className="window-left">
                            <label className="blue-text">Edit Note</label>
                            {this.props.noteObject.orginType != 'note'  ? 
                            <h4 className="blue-text">{this.props.noteObject.orginTitle}</h4>

                            : 
                            <div>
                          
                                <input type="text" className="full-width" name="note-title" onChange={  this.handleNoteTitle.bind(this )   } value={this.state.NoteTitle} id='noteTitle' />
                            </div>
                            }
                            <p><i>Last updated:    <Moment  fromNow>{localTime2}</Moment></i></p>

                                <CKEditor
                                    editor={ ClassicEditor }
                                    data={this.props.noteObject.body}
                                    onInit={ editor => {
                                        // You can store the "editor" and use when it is needed.
                                        //console.log( 'Editor is ready to use!', editor );
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        this.handleChange(data);
                                        //console.log( { event, editor, data } );
                                    } }
                                    onBlur={ ( event, editor ) => {
                                       // console.log( 'Blur.', editor );
                                    } }
                                    onFocus={ ( event, editor ) => {
                                        //console.log( 'Focus.', editor );
                                    } }
                                />
                        </div>
                        {this.props.noteObject.orginType != 'note'  ?            
                        <div className="window-right">

                        {this.props.noteObject.orginType === 'resource'  ?  
                            <a
                                    title="Go To Link"
                                    className="resource-box-link btn full-widt btn goto"
                                    target="_blank"
                                    href={ 
                                        !this.props.noteObject.orginPermalink.match(/^[a-zA-Z]+:\/\//) ?
                                            "//" + this.props.noteObject.orginPermalink : this.props.noteObject.orginPermalink }
                                >
                                    Go To Resource
                                </a>

                                :

                                ''}

                            {this.props.noteObject.orginType === 'collection'  ?  
                            <a
                                    title="Go To Link"
                                    className="resource-box-link btn full-widt btn goto"
                                    target="_blank"
                                    href={'/c/' + this.props.noteObject.orginPermalink }        
                                >
                                    Go To Collection
                                </a>

                                :

                                ''}
            
                            
                        </div>
                        : ''}
                        
                        

                    </div>
                        
                            
                    <div className="controls">
                    <button className="btn delete" onClick={this.deleteNote}>Delete</button>
                    
                        <button className="btn save" type="submit" onClick={this.editNote}>Save</button>
                    </div>

                </form>

                 

                :


                <form onSubmit={this.createNote}>
                    <div className="create-note-container">

                        

                        <h3 className="blue-text">Create Note</h3>

                        <label  className="blue-text">Note Title</label>
                        <input type="text" className="full-width" name="note-title"  onChange={  this.handleNoteTitle.bind(this )   }  id='noteTitle' />

                            <CKEditor
                                editor={ ClassicEditor }
                                data=""
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                   // console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    this.handleChange(data);
                                    //console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    //console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    //console.log( 'Focus.', editor );
                                } }
                            />
                            </div> 
                            <div className="controls">
                    
                                <button className="btn save" type="submit" onClick={this.createNote}>Save</button>
                            </div>
                    
                    
                    </form>

                    }


        </div>
       

    )

  }

  render(){


    return (


        <div className="modals">
             {
                
                this.props.open_modal ?
                <div className="window-wrapper" onClick={this.handleClick} >
                    <div className='window' >


                        <button className="window-close" onClick={ this.onClose  }>&times;</button>

                        {this.ViewForm()}


                    </div>
                </div>
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
export default withApollo(NotesModal);