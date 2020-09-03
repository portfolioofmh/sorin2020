import React, { Component } from "react"
import { useQuery } from 'urql'
import gql from 'graphql-tag'
import SearchResult from './SearchResult'
//import searchTerm from '../../actions/search'


let links = [];
let prevResults = [];
let offset = 0;
let pause = true;
let timer;
let searchResults = [];

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!, $offset: Int) {
    catalogSearch(searchString:$filter, limit: 10, offset: $offset)
  }
`




const SearchBar = () => {

  

  
  //document.getElementById("loadmore").style.display = 'none';
  const handleSubmit = (e) => {
    console.log(e.target.id);
    e.preventDefault();

    if(e.target.id === 'load-more'){
      offset= offset+10;
      prevResults = links;
      searchResults = [];
      searchResults.length = 0;


    
    pause = false;
    }else{
      offset = 0;
      searchResults = [];
      prevResults = [];
      num_results = '';
      pause = false;
    }
    
    executeQuery();
    
  }

 let num_results;
  const loadResults = () => {
  
    offset = parseInt(offset);
    searchResults = result.data ? result.data.catalogSearch : [];
    
   

    if (result.fetching) {

      //console.log(result);
      console.log('Loading...');
      
      return (
        <div id="results"> Loading....</div>
      )
      
      document.getElementById("loader").innerHTML = "Loading....";
      document.getElementById("loader").style.display = 'block';
      
      
  
    } else if (result.error) {
      console.log(result.error);

    }
    


    if(result.data ){

      console.log(result);
      
      var searchResultsParsed = JSON.parse(searchResults);
      //console.log(searchResultsParsed.num_results);
      num_results = searchResultsParsed.num_results + ' results';
      links = searchResultsParsed.results;

      
      
      console.log('offset ' + offset);

      if(offset > 0){
        //console.log('prevResults' + prevResults.length);
      }

      //links = prevResults.concat(links);

      console.log(links);
    //console.log('offset ' + offset);
    

    return(
      
        <div id="results">    
           {links.map((link, index) => (
                <SearchResult key={"search-result-" + (index + offset) } data={link} index={index + offset} id={"search-result-" + index  + offset)} />
            ))}
          {searchResults.length > 0 ?  <a  onClick={handleSubmit} id="load-more">Load More</a> : "" }
        
        
        </div>  
      )
      
    }
   

    
    

  }

  const loadMore = (e) => {
    console.log('start reload');

    e.preventDefault();
    offset= offset+10;
    prevResults = links;
    //console.log('prevResults' + prevResults.length);
    searchResults = [];
    searchResults.length = 0;
    //console.log('offset ' + offset);
    
    pause = false;
    executeQuery();
    //timer = setTimeout(function(){ clearTimeout(timer);  executeQuery(); }, 1000);

    
   
  }

  const resetField = () =>{
    console.log('pause');
    pause = pause;
    
  }
  

  const clearSearch = () =>{
    offset = 0;
    document.getElementById("search-main").value = '';
    document.getElementById("numof").style.display = 'none';

    searchResults = [];
    prevResults = [];
    num_results = '';
    pause = true;

    /*
    //filter = '';
    setFilter('')
    links = [];
    executeQuery();
    
    let element = document.getElementById("results");
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    */

  }

    
  const [filter, setFilter] = React.useState('');
  //console.log('offset ' + offset);

  
  /*
  if(offset === 0){
    pause = true;
  }
  */
// console.log('pause ' + pause);
  const [result, executeQuery] = useQuery({
    query: FEED_SEARCH_QUERY,
    variables: {
      filter: filter,
      offset: parseInt(offset)
    },
    pause: true,
  })

  


/*
  const search = React.useCallback(() => {
    
    executeQuery();
  }), [executeQuery]);
  */


  //console.log(links);
  
  return (
    <div id="search">
      <form id="search-field" onSubmit={handleSubmit}>
        
        <input type="text" id="search-main" placeholder="Search Library Item or User"  onChange={e => setFilter(e.target.value)} onClick={resetField }/>
      </form>
      <a id="clearsearch" onClick={clearSearch} >Clear Search</a>
      <div id="loader"></div>
      <div id="results-container">
        <div id="numof"> </div>


           {loadResults()}

      </div>
         
     

    </div>
  )
}

export default SearchBar

/*
<div>{link.title}</div>

const FEED_SEARCH_QUERY = gql`
      query FeedSearchQuery($filter: String!) {
        catalogSearch(searchString:$filter, limit: 5, offset: 0)
      }
    `
let links = [];
  

  
  



class SearchBar extends Component {


  
  const searchTerm(){
    const [filter, setFilter] = React.useState('')
  
    const [result, executeQuery] = useQuery({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
      pause: true,
    })
  
  
    const search = React.useCallback(() => {
      executeQuery();
    }, [executeQuery]);
  
  }


  

   
    constructor(props){
        super(props);
        this.state = {
            term: ''
        };
        this.handleTermChange = this.handleTermChange.bind(this);
        
    } 

    

    handleTermChange(event){
        this.setState({term: event.target.value});
    }

    handleSearch(event) {

       
        event.preventDefault();
        let term = document.getElementById("term").value;

        //this.props.dispatch( searchTerm(this.state.term) );
        searchTerm(term);
    }

    
    
    
    render() {
        //searchTerm = (term) => {
    


   

  //}

        return (
            <div>
              <div>
                Search
                <input
                  type='text' id="term" onChange={this.handleTermChange}
                />
                <button onClick={this.handleSearch}>search</button>
              </div>
            </div>
          )
    }

}

export default SearchBar

*/

