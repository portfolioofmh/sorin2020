import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './assets/js/components/App/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
/*


import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { BrowserRouter } from 'react-router-dom'

const client = new Client({
  url: 'http://localhost:4000/graphiql'
})


ReactDOM.render(
  <BrowserRouter>
    <Provider value={client}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

*/

// 1
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


// 2
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphiql'
})

// 3
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  dataIdFromObject: o => o.id
})

// 4
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
