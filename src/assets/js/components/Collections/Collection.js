import React, { Component } from "react"

import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Droppable, Draggable } from "react-beautiful-dnd"
import { graphql } from "react-apollo"
import Resource from "./Resource"



class Collection extends Component {
   


      constructor(props){
        super(props);
       
        this.state = {
            collectionId: '',
            collectionTitle: '',
            resources:[]
    
          }

          this.openResourceModal = this.openResourceModal.bind(this);
          this.createCustomResourceModal = this.createCustomResourceModal.bind(this);
       
      }

      componentDidMount() {
          //console.log(this.props);
        

        this.setState({
            collectionTitle: this.props.title,
            resources: this.props.resources, 
            collectionId : this.props.collectionId
        })

       

      }



    openCollectionModal = () =>{
       // console.log('openResource ' + this.props.index + this.props.data.title);

       let sendObject = {id: this.props.collectionId, title: this.props.title, resources: this.props.resources, writeAccess: this.props.writeAccess, published: this.props.published, color: this.props.color, cUserId: this.props.cUserId}
        this.props.openCollectionsModal('edit_collection', sendObject);
     
            

    }

    openResourceModal(resourceId){
        //console.log('openModal ' + resourceId);
        let cUserId = this.props.cUserId;
        if(!cUserId ){
            cUserId = 0;
        }

        let sendObject = {id: resourceId, canEdit:this.props.writeAccess, collectionId: this.props.collectionId, cUserId: cUserId}
        this.props.openCollectionsModal('edit_resource', sendObject);

    }

    createCustomResourceModal = () =>{
        //console.log('open modal '+ this.props.collectionId);
        let sendObject = {collectionId: this.props.collectionId, cUserId: this.props.cUserId}
        this.props.openCollectionsModal('create_resource', sendObject);
    }

      
      


    render() {

       
      
        let collectionTitle;
       if(this.props.resources){
        //console.log(this.props.data.collections[0].title);
        //collectionTitle = this.props.data.collections[0].title;
       }

       let collectionStyle = {
        backgroundColor: this.props.color || ""
         }



        return (
            <Draggable draggableId={"collection-" + this.props.collectionId} index={this.props.index} isDragDisabled={this.props.index === 0}>
                
                {provided => (
                    <div  className="column" {...provided.draggableProps} ref={provided.innerRef}>

                        <div className="inner-wrap" style={collectionStyle}>
                        { this.props.index  > 0 ?

                        <button className="col-functions action-modal" onClick={this.openCollectionModal} >...</button>

                        : '' }
                           
                            <h4  {...provided.dragHandleProps} className="title blue-text">                    
                            {this.props.title}
                            </h4>

                            {!this.props.writeAccess && this.props.index > 0?
                                <span className="flag">Cloned</span>
                                :
                                ''}

                            {this.props.published && this.props.writeAccess  && this.props.index > 0?
                                <span className="flag published">Published</span>
                                :
                                ''}

                            <Droppable droppableId={"droppable-" + this.props.index} type="resource" isDropDisabled={this.props.index === 0 ? true : !this.props.writeAccess} >
                                {provided => (
                                    <div
                                        className={"drag-blocks "}
                                        data-collection={this.props.index}
                                        ref={provided.innerRef}>
                                        
                                        { this.props.resources.length > 0 ? 
                                            
                                            this.props.resources.map((resource, index) => {
                                                return (
                                               
                                                <Resource
                                                    key={resource.id}
                                                    id={resource.id}
                                                    canEdit={this.props.writeAccess}
                                                    index={index}
                                                    title={resource.title}
                                                    url={resource.url}
                                                    parent={this.state.collectionId} 
                                                    openResourceModal={this.openResourceModal} />


                                                )
                                            })
                                            : null }
                                       

                                       
                                        { provided.placeholder }
                                    </div>
                                )}
                            </Droppable>


                            {this.props.writeAccess && this.props.index != 0 ?


                            <button className="action-modal add-custom" onClick={this.createCustomResourceModal}>Add Custom Item</button>

                            :
                            ''}







                           

                            
                        </div>
                    </div>

                    
                )}
            </Draggable>
        )
    }
}

export default withApollo(Collection) ;
/*
export default graphql(gql`
  query collectionQuery($CollectionId: Int!) {
      collections(id:$CollectionId) {
        title
      }
  }
` , {
    options : (props) => {return {variables : {CollectionId: props.collectionId}}}
  
  })(Collection);






  */
  