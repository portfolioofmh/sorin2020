import React, { Component } from "react"
import ErrorBoundary from "../Error/Error"

//const SearchResult = ({ index, data }) => {


    let myVar;

class SearchResult extends Component {

    

    componentDidMount() {
 

        

 
      }


   

    constructor(props) {
        super(props)

        this.state = {
            saveit: <span>save to collections</span>,
            clicked: "",
            appClass: ''
        }

        //this.onShow = this.onShow.bind(this);
    }

    render() {
        const data = this.props.data


       
        
        return (
            <article className={'result ' + this.state.appClass} id={"search-result-" + (this.props.index)} >
              <ErrorBoundary>
              <span className="count">{this.props.index + 1}</span>
                <div className={"icon " + data.type}></div>
                <div className="info">
                      <small>{data.type}</small> 
                    <h4>
                       {data.title} <i>({data.date})</i>
                    </h4>
                    <div className="contrib">
                      
                        <span><i>{data.creator ? data.creator.join("; "): ""}</i></span>
                        
                        <p>
                        {data.contributor ? data.contributor.join("; "): ""}
                        </p>

                        <p>{data.is_part_of}</p>
                        
                        { data.call_number && data.availability_status == "available" && <span className="callNumber available">{data.call_number} - Available for checkout</span> }
                        
                        { data.call_number && data.availability_status == "unavailable" && <span className="callNumber unavailable">{data.call_number} - Currently unavailable</span> }
                    </div>
                </div>

                <div className="actions">
                    <a className={"save" + this.state.clicked} data-context="L" onClick={this.onSave}>
                        <span className="flag">{this.state.saveit}</span>
                    </a>
                </div>
                </ErrorBoundary> 
            </article>
        )
    }
    

}

export default SearchResult