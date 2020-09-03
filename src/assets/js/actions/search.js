import React from "react"
import { useQuery } from 'urql'
import gql from 'graphql-tag'


let term;

const FEED_SEARCH_QUERY = gql`
     query FeedSearchQuery($term: String!) {
    catalogSearch(searchString:$term, limit: 5, offset: 0)
    }`;

function searchTerm(){

    let filter;

    

   /*
    
  const [filter, setFilter] = React.useState('')
 
  const [result, executeQuery] = useQuery({
    query: FEED_SEARCH_QUERY,
    variables: { filter },
    pause: true,
  })

  const search = React.useCallback(() => {
    executeQuery();
  });

  const searchResults = result.data ? result.data.catalogSearch : [];
  let links;
  if(searchResults.length > 0){
    var searchResultsParsed = JSON.parse(searchResults);
    links = searchResultsParsed.results;
    
  }

  console.log(links);
  
  */
  return {}


}

export default searchTerm;




/*


const SearchTerm = {
    search(term, location, sortBy){

    }


}

export default SearchTerm;


const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    catalogSearch(searchString:$filter, limit: 5, offset: 0)
  }
`;

let links = [];
const searchTerm = () => {

    search(term){
        console.log(term)
    }

   
   
    
  const [filter, setFilter] = React.useState('')
 
  const [result, executeQuery] = useQuery({
    query: FEED_SEARCH_QUERY,
    variables: { filter },
    pause: true,
  })

  const search = React.useCallback(() => {
    executeQuery();
  });

  const searchResults = result.data ? result.data.catalogSearch : [];

  if(searchResults.length > 0){
    var searchResultsParsed = JSON.parse(searchResults);
    links = searchResultsParsed.results;
    
  }

  console.log(links);
  
  
  return (
    
    //links;
    /*<div>
      <div>
        Search
        <input
          type='text'
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={search}>search</button>
      </div>
      {links.map((link, index) => (
             <div>{link.title}</div>
           
        ))}

    </div>
    
  )
}

*/