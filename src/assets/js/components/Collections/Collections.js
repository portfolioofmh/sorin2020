import React, { Component } from "react"

import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import Collection from "./Collection"
//import { Query } from 'react-apollo'
import '../../../scss/Collections.scss'
import { graphql } from "react-apollo"
import CollectionsModal from "./CollectionsModal"
import GroupModal from "./GroupModal"
//import fetchCollections from './fetchCollections'


const USER_QUERY = gql`
  query UserQuery($UserId: Int!) {
    
      users(id:$UserId) {
        id
        collectionGroups
        resources {
          id
          title
          type
        }
      }
    
  }
`
/*
const COLLECTIONS_USERS_QUERY = gql`
  query collectionsUsers($CollectionsArray: Int) {
    
    collectionsUsers(ids: $CollectionsArray) {
    writeAccess
    color
    clonedFrom
    id
    pendingApproval
    writeAccess
    collection {
    	creator
    id
    importStamp
    notes {
      id
      body
    }
    permalink
    published
    tags
    title
    writeUsers
  }
  }
    
  }
`
*/

const COLLECTIONS_USERS_QUERY = gql`
  query collectionsUsers($CollectionsArray: Int) {
    
    collectionsUsers(ids: $CollectionsArray) {
    writeAccess
    color
    id
    collection {
      title
    	creator
      published
      id
      resourceOrder
      resources{
        id
        title
      }
    id
    published
    title
  }
  }
    
  }
`

const MOVE_RESOURCE_ANOTER_COLLECTION_MUTATION = gql`
mutation moveResourceToAnoterCollection($resourceId: Int!, $resourceFields: ResourceFields!, $prevCollectionId: Int!, $nextCollectionId: Int!, $prevOrder:CollectionFields!, $nextOrder:CollectionFields!){
  updateResource(id: $resourceId, fields: $resourceFields){
    id
    title
    collectionId
  }
  col1: updateCollection(id: $prevCollectionId, fields: $prevOrder) {
    id
    title
    resourceOrder
  }
  col2: updateCollection(id: $nextCollectionId, fields: $nextOrder) {
    id
    title
    resourceOrder
  }  
}
`
const MOVE_RESOURCE_ANOTER_FROM_SAVED = gql`
mutation moveResourceFromSaved($resourceId: Int!, $resourceFields: ResourceFields!,  $nextCollectionId: Int!, $nextOrder:CollectionFields!){
  updateResource(id: $resourceId, fields: $resourceFields){
    id
    title
    collectionId
  }
  updateCollection(id: $nextCollectionId, fields: $nextOrder) {
    id
    title
    resourceOrder
  }  
}
`

const UPDATE_COLLECTIONS_MUTATION = gql`
mutation updateCollection($CollectionId: Int!, $CollectionFields: CollectionFields!){
  updateCollection(id:$CollectionId, fields: $CollectionFields) {
    id
    title
    resourceOrder
  }	
}
`

const EDIT_COLLECTIONS_MUTATION = gql`
mutation EditGroups($id: Int!, $fields: UserUpdateFields!){
  updateUser(id: $id, fields: $fields){
    id
    collectionGroups
  }
}
`

const MOVE_RESOURCE_MUTATION = gql`
mutation moveResource($ResourceId: Int! $Position: Int!, $TargetCollectionId: Int!){
  moveResource(id: $ResourceId, position: $Position, targetCollectionId: $TargetCollectionId){
    id
    title
    collectionId
  }
}
`

class Collections extends Component {


  _isMounted = false;

    constructor(props){
      
      super(props);
     
      this.state = {
        test: 0,
        saved_search_results: [],
        collections_groups: {},
        current_collection_group: 'Default',
        current_collections: [], 
        open_modal: false,
        modal_type: '',
        edit_Object: '', 
        open_group_modal: false

  
      }

      this.setCollections = this.setCollections.bind(this);
      this.createGroups = this.createGroups.bind(this);
      this.createCollections = this.createCollections.bind(this);
      this.openCollectionsModal  = this.openCollectionsModal.bind(this);
      this.closeCollectionsModal = this.closeCollectionsModal.bind(this);
      this.openGroupModal = this.openGroupModal.bind(this);
      this.renderDropDown = this.renderDropDown.bind(this);
      this.formSubmit = this.formSubmit.bind(this);
      this.changeGroup = this.changeGroup.bind(this);
      this.setOrder = this.setOrder.bind(this);
      this.openGroupModalNew = this.openGroupModalNew.bind(this);

      this.modalElement = React.createRef();
      this.groupModalElement = React.createRef();



     
    }
    
    componentDidMount() {
      this._isMounted = true;

      if(window.innerWidth < 960){
        this.props.openMobile();
      }
      var myDiv = document.getElementById('content');
  
      myDiv.scrollTop = 0;

      //this.setState({collection_groups: });

      this.props.clearSavedNum();
      localStorage.removeItem('searchString');
    localStorage.removeItem('params');

      
      if(this._isMounted && this.props.userId){

        this.createGroups();
              


      }



    }

    changeGroup(event){
      this.setState({current_collection_group: event.target.value},  () => this.createGroups() )
    }

    renderDropDown(){

      

      if(this.state.collections_groups.length>0){

      
      return (


        <select id="groups" onChange={this.changeGroup } value={this.state.current_collection_group}>


        { this.state.collections_groups.map( (collections_group, index) => {



          return (
            <option value={collections_group.name} key={index}>{collections_group.name}</option>
          )
      
          })
        }

        </select>

      )
      }

  }

    createGroups(){
    
      const  { data, error, loading, refetch, networkStatus } = this.props.client.query({
        query: USER_QUERY,
        variables: { UserId: parseInt(this.props.userId)  },
        fetchPolicy:'network-only'
      }).then(response => {
      

       //if (this.props.collection_groups) {
         
          //console.log(response.data.users[0]);

          const dataParse = JSON.parse(response.data.users[0].collectionGroups);
          console.log(dataParse);
          //console.log(dataParse.length);

          const collectionGroupsObject = [];


         const collectionGroupsString = dataParse;

         let saved1 = response.data.users[0].resources;
         let saved2=  this.props.savedResources;
         let allSaved = saved1.concat(saved2);

         allSaved.reverse();

          for (let [key, value] of Object.entries(dataParse)) {
            //console.log(`${key}: ${value}`);
            let collectionGroupName = key;
            let collectionGroupCollections = value;

            let collectionGroupObject = {name: collectionGroupName, collections: collectionGroupCollections};
            //console.log(collectionGroupObject);
            collectionGroupsObject.push(collectionGroupObject);
          }



          //console.log(collectionGroupsObject);


          if(this._isMounted && this.props.userId){
          this.setState(
            { collections_groups: collectionGroupsObject, saved_search_results: allSaved },
            () => this.createCollections()
          );

          }

        
    })
    }

    createCollections(){
      console.log('create collection ' + this.state.current_collection_group)

      let findIndex;
      for (var i = 0; i < this.state.collections_groups.length; i++) {
        if (this.state.collections_groups[i]['name'] === this.state.current_collection_group) {
            findIndex = i;
        }
      }

      console.log("findIndex " + findIndex)


      const curentGroup = this.state.collections_groups[findIndex];
      console.log(curentGroup);


      const data = this.props.client.query({
        query: COLLECTIONS_USERS_QUERY,
        variables: { CollectionsArray: curentGroup.collections  },
        fetchPolicy:'network-only'
      }).then(response => {

        console.log(response);
        const currentCollections = [];

        const createSavedResults =  {...this.state.saved_search_results, ...this.props.savedResources }



        const createSavedCollection = {id: 0, cUserId: 0, title:'Saved Collection', resources: this.state.saved_search_results, writeAccess: true, color: null };
        currentCollections.push(createSavedCollection)

        if(this._isMounted && this.props.userId){
        
        for(let i = 0; i < response.data.collectionsUsers.length; i++ ){
          //console.log(response.data.collectionsUsers[i].collection.resources);
         // console.log(response.data.collectionsUsers[i].collection.resourceOrder);

          let resourcesArray= [];

           for(let j = 0; j < response.data.collectionsUsers[i].collection.resourceOrder.length; j++ ){
            //console.log("j " + j) 
           // console.log(response.data.collectionsUsers[i].collection.resourceOrder[j]);
            for(let k = 0; k < response.data.collectionsUsers[i].collection.resources.length; k++ ){
              //console.log("k " + k) 
              //console.log(response.data.collectionsUsers[i].collection.resourceOrder[k].id);

              if(response.data.collectionsUsers[i].collection.resourceOrder[j] === response.data.collectionsUsers[i].collection.resources[k].id){
                resourcesArray[j] = response.data.collectionsUsers[i].collection.resources[k];
              }
             

            }

           }
          // console.log("ordered array");

           //console.log(resourcesArray);





          let createCollection = {cUserId: response.data.collectionsUsers[i].id, id: response.data.collectionsUsers[i].collection.id,  title:response.data.collectionsUsers[i].collection.title , resources: resourcesArray, writeAccess: response.data.collectionsUsers[i].writeAccess, color: response.data.collectionsUsers[i].color, published: response.data.collectionsUsers[i].collection.published};
          currentCollections.push(createCollection);
        }
        this.setState({current_collections: currentCollections});
      
      }


      });
       

    }

    componentDidUpdate(){

    }

    componentWillUnmount() {
      this._isMounted = false;
    }



    openCollectionsModal(formType, edit_Object){

      //console.log('open ' + formType);
      document.getElementById("root").style.position = "fixed";
      this.setState({open_modal: true});
      this.setState({modal_type: formType});
      this.setState({edit_Object: edit_Object});


    }

    openGroupModal(){
      this.setState({open_group_modal:true});
      this.setState({modal_type:'edit_group'});
      this.groupModalElement.current.getTitle(this.state.current_collection_group);
    }

    openGroupModalNew(){
      this.setState({open_group_modal:true});
      this.setState({modal_type:'create_group'});
     
    }

  
    closeCollectionsModal(){

      document.getElementById("root").style.position = "relative";
      this.setState({open_modal:false, open_group_modal: false});
      
      this.setState({modal_type: ''});
      this.setState({edit_Object: {} });
 
    }

    formSubmit(info, end_result){


      if(end_result=== 'create_collection'){

        /*
          const collectionArray = Array.from(this.state.current_collections); 
          const getSavedCollection = collectionArray[0];
          collectionArray.shift();
          collectionArray.unshift(info);
          collectionArray.unshift(getSavedCollection);


          const collectionGroupsArray = Array.from(this.state.collections_groups); 

          let findIndex;

          for (var i = 0; i < collectionGroupsArray.length; i++) {
              if (collectionGroupsArray[i]['name'] ===  this.state.current_collection_group) {
                  findIndex = i;
              }
          }

          let getCollections = collectionGroupsArray[findIndex].collections;
          getCollections.unshift(parseInt(info.id));
          collectionGroupsArray[findIndex].collections = getCollections;
          //console.log(collectionGroupsArray[findIndex].collections);



       
       
        this.setState({
          current_collections: collectionArray, collections_groups: collectionGroupsArray
        })
        */

       this.createGroups();

        //this.createCollections();


      }


      if(end_result=== 'create_resource'){
        const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['id'] === info.collectionId) {
                findIndex = i;
            }
        }

       // console.log(findIndex);
        //console.log(collectionArray[findIndex]);

        let c_resource = collectionArray[findIndex].resources;
        c_resource.push(info);




     
     
      this.setState({
        current_collections: collectionArray
      }
      
      
      )
     


    }

      if(end_result === 'edit_collection'){
        //console.log(info);
        const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['id'] === info.id) {
                findIndex = i;
            }
        }
 

        collectionArray[findIndex] = info;

        this.setState({
          current_collections: collectionArray
        })


      }


      if(end_result === 'edit_collection_color'){
       // console.log(info);
        const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['id'] === info.id) {
                findIndex = i;
            }
        }
        //console.log(findIndex);
        //console.log(collectionArray[findIndex]);
 

        collectionArray[findIndex].color = info.color;

        this.setState({
          current_collections: collectionArray
        })


      }

      if(end_result === 'delete_collection'){
        //console.log('delete collection')

        /*

        const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['id'] === info.id) {
                findIndex = i;
            }
        }

        collectionArray.splice(findIndex, 1);

        const collectionGroupsArray = Array.from(this.state.collections_groups); 

        let findIndexDelete;

        for (var i = 0; i < collectionGroupsArray.length; i++) {
            if (collectionGroupsArray[i]['name'] ===  this.state.current_collection_group) {
              findIndexDelete= i;
            }
        }

        let getCollections = collectionGroupsArray[findIndexDelete].collections;
        getCollections.splice(getCollections.indexOf(info.id), 1);
       // console.log(getCollections);
        collectionGroupsArray[findIndexDelete].collections = getCollections;
        //console.log(collectionGroupsArray[findIndex].collections);




        this.setState({
          current_collections: collectionArray, collections_groups: collectionGroupsArray
        })
        */

       this.createGroups();

        

      }

     



      if(end_result === 'delete_resource'){
       // console.log('delete resource')

        const savedArray = Array.from(this.state.saved_search_results); 
        let findIndex;

        for (var i = 0; i < savedArray.length; i++) {
            if (savedArray[i]['id'] === info.id) {
                findIndex = i;
            }
        }

        if(findIndex){
          savedArray.splice(findIndex, 1);
          this.setState({
            saved_search_results:  savedArray
          })
        }


        const collectionsArray = Array.from(this.state.current_collections); 
        let findCollectionIndex;
        let findResourceIndex;

        for (var i = 0; i < collectionsArray.length; i++) {
          let collectionResources = collectionsArray[i]['resources'];
          for(var j =0; j < collectionResources.length; j++){
            if(collectionResources[j].id === info.id){
              findResourceIndex = j;
              findCollectionIndex = i;
            }
          }
           
        }
       // console.log(findCollectionIndex);
       // console.log(findResourceIndex);
        let foundCollection = collectionsArray[findCollectionIndex];
        //console.log(foundCollection);
        
        let foundResources = foundCollection['resources'];
       // console.log(foundResources);

        foundResources.splice(findResourceIndex, 1);
        //console.log(foundResources);
        //console.log(collectionsArray);

        /*
        this.setState({
          current_collections: collectionsArray
        })
        */

      }

      if(end_result === 'edit_resource'){
       // console.log('edit resource');

        const collectionsArray = Array.from(this.state.current_collections); 
        let findCollectionIndex;
        let findResourceIndex;

        for (var i = 0; i < collectionsArray.length; i++) {
          let collectionResources = collectionsArray[i]['resources'];
          for(var j =0; j < collectionResources.length; j++){
            if(collectionResources[j].id === info.id){
              findResourceIndex = j;
              findCollectionIndex = i;
            }
          }
           
        }
       // console.log(findCollectionIndex);
       // console.log(findResourceIndex);
        let foundCollection = collectionsArray[findCollectionIndex];
       // console.log(foundCollection);
        
        let foundResources = foundCollection['resources'];
        //console.log(foundResources);

        foundResources[findResourceIndex].title = info.title;
       // console.log(foundResources);
       // console.log(collectionsArray);





      }

      if(end_result === 'move_Collection'){

        console.log('move collection');
        console.log(info)

        const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['cUserId'] === info.id) {
                findIndex = i;
            }
        }

        console.log(findIndex);
 

       
        collectionArray.splice(findIndex, 1);
       // console.log(collectionArray);

        this.setState({
          current_collections: collectionArray
         
        },() => {
            const collectionGroupsArray = Array.from(this.state.collections_groups); 

            let findIndex;

            for (var i = 0; i < collectionGroupsArray.length; i++) {
                if (collectionGroupsArray[i]['name'] === info.newGroup) {
                    findIndex = i;
                }
            }
            collectionGroupsArray[findIndex].collections.unshift(info.id);
            //console.log(collectionGroupsArray[findIndex].collections);
          

            this.setState({
              collections_groups: collectionGroupsArray
            }, () => this.setOrder()
            
            
            );
           
           
          });

        

         


        
        
      


      }


      if(end_result === 'edit_group'){

        //console.log('edit_group');
       // console.log(info);

        const groupsArray = Array.from(this.state.collections_groups); 
       //console.log(groupsArray);

        for (var i = 0; i < groupsArray.length; i++) {
            if (groupsArray[i]['name'] === this.state.current_collection_group) {
              groupsArray[i]['name'] = info.name

            }
        }

       // console.log(groupsArray);

        this.setState({
          collections_groups: groupsArray
        }, () => {this.setOrder();
          this.setState({
            current_collection_group: info.name})}

        );




      }

      if(end_result === 'create_group'){

       // console.log('create_group');
        //console.log(info);

        const groupsArray = Array.from(this.state.collections_groups); 
       //console.log(groupsArray);

      

       groupsArray.push(info);


        //console.log(groupsArray);

        this.setState({
          collections_groups: groupsArray
        }, () => {this.setOrder();
          this.setState({
            current_collection_group: info.name},
            () => this.createGroups()
            
            )}
          
          


        );




      }


      if(end_result === 'delete_group'){

       // console.log('delete_group');
       // console.log(info);

        const groupsArray = Array.from(this.state.collections_groups); 
       //console.log(groupsArray);

       let index;

        for (var i = 0; i < groupsArray.length; i++) {
            if (groupsArray[i]['name'] === this.state.current_collection_group) {
             index = i;
              

            }
        }

        //console.log('index   ' + index);
        let getCollections = groupsArray[index].collections;
        groupsArray.splice(index, 1);

        //console.log('getCollections');
       // console.log(getCollections);

        if(getCollections.length > 0){
            for (var i = 0; i < groupsArray.length; i++) {
              if (groupsArray[i]['name'] === 'Default') {

                let defaultCollections = groupsArray[i]['collections'].concat(getCollections);

                

                
                groupsArray[i]['collections'] = defaultCollections;

                //onsole.log(groupsArray[i]['collections']);
                

              }
            }

        }



        this.setState({
          collections_groups: groupsArray
        }, () => {  this.setOrder();
          this.setState({
            current_collection_group:'Default'},
            () => this.createCollections()
            
            )}

        );


      }

      if(end_result === 'move_Resource'){

        console.log('move resource');
        console.log(info);
        const collectionArray = Array.from(this.state.current_collections); 

        let findPrevColIndex;
        let findNewColIndex;
        let findResourceIndex;
        let prevOrder = [];
        let prevOrderArray = [];
        let newOrder = [];
        let newOrderArray = [];
        let movedResource;

        

        for (var i = 0; i < collectionArray.length; i++) {
          //console.log(collectionArray[i]['cUserId']);
            if (parseInt(collectionArray[i]['id']) === info.newColId) {
              findNewColIndex= i;
              newOrder = collectionArray[i]['resources'];
                
            }
            if (parseInt(collectionArray[i]['id']) === info.prevColId) {
              findPrevColIndex = i;
              prevOrder = collectionArray[i]['resources'];

            }
        }
       
        console.log(findPrevColIndex);
        console.log(findNewColIndex);
        console.log(prevOrder);
        console.log(newOrder);
       

        for (var i = 0; i < prevOrder.length; i++) {
          if(parseInt(prevOrder[i].id) === info.id){
            findResourceIndex = i;
            movedResource = prevOrder[i];
          }
        }



        
        //console.log(findResourceIndex);

        prevOrder.splice(findResourceIndex, 1);
        newOrder.unshift(movedResource);

        collectionArray[findPrevColIndex]["collections"] = prevOrder;
        collectionArray[findNewColIndex]["collections"] = newOrder;

        for (var i = 0; i < prevOrder.length; i++) {
          prevOrderArray.push(parseInt(prevOrder[i].id))
        }

        for (var i = 0; i < newOrder.length; i++) {
          newOrderArray.push(parseInt(newOrder[i].id))
        }

        //console.log(prevOrderArray);
        //console.log(newOrderArray);

        this.setState({current_collections: collectionArray},
          () => {
                  if(info.prevColId === 0){
               

                const data = this.props.client.mutate({
                  mutation: MOVE_RESOURCE_ANOTER_FROM_SAVED,
                  variables: { resourceId: parseInt(info.id), resourceFields: {collectionId: parseInt(info.newColId), userId: null},  nextCollectionId: parseInt(info.newColId), nextOrder: {resourceOrder: newOrderArray}},
                }).then(response => {
                  console.log(response); 
                });
               


              }else{


                const data = this.props.client.mutate({
                  mutation: MOVE_RESOURCE_ANOTER_COLLECTION_MUTATION,
                  variables: { resourceId: parseInt(info.id), resourceFields: {collectionId: parseInt(info.newColId)}, prevCollectionId: parseInt(info.prevColId), prevOrder: {resourceOrder: prevOrderArray}, nextCollectionId: parseInt(info.newColId), nextOrder: {resourceOrder: newOrderArray}},
                }).then(response => {
                  console.log(response); 
                });
                
              }
            
          });

 


          

     



      }

      if(end_result === 'make_public'){
          //console.log(info.id);
          const collectionArray = Array.from(this.state.current_collections); 
        let findIndex;

        for (var i = 0; i < collectionArray.length; i++) {
            if (collectionArray[i]['id'] === info.id) {
                findIndex = i;
                collectionArray[i]['published'] = true;
            }
        }
      }
      if(end_result != 'edit_collection_color'){
      this.setState({open_modal:false});
      this.setState({modal_type: ''});
      this.setState({edit_Object: {} });
      }

    }

    setCollections(){



      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="all-collections" direction="horizontal" type="column">

            {provided => (
                    <div
                        {...provided.droppableProps}
                        ref={ provided.innerRef }
                    >
                        { this.state.current_collections ? 
                            this.state.current_collections.map((collection, index) => {
                                return (
                                    <Collection
                                        key={"key-"+collection.id}
                                        index={index}
                                        collectionId={collection.id}
                                        cUserId={collection.cUserId}
                                        resources ={collection.resources}
                                        title={collection.title}
                                        published={collection.published}
                                        writeAccess = {collection.writeAccess}
                                        openCollectionsModal={this.openCollectionsModal}
                                        color={collection.color}
                                    />
                                )
                            })
                            : null }
                        { provided.placeholder }
                    </div>
                )}
            </Droppable>
        </DragDropContext>


      )


    }

    

    onDragEnd = (result) => {

      //console.log('dragEnd')
      const { destination, source, draggableId, type } = result



  
      if (!destination) {
          return
      }
      
      if (destination.droppableId === source.droppableId &&
          destination.index === source.index
      ) {
          return
      }
      
      if (type === "column") {
          if (destination.index != 0) {

            //console.log(this.state.current_collections[source.index]  )

            const newArray = Array.from(this.state.current_collections);
            newArray.splice(source.index, 1);
            newArray.splice(destination.index, 0, this.state.current_collections[source.index] );
            //console.log(newArray);
/*
            this.setState({current_collections: newArray}).then(response => {

              this.setOrder();
            });
            */

            this.setState(
              { current_collections: newArray},
              () => this.setOrder()
            );

        
          } else {
              return null
          }
          
      } else if (type === "resource") {

        //console.log('dragableId ' + draggableId);

        const startColumn  = source.droppableId;
        const finishColumn  = destination.droppableId;

        //console.log('source dropableId    ' + startColumn);
        //console.log('destination dropableId    ' + finishColumn);

        const startColumnIndex = startColumn.split("-");
        const startColumnIndexNum = startColumnIndex[1];
        //console.log(startColumnIndexNum);

        const finishColumnIndex = finishColumn.split("-");
        const finishColumnIndexNum = finishColumnIndex[1];
        //console.log(finishColumnIndexNum);

        if(startColumn === finishColumn){ //same column
         // console.log('same column');

          const newResourcesArray = Array.from(this.state.current_collections[startColumnIndexNum].resources); 

          newResourcesArray.splice(source.index, 1);
          newResourcesArray.splice(destination.index, 0, this.state.current_collections[startColumnIndexNum].resources[source.index] );
          //console.log(newResourcesArray);

          const newColumn = this.state.current_collections[startColumnIndexNum];
          newColumn.resources = newResourcesArray;
          

          const allColumns  = Array.from(this.state.current_collections); 

          allColumns.splice(startColumnIndexNum, 1);
          allColumns.splice(startColumnIndexNum, 0, newColumn);

         // console.log(allColumns);
          this.setState({current_collections: allColumns},
            () => {

              //console.log(newResourcesArray);

              let nextOrderArray = [];

              for (let i=0; i<newResourcesArray.length; i++){
                nextOrderArray[i] = parseInt(newResourcesArray[i].id)
              }
              //console.log("id " + this.state.current_collections[startColumnIndexNum].id);
              //console.log(nextOrderArray);



              let newStartId = this.state.current_collections[startColumnIndexNum].id;

              if(newStartId  != this.state.current_collections[startColumnIndexNum].cUserid){
                //newStartId = this.state.current_collections[startColumnIndexNum].cUserId;
              }


             
              const data = this.props.client.mutate({
                mutation: UPDATE_COLLECTIONS_MUTATION ,
                variables: { CollectionId: parseInt(newStartId),   CollectionFields: {resourceOrder: nextOrderArray} },
              }).then(response => {
                console.log(response); 
              });
             
              
              
            });

        }else{
        //  console.log('different column');


          const newStartResourcesArray = Array.from(this.state.current_collections[startColumnIndexNum].resources); 
          const newFinishResourcesArray = Array.from(this.state.current_collections[finishColumnIndexNum].resources); 

          newStartResourcesArray.splice(source.index, 1);
          //console.log(newStartResourcesArray);

          newFinishResourcesArray.splice(destination.index, 0, this.state.current_collections[startColumnIndexNum].resources[source.index]);
          //console.log(newFinishResourcesArray);

          const newStartColumn = this.state.current_collections[startColumnIndexNum];
          newStartColumn.resources = newStartResourcesArray;
         // console.log(newStartColumn);

          const newFinishColumn = this.state.current_collections[finishColumnIndexNum];
          newFinishColumn.resources = newFinishResourcesArray;
          //console.log(newFinishColumn);

          const allColumns  = Array.from(this.state.current_collections); 

          allColumns.splice(startColumnIndexNum, 1);
          allColumns.splice(startColumnIndexNum, 0, newStartColumn);


          allColumns.splice(finishColumnIndexNum, 1);
          allColumns.splice(finishColumnIndexNum, 0, newFinishColumn);

          //console.log(allColumns);
          this.setState({current_collections: allColumns},
            () => {

              var r_id = draggableId.replace("resource-", '');

              /*

              console.log('resource id ' + r_id);
              console.log('position ' + destination.index);
              console.log('PREV Collection ID ' + newStartColumn.id)
              console.log('NEXT Collection ID ' + newFinishColumn.id)
              */

              let nextOrderArray = [];

              for (let i=0; i<newFinishColumn.resources.length; i++){
                nextOrderArray[i] = parseInt(newFinishColumn.resources[i].id)
              }

             // console.log("next order");
              ///console.log(nextOrderArray);

              let prevOrderArray = [];

              for (let i=0; i<newStartColumn.resources.length; i++){
                prevOrderArray[i] = parseInt(newStartColumn.resources[i].id)
              }

              //console.log("prev order");
              //console.log(prevOrderArray);

              //{"resourceId": 52, "resourceFields": {"collectionId": 22},"prevCollectionId": 23, "prevOrder": {"resourceOrder": [53]}, "nextCollectionId": 22, "nextOrder": {"resourceOrder": [52, 51, 50]}}

             
              let newStartId = newStartColumn.id;

              if(newStartColumn.id != newStartColumn.cUserId){
                //newStartId = newStartColumn.cUserId;
              }
             
              let newFinishId = newFinishColumn.id;

              if(newFinishColumn.id != newFinishColumn.cUserId){
                //newFinishId = newFinishColumn.cUserId;
              }

             

            if(newStartColumn.id === 0){

              

             



              const data = this.props.client.mutate({
                mutation: MOVE_RESOURCE_ANOTER_FROM_SAVED,
                variables: { resourceId: parseInt(r_id), resourceFields: {collectionId: parseInt(newFinishId), userId: null},  nextCollectionId: parseInt(newFinishId), nextOrder: {resourceOrder: nextOrderArray}},
              }).then(response => {
                console.log(response); 
              });


            }else{

              //console.log(newFinishId + '  ' + newStartId);

            

              const data = this.props.client.mutate({
                mutation: MOVE_RESOURCE_ANOTER_COLLECTION_MUTATION,
                variables: { resourceId: parseInt(r_id), resourceFields: {collectionId: parseInt(newFinishId)}, prevCollectionId: parseInt(newStartId), prevOrder: {resourceOrder: prevOrderArray}, nextCollectionId: parseInt(newFinishId), nextOrder: {resourceOrder: nextOrderArray}},
              }).then(response => {
                console.log(response); 
              });
              
            }
           
              
    




              /*
              
              */
             


            }
            
            
            );

          



        }
      
      }

      return
  }

  setOrder(){
    //console.log('set order');

    /*
    
    {
  "data": {
    "updateUser": {
      "collectionGroups": "{\"Archived\":[0,666,1000],\"Default\":[44,55,66],\"History\":[2]}",
      "id": "1"
    }
  }
}

    */

   let collectionGroupsOrder = '{';

    for (let c = 0; c < this.state.collections_groups.length; c++){


      collectionGroupsOrder = collectionGroupsOrder + '\"'+this.state.collections_groups[c].name+"\":";
      collectionGroupsOrder = collectionGroupsOrder + '[';

      let c_resources = this.state.collections_groups[c].collections;

      if(this.state.collections_groups[c].name === this.state.current_collection_group){
          for (let i=0; i<this.state.current_collections.length; i++){

            if(this.state.current_collections[i].id !=0){
               collectionGroupsOrder = collectionGroupsOrder + this.state.current_collections[i].cUserId

               if(i < this.state.current_collections.length - 1){
                collectionGroupsOrder = collectionGroupsOrder + ',';
               }
            } 
           
          }

      }else{
        collectionGroupsOrder = collectionGroupsOrder + c_resources;
      }



      collectionGroupsOrder = collectionGroupsOrder +  ']';
      if(c < this.state.collections_groups.length - 1){
        collectionGroupsOrder = collectionGroupsOrder + ',';
       }
    }

    collectionGroupsOrder = collectionGroupsOrder + '}';

    console.log(collectionGroupsOrder);

    // "{ \"Archived\":[],\"Default\":[23,22,24,21,20,19,18,17,14,13],\"History\":[25,16,15,2] }"
    // "{ \"Archived\":[],\"Default\":[22,23,24,21,20,19,18,17,14,13],\"History\":[25,16,15,2] }"

    //{"id": 1, "fields": {"collectionGroups": "{ \"Archived\":[],\"Default\":[23,22,24,21,20,19,18,17,14,13],\"History\":[25,16,15,2] }"}}


    const data = this.props.client.mutate({
      mutation: EDIT_COLLECTIONS_MUTATION ,
      variables: { id: parseInt(this.props.userId),  fields: { "collectionGroups": collectionGroupsOrder } }
    }).then(response => {

      //this.props.data.refetch();

      console.log(response); 
      this.props.updateCollectionGroups(collectionGroupsOrder);
      
    
    }).catch(response => {
      console.log(response);
      this.setState({error:true})


    });




  }



  
    render() {
     
      return(
        <div>
          <header id="collections-header">
              
              <div>
                <h2 className="blue-text">Collections</h2>
                  {this.renderDropDown()}
                  {this.state.current_collection_group === 'Default'  || this.state.current_collection_group === 'Archived' ?

                  <div id="groupControls">
                  < a onClick={this.openGroupModalNew}>Create Group</a>
                  </div>

                  :<div id="groupControls">
                    <a onClick={this.openGroupModal}>Edit/Delete</a> | < a onClick={this.openGroupModalNew}>Create Group</a>
                  </div>
                  
                  
                  }
 
              </div>
              <button id="create"  onClick={e => {this.setState({ open_modal: true, modal_type: 'create_collection'}); document.getElementById("root").style.position = "fixed";}} >+ Create Collection</button>

          </header>
          <section id="collections">

           {this.setCollections() }
           
          </section>
          <CollectionsModal open_modal={this.state.open_modal} modal_type={this.state.modal_type} closeCollectionsModal={this.closeCollectionsModal} edit_Object={this.state.edit_Object} formSubmit={this.formSubmit} ref={this.modalElement} userId={this.props.userId} collectionGroup={this.state.current_collection_group} savedResources={this.state.saved_search_results} collectionGroups={this.state.collections_groups} currentCollections={this.state.current_collections}/>

          <GroupModal isOpen={this.state.open_group_modal}  modal_type={this.state.modal_type} closeCollectionsModal={this.closeCollectionsModal}  formSubmit={this.formSubmit}  userId={this.props.userId} collectionGroup={this.state.current_collection_group}  collectionGroups={this.state.collections_groups} ref={this.groupModalElement} />
        </div>
        );
      }
  }
  
 export default withApollo(Collections) ;
