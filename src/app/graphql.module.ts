import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

const uri = 'http://192.168.29.17:8000/'; // <-- add the URL of the GraphQL server here
export function createApollo(): ApolloClientOptions<any> {

  const http = createHttpLink({ uri });

  const apolloAuthContext = setContext(async (_, {headers}) => {
    const jwt_token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            Authorization: jwt_token ? `${jwt_token}` : ''
        },
    }
})

  return {
    link: apolloAuthContext.concat(http),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
