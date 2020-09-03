import React, { Component } from "react"
import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'

const CLONE_COLLECTION_MUTATION = gql`
   mutation cloneCollection($collectionId: Int!, $collectionGroup: String, $userId: Int!){
  cloneCollection(collectionId: $collectionId, group: $collectionGroup, userId: $userId){
  	id
  }
}
`


class CloneModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            group: "Default",
            error:false
        }
        this.onClose = this.onClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClone = this.onClone.bind(this);
    }

    onClose = () => {
        this.setState({group: "Default", error: false })
        this.props.closeResourceModal();
    }

    onClone(e){
        e.preventDefault();
    
        
            console.log('Clone!');
            const { data, error, loading, refetch, networkStatus }= this.props.client.mutate({
                mutation: CLONE_COLLECTION_MUTATION ,
                variables: {  collectionId: parseInt(this.props.cloneCollection), collectionGroup: this.state.group, userId:parseInt(this.props.userId)  },
              }).then(response => {
                console.log(response);
                this.onClose();

              }).catch(response => {
                console.log(response);
                this.setState({error:true})


              })
       
      }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({
          group: event.target.value
        });
      }

    render() {
        return(
            <div className="modals">

                {
                    
                    this.props.isOpen ?
                        
                    <div className="window-wrapper">
                        <div className='window alert' >
                        <button className="window-close" onClick={ this.onClose  }>&times;</button>
                            <h4>Select collection group</h4>

                            <div id="collectionGroup" className="collectionGroup ">
                                    { this.props.collectionGroups.map((group, index) => {
                                        return (
                                            <div key={index}>
                                                <input type="radio" name="gender" value={group} id={ group.replace(/\s+/g, '-').toLowerCase() }   checked={group === this.state.group} onChange={this.handleChange}/>
                                                <label for={ group.replace(/\s+/g, '-').toLowerCase() }  >{group}</label>
                                            </div>
                                        )
                                    })  }
                                </div>
                                <button className="btn save" type="submit"  onClick={this.onClone} >Clone</button>
                                {this.state.error ? 
                                
                                <p>Collection can not be cloned</p>
                                
                                : ''}
                        </div>
                    </div>
                    
                        :
                        ''
                }
                   

            </div>
        )
    }

}export default withApollo(CloneModal)