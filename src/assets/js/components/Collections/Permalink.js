import React, { Component } from "react"
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
//import RichTextEditor from './RichTextEditor'
import PermalinkResource from './PermalinkResource'
import '../../../scss/Permalink.scss'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Moment from 'react-moment';



const COLLECTION_QUERY = gql`
    query CollectionQuery($permalink: String) {
      collections(permalink:$permalink) {
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
        clonesCount
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

class Permalink extends Component {

    _isMounted = false;

    constructor(props){
      
      super(props);

      this.state = {
       data: {}

      }
     
      

     
    }
    componentDidMount() {

        this._isMounted = true;

        
        if(this.props.match.params.collection_url){

            const data = this.props.client.query({
                query: COLLECTION_QUERY,
                variables: { permalink: this.props.match.params.collection_url},
                fetchPolicy:'network-only'
              }).then(response => {
                
                console.log(response.data);

                this.setState({data:response.data.collections[0]});


               

                //console.log(this.state.collectionData.resources);


              });



        }
    }

    renderCollection = () => {
        let data = this.state.data
        //console.log(data)

        if(data === undefined){
            return(
                <h3>No Collection Found.</h3>
            )
        }

        if (data.hasOwnProperty("title")) {
            return <div className="info">
                <h2 className=" blue-text">
                    <span >{data.title}</span> 
                </h2>
                <h5>Creator(s): {data.creator }</h5>
                
                <p>Created on: <b className="blue-text"><Moment  format="D MMM YYYY">{data.insertedAt}</Moment></b> | Last updated: <b  className="blue-text"><Moment  fromNow>{data.updatedAt}</Moment></b> | Published: <b  className="blue-text">{data.published ? "Yes" : "No"}</b> | Clone Count: <b  className="blue-text">{data.clonesCount}</b> | Provenance: <b  className="blue-text">{ data.provenance ? data.provenance : "None" }</b></p>


                

                

                <CKEditor
                    editor={ ClassicEditor }
                    data={
                        data.notes != null
                        ? data.notes.body
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
                       // console.log( 'Focus.', editor );
                    } }
                />


                <div>



                </div>

                
                    
                <h4>Resources:</h4>

                <div className="resource-group">
                    { data.resources.map((resource, index) => {
                        return (
                            <PermalinkResource
                                key={resource.id}
                                data={resource}
                                index={index} />
                        )
                    })  }
                </div>
                    
               
            </div>
        }

        if (data.hasOwnProperty("errors")) {
            return <div className="info">
                <h3>No Collection Found.</h3>
            </div>
        }
        
        return null
    }

    render() {
        return (
            <div className="result show" id="perma-link">
                
                    <div>{this.renderCollection()}</div>
               
            </div>
        ) 
    }
}

export default withApollo(Permalink)