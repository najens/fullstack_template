import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import App from './App';

// Change to domain for production
const httpLink = new HttpLink({ uri: 'http://localhost:8080/graphql' });
// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

export default class ApolloApp extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <Route exact path='/' component={App} />
                </BrowserRouter>
            </ApolloProvider>
        );
    }
}
