import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { InMemoryCache, split } from '@apollo/client/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '@components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ApolloModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {

        const http = httpLink.create({
          uri: 'http://localhost:8080/graphql', // FIXME
          withCredentials: true
        });
 
        const ws = new GraphQLWsLink(createClient({
          url: 'ws://localhost:8080/graphql',
        }))

        const link = split(
          // split based on operation type
          ({ query }) => {
            const definition = getMainDefinition(query);
            return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
          },
          ws,
          http,
        );

        return {
          freqs: {
            cache: new InMemoryCache(),
            link,
          },
        };
      },
      deps: [HttpLink],
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
