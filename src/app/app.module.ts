import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_NAMED_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlaylistCreatorComponent } from './playlist-creator/playlist-creator.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaylistCreatorComponent
  ],
  imports: [
    BrowserModule,
    ApolloModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          freqs: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://localhost:8080/graphql', // FIXME
              withCredentials: true
            }),
          },
        };
      },
      deps: [HttpLink],
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
