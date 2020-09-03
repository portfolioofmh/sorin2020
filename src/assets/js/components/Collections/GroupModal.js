import React, { Component } from "react"



class GroupModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error:false,
            group_title: '',
            start_title: '', 
            alert: false
        }
        this.onClose = this.onClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);

        //this.onClone = this.onClone.bind(this);
    }

    onClose = () => {
        this.setState({ error: false, group_title: '', start_title: '', alert: false })

        this.props.closeCollectionsModal();
    }

    changeTitle(e){
        e.preventDefault();
        console.log(this.props.collectionGroups)

        for(let i = 0; i < this.props.collectionGroups.length; i++){
            console.log(this.props.collectionGroups[i].name)
           
            if(this.props.collectionGroups[i].name === this.state.group_title){
                this.setState({error: true})
                return
            }

           
           
        }

        let editedGroup = {name: this.state.group_title}

        this.props.formSubmit(editedGroup, 'edit_group');
        this.onClose();

          
       
      }

      showAlert(){
        this.setState({ alert:true })  
      }

      createGroup(e){
        e.preventDefault();
        console.log(this.props.collectionGroups)

        for(let i = 0; i < this.props.collectionGroups.length; i++){
            console.log(this.props.collectionGroups[i].name)
           
            if(this.props.collectionGroups[i].name === this.state.group_title){
                this.setState({error: true})
                return
            }
        }

        let createdGroup = {name: this.state.group_title, collections: []}

        this.props.formSubmit(createdGroup, 'create_group');
        this.onClose();
      }

      deleteGroup(e){
        e.preventDefault();
       

        let deletedGroup = {name: this.state.start_title}

        this.props.formSubmit(deletedGroup, 'delete_group');
        this.onClose();
      }



      getTitle(title){
          console.log('title ' + title);
          this.setState({ group_title: title, start_title: title })  
      }

    handleChange(event) {

        this.setState({
            group_title: event.target.value
        });
      }

    render() {
        return(
            <div className="modals">

                {
                    
                    this.props.isOpen ?
                        
                    <div className="window-wrapper">
                        <div className='window' >
                        <button className="window-close" onClick={ this.onClose  }>&times;</button>


                        {this.props.modal_type === 'create_group' ? 

                        
                        <form onSubmit={this.createGroup}>
                            <div className="create_collection-container">
                                <h2 className={"resource-title blue-text"}> Create Collection Group </h2>
                                <label>Title <span className="required">*</span></label>
                                <input type="text" className="full-width" name="add-collection-title" onChange={ this.handleChange.bind(this )   }   autoComplete="off" required={true} placeholder="Title" ref={this.focusInputField}/>
                                
                                
                            </div>
                            <div className="controls">
                                <button className="btn save" onClick={this.createGroup} type="submit">Create</button>
                            </div>

                            
                            
                        </form>


                        : '' }

                        {this.props.modal_type === 'edit_group' ? 
                       
                       
                       
                        <form onSubmit={ this.changeTitle}>
                                <div className="create_collection-container">
                                    <label>Collection Group Title <span className="required">*</span></label>
                                    <input type="text" className="full-width" name="add-collection-title" value={this.state.group_title} autoComplete="off" required={true} placeholder="Title"onChange={ this.handleChange.bind(this )   }   ref={this.focusInputField}/>

                                    {this.state.error ? 
                                
                                <p>Please select a unigue name</p>
                                
                                : ''}
                                    
                                    
                                </div>
                                <div className="controls">
                                <button className="btn delete" onClick={this.showAlert}>Delete</button>
                                    <button className="btn save" type="submit" onClick={this.changeTitle}>Edit</button>
                                </div>

                                

                                
                                
                            </form>
                             : '' }



                        </div>
                    </div>
                    
                        :
                        ''
                }

                       
                    {this.state.alert ? 
                        <div className="window-wrapper">
                            <div className='window alert' >
                               
                                    
                                    <h4>Are you sure? All collections  will moved to the Default. </h4>
                                    <button className="btn delete" type="submit" onClick={this.onClose}>Deny</button>
                                    <button className="btn save" type="submit" onClick={this.deleteGroup}>Proceed</button>
                                   
                               
                            </div>
                        </div>

                        :
                        ''
                        }
                   

            </div>
        )
    }

}export default GroupModal