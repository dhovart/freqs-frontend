import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apollo: ApolloBase;

  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('freqs');
  }

  searchSpotifyTracks(term: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      variables: { term },
      query: gql`
        query Search($term: String!) {
          search(term: $term)
        }`,
    }).valueChanges;
  }

}
