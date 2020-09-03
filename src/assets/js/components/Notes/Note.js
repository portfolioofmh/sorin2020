import React, { Component } from "react"
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import RichTextEditor from '../Collections/RichTextEditor'
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment/min/moment-with-locales';
//Moment.globalTimezone = 'America/Chicago';
//Moment.globalLocal = true;




class Note extends Component {

    constructor(props){
        super(props);
       
        this.openNotseModal = this.openNotesModal.bind(this);
      
       
      }

      openNotesModal = () =>{
        // console.log('openResource ' + this.props.index + this.props.data.title);
        let updatedAt = this.props.updatedAt.substring(5);

        let orginType;
        let permalink;

        if(this.props.orginPermalink != undefined){
            orginType = 'collection';
            permalink = this.props.orginPermalink;
        }else{
            orginType = 'resource';
            permalink = this.props.catalogUrl;
        }

        
 
        let noteObject = {id: this.props.id, body: this.props.body, orginType: this.props.orginType,  orginTitle: this.props.orginTitle, orginPermalink: this.props.orginPermalink, updated: this.props.updatedAt}
        this.props.openNotesModal('edit_note', noteObject);

     }

    render() {

       

        let updatedAt = this.props.updatedAt.substring(5);
        let orginType = 'Resource :'

        if(this.props.orginPermalink != undefined){
            orginType = 'Collection :'
        }

        let noteBody = this.props.body.replace( /(<([^>]+)>)/ig, '');

        var localTime  = moment.utc(  this.props.updatedAt  ).toDate();
        localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
        //console.log(localTime)

        return(
            <article className="note" onClick={this.openNotesModal}>

                <div className="noteContent">
                    
                    {this.props.orginTitle ?  
                    <h6 className="noteTitle"><span className="noteType">{this.props.orginType}</span> : <span className="blue-text">{this.props.orginTitle}</span> </h6>
                    : '' }
                    <div className="noteBody">{noteBody}
                    
                    <div className="noteGrad"></div>
                    </div>
                    
                </div>

                <i className="noteInfo">


                  
                    updated: <Moment  fromNow>{localTime}</Moment>
                </i>

                


            </article>

        )

      


    }

}
export default Note;