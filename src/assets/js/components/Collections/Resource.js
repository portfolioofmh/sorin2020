import React, { Component } from "react"
//import { connect } from "react-redux"
import {Draggable} from "react-beautiful-dnd"
//import InnerResource from "./InnerResource"

class Resource extends Component {
    constructor(props) {
        super(props)
    }

    openResource = () =>{
        this.props.openResourceModal(this.props.id);
    }

    render() {

        //console.log(this.props.id + ' '+ this.props.title + '   ' + this.props.canEdit)
        
        return (
            <Draggable
                key={"draggable-"+this.props.id}
                draggableId={"resource-"+this.props.id}
                index={this.props.index}
                isDragDisabled={!this.props.canEdit}
            >
                {(provided) => (
                    <div
                        data-resource={this.props.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps} >

                        <a className="" onClick={this.openResource}>
                            <span className="resource-name">{this.props.title}</span>
                        </a>
                    
                        
                    </div>
                )}
            </Draggable>
        )
    }
}

export default Resource
