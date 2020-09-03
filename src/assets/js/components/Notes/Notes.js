import React, { Component } from "react"
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import RichTextEditor from '../Collections/RichTextEditor'
import '../../../scss/Notes.scss'
import Note from './Note'
import NotesModal from './NotesModal'
import Masonry from 'react-masonry-css'


const NOTES_QUERY = gql`
  query UserQuery($UserId: Int!) {
    
     

      
        users(id:$UserId) {
          fullname
          notes {
            id
            body
            title
            updatedAt

          }
          collections {
            id
            title
            permalink
            creator
            notes {
              id
              body
              insertedAt
              updatedAt
              title
              

            }
            resources {
              id
              title
              catalogUrl
              directUrl
              notes {
                id
                body
                insertedAt
                updatedAt
                title
              }
            }
          }
          resources {
            id
            title
            catalogUrl
             directUrl
            notes {
              id
              body
              insertedAt
              updatedAt
              title
            }
          }
        }
      
    
  }
`

class Notes extends Component {

    _isMounted = false;

    constructor(props){
      
      super(props);

      this.state = {
        notes: [],
        isloaded: false,
        openModal: false,
        noteObject: {},
        modal_type: '', 
        tileLayout: true
      }

      this.getNotes = this.getNotes.bind(this);
      this.openNotesModal = this.openNotesModal.bind(this);
      this.closeNotesModal = this.closeNotesModal.bind(this);
      this.formSubmit = this.formSubmit.bind(this);
      this.toggleLayout = this.toggleLayout.bind(this);

      this.modalElement = React.createRef();
      //this.searchFilterElement = React.createRef();

     
    }
    componentDidMount() {


        this._isMounted = true;
        //let isloaded = false;

        if(this._isMounted && this.props.userId ){
         // console.log(this.props.userId);
          this.getNotes();
        

      }


      if(window.innerWidth < 960){
        this.props.openMobile();
      }
      var myDiv = document.getElementById('content');
  
      myDiv.scrollTop = 0;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    formSubmit(){
      this.getNotes();
    }

    toggleLayout(){
      this.setState(prevState => ({
        tileLayout: !prevState.tileLayout
      }));
    }

    openNotesModal(formType, noteObject){
      this.setState({
        open_modal: true,
        noteObject: noteObject,
        modal_type: formType});

      document.getElementById("root").style.position = "fixed";
    }

  
    closeNotesModal(){
      this.setState({
        open_modal:false, 
        noteObject: {}, 
        modal_type: ''});
      document.getElementById("root").style.position = "relative";

    }

    getNotes(){
      const  { data, error, loading, refetch, networkStatus } = this.props.client.query({
        query: NOTES_QUERY,
        variables: { UserId: parseInt(this.props.userId)  },
        fetchPolicy:'network-only'
      }).then(response => {

        if (this._isMounted) {

          this.setState({isloaded: true},
          () => {
            console.log(response);
            let notesArray = [];
            for(let i=0; i < response.data.users[0].collections.length; i++){
                //console.log(response.data.users[0].collections[i].notes)
                let notesInfo = response.data.users[0].collections[i].notes;
              
                //console.log('collection creator: ' + response.data.users[0].collections[i].creator)
                if(notesInfo && response.data.users[0].collections[i].creator === this.props.userEmail){



                  let orginInfo = {orginId: response.data.users[0].collections[i].id, orginTitle: response.data.users[0].collections[i].title, orginPermalink: response.data.users[0].collections[i].permalink, orginType: 'collection'  };
                  
                  let note = {
                    ...notesInfo,
                    ...orginInfo
                };
                  
                  notesArray.push(note);
                }
  
               
                for(let j=0; j < response.data.users[0].collections[i].resources.length; j++){
                    
                  
                  if(response.data.users[0].collections[i].resources[j].notes){

                    let r_permalink = response.data.users[0].collections[i].resources[j].catalogUrl;

                    if(response.data.users[0].collections[i].resources[j].directUrl){
                      r_permalink = response.data.users[0].collections[i].resources[j].directUrl;
                    }

                    let resourceInfo = {orginId: response.data.users[0].collections[i].resources[j].id, orginTitle: response.data.users[0].collections[i].resources[j].title, orginPermalink: r_permalink, orginType: 'resource' };

                    let resourceNote = {
                      ...response.data.users[0].collections[i].resources[j].notes,
                      ...resourceInfo
                  };

                    notesArray.push(resourceNote);
                  }
                  
                 
                }

                
               
                
              }

              for(let i=0; i < response.data.users[0].notes.length; i++){
                let customNoteInfo = {
                  orginId: response.data.users[0].notes[i].id, 
                  id: response.data.users[0].notes[i].id, 
                  orginTitle: response.data.users[0].notes[i].title, 
                  body:response.data.users[0].notes[i].body,  
                  orginType: 'note',  
                  updatedAt: response.data.users[0].notes[i].updatedAt};
                notesArray.push(customNoteInfo);
              }

              notesArray.sort(function(a, b){
                var dateA=new Date(a.updatedAt), dateB=new Date(b.updatedAt)
                return dateB-dateA //sort by date ascending
            })
              this.setState({notes: notesArray});
          }


          
        );

      }

        
       //console.log(response.data.users[0].collections);
   
         
          

      })
    }

    setNotes(){

      const breakpointColumnsObj = {
        default: 3,
        960: 2,
        500: 1
      };



      return (
        <section id="notes" >


      { this.state.tileLayout === true ? 

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">

              { this.state.notes? 
                  this.state.notes.map((note, index) => {
                      return (
                        
                          <Note
                              key={"key-"+note.id}
                              index={index}
                              id={note.id}
                              body={note.body}
                              orginId={note.orginId}
                              orginTitle={note.orginTitle}
                              orginPermalink={note.orginPermalink}
                              updatedAt={note.updatedAt}
                              orginType={note.orginType}
                              openNotesModal={this.openNotesModal}
                          />
                      )
                    
                  })
                  : ''
                   }

          </Masonry>  
          
          :

          <div className="line-layout">
             { this.state.notes? 
                  this.state.notes.map((note, index) => {
                      return (
                        
                          <Note
                              key={"key-"+note.id}
                              index={index}
                              id={note.id}
                              body={note.body}
                              orginId={note.orginId}
                              orginTitle={note.orginTitle}
                              orginPermalink={note.orginPermalink}
                              updatedAt={note.updatedAt}
                              orginType={note.orginType}
                              openNotesModal={this.openNotesModal}
                          />
                      )
                    
                  })
                  : ''
                   }



          </div>

          }
       </section>


      )


    }


    render() {
        return (
            <div>
              <header id="notes-header">
                  
                  <div>
                    <h2 className="blue-text">Notes</h2> 
                    <a id="layoutToggle" onClick={this.toggleLayout} className={this.state.tileLayout ? 'tile' : 'line'} title="Toggle layout">
                      <span id="tile">Tile layout</span>
                      <span id="line">Line layout</span>


                    </a>
      
    
                  </div>
                  <button id="create" onClick={this.openNotesModal}>+ Create Note</button>
    
              </header>
             

                {this.setNotes()}

                <NotesModal open_modal={this.state.open_modal} closeNotesModal={this.closeNotesModal}  noteObject={this.state.noteObject} modal_type={this.state.modal_type}  formSubmit={this.formSubmit} userId={this.props.userId} ref="child"/>
    

              
              
         
          </div>

        ) 
    }
}

export default withApollo(Notes)