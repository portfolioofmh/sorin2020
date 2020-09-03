import React, { Component } from "react"
import ErrorBoundary from "../Error/Error"

import ReactDOM from "react-dom"

import gql from 'graphql-tag'
import { graphql } from "react-apollo"
import { withApollo } from 'react-apollo'
import { Mutation } from '@apollo/react-components';
import Moment from 'react-moment';


class SearchCollectionResult extends Component {

    
    

    componentDidMount() {
 

      }


   

    constructor(props) {
        super(props)

        this.state = {
            saveit: <span>save to collections</span>,
            clicked: "",
            appClass: ''
        }

        //console.log(this.props.allReadySaved)

        //this.onShow = this.onShow.bind(this);
    }

    openResource = () => {
        console.log('openCollection ' + this.props.index + this.props.data.title);
        this.props.openResourceModal(this.props.index, this.props.data);
      


        
    }

    cloneCollection = () => {
        console.log('openCollection ' + this.props.data.id);
        this.props.openCloneModal(this.props.data.id);
      

    }

    render() {
        const data = this.props.data


       
        
        return (
            <article className={'result ' + this.state.appClass} id={"search-collection-result-" + (this.props.index)} >
              <ErrorBoundary>
              <span className="count">{this.props.index + 1}</span>
                <div className={"icon "}> </div>
                <div className="info">
                      <small className="type">Collection</small> 
                    <h4 className="title">
                    <a target="_blank" onClick={this.openResource} >{data.title}</a>
                    </h4>
                    <div className="contrib">
                        <p>
                        By {data.creator} <br /><small><i>Updated: {data.updatedAt} </i> </small>
                        </p>
                    </div>
                    
                </div>

                <div className="actions">
                    {this.props.googleSignedIn ?
                    <a className={"save"} data-context="L" onClick={this.cloneCollection}>
                       Clone
                    </a>
                    : ''}
                </div>
                </ErrorBoundary> 
            </article>
        )
    }
    

}

export default withApollo(SearchCollectionResult)