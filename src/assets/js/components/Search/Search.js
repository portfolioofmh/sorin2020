import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import SearchResult from './SearchResult'
import SearchCollectionResult from './SearchCollectionResult'
import Loader from './Loader'
import SearchFilter from './SearchFilter'
import ViewResult from './ViewResult'
import queryString from 'query-string'
import CloneModal from './CloneModal'

import '../../../scss/Search.scss'
const { forwardRef, useRef, useImperativeHandle } = React;

/*
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($searchString: String! $params: SearchParams) {
    searchCatalog(searchString: $searchString, searchParams: $params)
  }
`
*/
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($searchString: String! $params: SearchParams) {
    searchCatalog(searchString: $searchString, searchParams: $params)
  }
`

const SEARCH_COLLECTIONS = gql`
  query searchCollections($searchString: String!){
  searchCollectionsCount(searchString: $searchString)
  searchCollections(searchString: $searchString, limit: 10, offset: 0) {
    clonesCount
    creator
    id
    importsCount
    tags
    title
    updatedAt
    permalink
  }
}
`

class Search extends Component {
  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      results: [],
      searchType: 'catalog',  // catalog or collections
      searchString: '',
      num_results: 0,
      offset: 0,
      limit: 10,
      openModel:false,
      openCloneModal: false,
      openModelIndex: 0,
      filterParams : '',
      showFilter: false,
      resetFilter: false,
      submitted: false,
      loading: false,
      searchCollectionsCount: 0,
      searchCollectionsResults: [],
      saved_results: [], 
      cloneCollection: ''
    }

    this.getFilteredParams = this.getFilteredParams.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.openResourceModal = this.openResourceModal.bind(this);
    this.closeResourceModal = this.closeResourceModal.bind(this);
    this.changeResourceModal = this.changeResourceModal.bind(this);
    this.handleSaveReource = this.handleSaveReource.bind(this);
    this.searchCollections = this.searchCollections.bind(this);
    this.toggleCatalog = this.toggleCatalog.bind(this);
    this.toggleCollections = this.toggleCollections.bind(this);
    this.openCloneModal = this.openCloneModal.bind(this);
    this.openAlert = this.openAlert.bind(this);

    this.searchFilterElement = React.createRef();
    //this.viewResultElement = React.createRef();
    //const viewResultElement= useRef();
    
  }

  componentDidMount(){
   this._isMounted = true;

    if(window.innerWidth < 960){
      this.props.openMobile();
    }



    let url = new URL(window.location.href); 
    //console.log(url)
    var params1 = new URLSearchParams(url.search.slice(1));

    // {queryPlace: "SUB"}


     let queryfilterParams = {};

     if( params1.get('filters') ){
      console.log(params1.get('filters'));
        let queryfilters = params1.get('filters').replace(/[\[\]']+/g,'');
        console.log(queryfilters);
        var vars = queryfilters.split(',');
        console.log(vars);
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split(':');
          if(pair[1] === 'true'){
            console.log('boolean');
            queryfilterParams[pair[0]] = true;
          }else{
            queryfilterParams[pair[0]] = decodeURIComponent(pair[1]);
          }
          
        }
        //queryfilterParams = params1.get('filters') ;
     }


   


    if(params1.get('query') && this._isMounted){
     
      this.setState({searchString: params1.get('query'), filterParams: queryfilterParams},
      () => {
        
        var event = document.createEvent('Event');

        this.executeSearch(event);
        document.getElementById('search-main').value = params1.get('query');
      }
      
    );



    }else{
      this._isMounted = true;
    }
    console.log(localStorage.getItem('searchString'));

    if(this.props.googleSignedIn && localStorage.getItem('searchString')  ){
      
      this.setState({searchString: localStorage.getItem('searchString'), filterParams: JSON.parse(localStorage.getItem('params'))},
      () => {
        
        var event = document.createEvent('Event');

        this.executeSearch(event);
        console.log(localStorage.getItem('searchString'));
        document.getElementById('search-main').value = localStorage.getItem('searchString');
        //localStorage.removeItem('searchString');
        //localStorage.removeItem('params');
      });


      
    }


  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFilteredParams(filterParams){
    this.setState({
      filterParams: filterParams
    });
  }

  showFilter(e){
    //console.log('show filter ');
    this.setState(
      { resetFilter: false }
    );
    if(this.state.showFilter){
      this.setState({
        showFilter: false
      });
    }else{
       this.setState({
        showFilter: true
      });
    }
   
   
  
  }

  toggleCatalog(){
    this.setState({
      searchType: 'catalog'
    });
  }

  toggleCollections(){
    this.setState({
      searchType: 'collections'
    });
  }

  openCloneModal(collectionIndex){
    //console.log(collectionIndex);
    document.getElementById("root").style.position = "fixed";
    this.setState({openCloneModal: true, cloneCollection: collectionIndex});
    
  }



  openResourceModal(resultIndex, resultData){
   // console.log(resultIndex, resultData);
    document.getElementById("root").style.position = "fixed";
    this.setState({openModel: true, openModelIndex: resultIndex} );
    //() => this.viewResultElement.current.checkIfSaved()
   // this.setState({openModelIndex: resultIndex});

  //viewResultElement.current.test();
  }

  changeResourceModal(changeIndex){
   // this.setState({openModelData: resultData});
    //this.setState({openModelIndex: resultIndex});
    

    this.setState({openModelIndex: changeIndex});
  }

  closeResourceModal(){
    //console.log('close');
    this.setState({openModel:false, openCloneModal: false, cloneCollection: ''});
    //this.setState({openModelData: []});
    this.setState({openModelIndex: 0});
    document.getElementById("root").style.position = "relative";
  }

  handleSaveReource(data){
    const savedResultsArray = Array.from(this.state.saved_results);
    savedResultsArray.push(data); 
    this.setState({saved_results: savedResultsArray},
      () => this.props.savedResource(savedResultsArray.length) )
    
  }

  openAlert(message, link){
    console.log('alert');
    this.props.openAlert(message, link);
   // this.alertElement.current.showAlert();
    //this.setState({openAlert: true})
  }

  

  

  loadResults = () => {
    return (
      <div id="results">
      { this.state.results.length === 0 && this.state.searchString !='' && this.state.submitted && !this.state.loading ?  
       <div > NO results <a onClick={this.clearSearch} className="reset"> Reset Search </a> </div>
        : "" }

        { this.state.results.length > 0 ?  
        <a onClick={this.clearSearch} className="reset"> Reset Search </a> 
        : "" }

{this.state.searchType ===  'catalog' ?   
    
        this.state.results.map((result, index) => {

          if (!result) {
            return (null)
          }


          return (
            <SearchResult key={"search-result-" + (index ) } data={result} index={index } id={"search-result-" +(index  )  }  openResourceModal={this.openResourceModal} userId={this.props.userId} savedResource={this.handleSaveReource} allReadySaved={this.state.saved_results} googleSignedIn={this.props.googleSignedIn} openAlert={this.openAlert} />
          )
       
        
          })

          :''}

        {this.state.searchType ===  'collections' ?

        <div>

        {this.state.searchCollectionsResults.map((result, index) => {


          return (
            
            <SearchCollectionResult key={"search-result-" + (index ) } data={result} index={index } id={"search-result-" +(index  )  }  userId={this.props.userId} savedResource={this.handleSaveReource} allReadySaved={this.state.saved_results }  openResourceModal={this.openResourceModal} userId={this.props.userId} openCloneModal={this.openCloneModal} googleSignedIn={this.props.googleSignedIn}/>
          )


          })}

          </div>
              
              : ''}



            <Loader isVisible={this.state.loading} />

            { this.state.results.length > 0 && !this.state.loading && (this.state.results.length < this.state.num_results) && this.state.searchType==='catalog' ? 
            <a  onClick={this.executeSearch} id="load-more">Load More</a>  
                : "" }

          { this.state.results.length > 0 && !this.state.loading ? 
           <a  onClick={this.clearSearch} id="clear">Clear</a> 
                : "" }
      </div>
    )
}
  

  render() {

    return (
     

      <div id="search">
        <form id="search-field" onSubmit={ this.executeSearch}>
          
          <input type="text" id="search-main" placeholder="Search Library Item or Collection"  onChange={e => this.setState({ searchString: e.target.value })}/>

          <a className="search-filter-button" onClick={this.showFilter}>
            <span className="closed filter">Filter<span id="search-arrow"></span></span>
          </a>

          <input type="submit" id="search-submit-btn"></input>
        </form>

        <SearchFilter  isVisible={this.state.showFilter} isReset={this.state.resetFilter} getFilteredParams={this.getFilteredParams} ref={this.searchFilterElement} />

       
        

        { this.state.results.length > 0  ? 
            <a className={'num_results ' + (this.state.searchType  === 'catalog' ? 'active' : '')} onClick={this.toggleCatalog}> Resoures ({this.state.num_results})  </a>
                : "" }

        { this.state.searchCollectionsCount > 0  ? 
            <a className={'num_results ' + (this.state.searchType === 'collections' ? 'active' : '')} onClick={this.toggleCollections}> Collections ({this.state.searchCollectionsCount})  </a>
                : "" }    

       
        {this.loadResults()}
       


        






      <ViewResult isOpen={this.state.openModel}     
      userId={this.props.userId} 
      data={this.state.searchType === 'catalog' ? this.state.results[this.state.openModelIndex] : this.state.searchCollectionsResults[this.state.openModelIndex]} 
      index={this.state.openModelIndex} 
      closeResourceModal={this.closeResourceModal} 
      numOfResults={this.state.searchType === 'catalog' ? this.state.results.length : this.state.searchCollectionsCount} 
      changeResourceModal={this.changeResourceModal} 
      savedResource={this.handleSaveReource}  
      allReadySaved={this.state.saved_results} 
      ref={this.viewResultElement}
      openCloneModal={this.openCloneModal}
      googleSignedIn={this.props.googleSignedIn}/>

      <CloneModal collectionGroups={this.props.collectionGroups} userId={this.props.userId} isOpen={this.state.openCloneModal} closeResourceModal={this.closeResourceModal} cloneCollection={this.state.cloneCollection} />
      </div>
      


    )
  }
  
  executeSearch = async (e) => {
    
    e.preventDefault();
    this.setState({
      showFilter: false
    });

    let prev = [];

    let  offset  = this.state.offset;
    let loadMore = false; 

    if(e.target){
       if(e.target.id === 'load-more'){
        offset = offset + this.state.limit;
        this.setState({ offset: offset });
        //this.setState({ results: [] });
        prev = this.state.results;
        //console.log(prev);
        loadMore = true; 

  
      }else{
        offset = 0;
        this.setState({ offset: offset });
        this.setState({ results: [], searchCollectionsResults: [], searchCollectionsCount: 0});
        this.setState({num_results: 0});
        loadMore = false; 
      }
    }else{
      offset = 0;
      this.setState({ offset: offset });

      loadMore = false; 
    }
   
    
    const  searchString  = this.state.searchString;

    this.setState({ loading: true });

    //"{\"limit\":10, \"offset\":0}"
    const  filterParams = this.state.filterParams;
   // console.log('filter param' + filterParams);

    //const params = '{\"limit\":'+ this.state.limit +', \"offset\":'+offset+ filterParams +'}';

    // {'limit':10}

    const params = {'limit': this.state.limit , 'offset': offset};
    const paramsMerged = {...params, ...filterParams};
    
    if(!this.props.googleSignedIn){
      console.log('google cleareed')
      localStorage.setItem('searchString', searchString);
      localStorage.setItem('params', JSON.stringify(paramsMerged));
    }


    //console.log(searchString);
    //const result = await this.props.client.query({
    const result =this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: {
        searchString: searchString,
        params: paramsMerged
      },
    }).then(response => {
               
      //console.log(this.state.loading);
      //console.log( response);

      if (this._isMounted) {
      this.setState({
        submitted: true, 
        loading: false
      },
      () => {
        //console.log(this.state.loading) ;
          const searchResults = response.data.searchCatalog;
          const searchResultsParsed = JSON.parse(searchResults);
          this.setState({num_results: searchResultsParsed.num_results})
          const results = searchResultsParsed.results;
      
          if(loadMore){
            let allResults = prev.concat(results) 
            this.setState({ results: allResults })
          }else{
            this.setState({ results: results })
            this.searchCollections();
          }
          this.setState({ loading: false });

          


      }
    
      
      
      );
      

    }
      


    });


    
  }

  searchCollections(){
    const result =this.props.client.query({
      query:SEARCH_COLLECTIONS,
      variables: {
        searchString: this.state.searchString
      },
    }).then(response => {

      if(response.data.searchCollectionsCount > 0){

        //add collection type

        let collectionsArray = []

        for(let i=0; i < response.data.searchCollectionsCount; i++){
          let setType = { type: 'collection'};
          let collectionInfo = response.data.searchCollections[i];
          let merged = {...collectionInfo, ...setType }
          collectionsArray[i] = merged;

        }

        this.setState(
          {
            searchCollectionsResults: collectionsArray,
            searchCollectionsCount: response.data.searchCollectionsCount
          }
        )
      }
               
      
    });

  }

  clearSearch = () =>{

    let  offset  = this.state.offset;
    offset = 0;
    this.setState({ offset: offset });
    this.setState({ results: [], searchCollectionsResults: [] });
    this.setState({searchString: ''})
    this.setState({num_results: 0, searchCollectionsCount: 0})
    this.setState({submitted: false});
    this.setState({loading: false, searchCollectionsCount: 0, searchCollectionsResults: [], searchType: 'catalog'});
    document.getElementById("search-main").value = '';
    this.setState({
      showFilter: false
    });
    this.setState(
      { resetFilter: true }
    );
    localStorage.removeItem('searchString');
    localStorage.removeItem('params');

    this.searchFilterElement.current.handleReset();

    


  }

  

 

}

export default withApollo(Search)