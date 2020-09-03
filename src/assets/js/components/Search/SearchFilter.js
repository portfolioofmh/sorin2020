import React, { Component } from 'react'


class SearchFilter extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            query_place: 'any',
            resource_type: 'all',
            query_exactness: 'contains',
            sort_by: '',
            peer_reviewed: false,
            full_text_online : false,
            phys_in_lib : false,
            open_access : false
        };

  

        this.handleQueryPlaceChange = this.handleQueryPlaceChange.bind(this);
        this.handleResourceTypeChange = this.handleResourceTypeChange.bind(this);
        this.handleQueryExactnessChange = this.handleQueryExactnessChange.bind(this);
        this.handleSortyByChange = this.handleSortyByChange.bind(this);
        this.handlePeerReviewChange = this.handlePeerReviewChange.bind(this);
        this.handleFullTextChange = this.handleFullTextChange.bind(this);
        this.handlePhysicallyChange = this.handlePhysicallyChange.bind(this);
        this.handleOpenAccessChange = this.handleOpenAccessChange.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.queryPlaceOptions = {
            'Any': 'any',
            'Title': 'TITLE',
            'Creator': 'CREATOR',
            'Subject': 'SUB'
        }

        this.queryResourceTypes = {
            'All': 'all',
           'Books': 'BOOKS',
           'Articles' : 'ARTICLES',
           'Journals' : 'JOURNALS',
           'Audio' :  'AUDIO',
           'Video' : 'VIDEOS'
        }

        this.queryExactnessTypes = {
            'Contains': 'CONTAINS',
           'Exact': 'EXACT',
           'Begins With' : 'BEGINS_WITH',
        }

        this.sortByTypes = {
            'Relevance': 'RANK',
            'Date Newest' : 'DATE_D',
            'Date Oldest' : 'DATE_A',
            'Author': 'AUTHOR',
            'Title': 'TITLE'
        }

        if(this.props.isReset){
            console.log('reset');
            this.handleReset();

        }

    }

    renderQueryPlaceOptions() {
        return Object.keys(this.queryPlaceOptions).map((queryPlaceOption,index) => {
            let queryPlaceOptionValue = this.queryPlaceOptions[queryPlaceOption];
            return (
                <div key={queryPlaceOptionValue} >
                    <input type="radio" name="query_place" id={queryPlaceOptionValue} value={queryPlaceOptionValue}  onClick={this.handleQueryPlaceChange.bind(this, queryPlaceOptionValue)}/>
                    <label htmlFor={queryPlaceOptionValue} >{queryPlaceOption} </label>
                </div>
            )
        });
    } 


    renderResourceTypeOptions() {
        return Object.keys(this.queryResourceTypes).map((queryResourceType, index) => {
            let queryResourceTypeValue = this.queryResourceTypes[queryResourceType];
            return (
                <div key={queryResourceTypeValue } >
                    <input type="radio" name="resource_type" id={queryResourceTypeValue } value={queryResourceTypeValue }    onClick={this.handleResourceTypeChange.bind(this, queryResourceTypeValue )}/>
                    <label htmlFor={queryResourceTypeValue} >{queryResourceType}</label>
                </div>
            )
        });
    } 
//queryExactness
    renderQueryExactnessOptions() {
        return Object.keys(this.queryExactnessTypes).map((queryExactnessType, index) => {
            let queryExactnessTypeValue = this.queryExactnessTypes[queryExactnessType];
            return (
                <div key={queryExactnessTypeValue } >
                    <input type="radio" name="query_exactness" id={queryExactnessTypeValue } value={queryExactnessTypeValue }    onClick={this.handleQueryExactnessChange.bind(this, queryExactnessTypeValue )}/>
                    <label htmlFor={queryExactnessTypeValue} >{queryExactnessType}</label>
                </div>
            )
        });
    } 


    renderSortByOptions() {
        return Object.keys(this.sortByTypes).map((sortByType, index) => {
            let sortByTypeValue = this.sortByTypes[sortByType];
            return (
                <div key={sortByTypeValue } >
                    <input type="radio" name="sort_by" id={sortByTypeValue + '-sort' } value={sortByTypeValue }    onClick={this.handleSortyByChange.bind(this, sortByTypeValue )}/>
                    <label htmlFor={sortByTypeValue  + '-sort'} >{sortByType}</label>
                </div>
            )
        });
    } 

    handleQueryPlaceChange(query_place, e){
   
        this.setState(
            { query_place: query_place },
            () => this.getParams()
          );
        
   
    }

    handleResourceTypeChange(resource_type){
   
        this.setState(
            { resource_type: resource_type },
            () => this.getParams()
          );
   
    }

    handleQueryExactnessChange(query_exactness){
   
        this.setState(
            { query_exactness: query_exactness },
            () => this.getParams()
          );
  
    }

    handleSortyByChange(sort_by){
 
        this.setState(
            { sort_by: sort_by },
            () => this.getParams()
          );

    }

    handlePeerReviewChange(){
  
        this.setState(
            { peer_reviewed: !this.state.peer_reviewed },
            () => this.getParams()
          );

    }

    handleFullTextChange(){
        this.setState(
            { full_text_online: !this.state.full_text_online },
            () => this.getParams()
          );
    }

    handlePhysicallyChange(){
        this.setState(
            { phys_in_lib: !this.state.phys_in_lib},
            () => this.getParams()
          );
    }

    handleOpenAccessChange(){
        this.setState(
            { open_access : !this.state.open_access},
            () => this.getParams()
          );
    }


    handleReset(){
        this.setState({
            query_place: 'any',
            resource_type: 'all',
            query_exactness: 'contains',
            sort_by: '',
            peer_reviewed: false,
            full_text_online : false,
            phys_in_lib : false,
            open_access : false
        });
       
    }

    getParams(){
        //,\"query_place\":\"newspapers\"
        //let params = '';
        let params = {};

        let query_place = this.state.query_place;
        let resource_type = this.state.resource_type;
        let query_exactness = this.state.query_exactness;
        let sort_by= this.state.sort_by;





        if(query_place != 'any'){
           // params = params + ',\"query_place\":\"'+query_place+'\"';
           params['queryPlace']= query_place;
        }

        if(resource_type!= 'all'){
            //params = params + ',\"resource_type\":\"'+resource_type+'\"';
            //params = {'resource_type': resource_type};
            params['resourceType']= resource_type;
        }

        if(query_exactness != 'contains'){
            //params = params + ',\"query_exactness\":\"'+query_exactness+'\"';
            //params = {'query_exactness': query_exactness};
            params['QueryExactness']= query_exactness;
        }

        if(sort_by != ''){
            //params = params + ',\"sort_by\":\"'+sort_by+'\"';
            //params = {'sort_by': sort_by};
            params['sortBy']= sort_by;
        }

        if(this.state.peer_reviewed){
            //params = params + ',\"peer_reviewed\":\"true\"';
            //params = {'peer_reviewed': true};
            params['peerReviewed']= true;
        }

        if(this.state.full_text_online){
            //params = params + ',\"full_text_online\":\"true\"';
            //params = {'full_text_online': true};
            params['fullTextOnline']= true;
        }

        if(this.state.phys_in_lib){
            //params = params + ',\"phys_in_lib\":\"true\"';
            //params = {'phys_in_lib': true};
            params['physInLib']= true;
        }

        if(this.state.open_access){
            //params = params + ',\"open_access\":\"true\"';
            //params = {'open_access': true};
            params['openAccess']= true;
        }

        console.log(params);
        this.props.getFilteredParams(params);
        
        
    }

   

    searchGroups(){
  

        if(this.props.isReset){
            //this.handleReset();

        }else{

        return(
             <div id="searchGroups">

                <div className="search-group"><h5 className="blue-text">Show:</h5>

                    <div>
                        <input type="checkbox" name="peer_reviewed" id="peer_reviewed" value="true"  onChange={this.handlePeerReviewChange} />
                        <label htmlFor="peer_reviewed">Peer Reviewed</label>
                    </div>

                    <div>
                        <input type="checkbox" name="full_text_online" id="full_text_online" value="true"  onChange={this.handleFullTextChange} />
                        <label htmlFor="full_text_online">Full Text Online</label>
                    
                    </div>

                    <div>
                        <input type="checkbox" name="phys_in_lib" id="phys_in_lib" value="true"  onChange={this.handlePhysicallyChange} />
                        <label htmlFor="phys_in_lib">Physically in the Library</label>
                    </div>

                    <div>
                        <input type="checkbox" name="open_access" id="open_access" value="true"  onChange={this.handleOpenAccessChange} />
                        <label htmlFor="open_access">Open Access</label>
                    
                    </div>




                </div>
                <div className="search-group">
                    <h5 className="blue-text">Search By:</h5>
                    {this.renderQueryPlaceOptions()}

                </div>

                <div className="search-group">
                    <h5 className="blue-text">Item By:</h5>
                    {this.renderResourceTypeOptions()}

                </div>

                <div className="search-group">
                    <h5 className="blue-text">Query Exactness:</h5>
                    {this.renderQueryExactnessOptions()}

                </div>

                <div className="search-group">
                    <h5 className="blue-text">Sort By:</h5>
                    {this.renderSortByOptions()}

                </div>
            </div>
        )
        }

    }


    render(){

        
        
            return(

                


                <div id="searchFilter" className={this.props.isVisible ? 'show' : ''}>

                    {
                       
                            this.searchGroups()
                           
                    }

                   


                </div>

            )
        
    }

}    

export default SearchFilter