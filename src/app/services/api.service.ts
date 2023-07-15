import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { Query, QueryPlaylistArgs, Playlist, MutationCreatePlaylistArgs, QuerySearchArgs, MutationAddTrackArgs } from 'src/typings/api';
import { MutationResult } from 'apollo-angular';
import { MutationUpdatePlaylistNameArgs } from 'src/types/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apollo: ApolloBase;

  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('freqs');
  }
  
  private TRACK_DETAILS_FRAGMENT = gql`
    fragment TrackDetails on Track {
      id
      name
      duration
      submittedBy {
        name
        picture
        id
      }
      votes {
        issuer {
          id
          name
          picture
        }
        comment
      }
    }
  `;

  searchSpotifyTracks(variables: QuerySearchArgs): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      variables,
      query: gql`
        query Search($term: String!) {
          search(term: $term)
        }`,
    }).valueChanges;
  }

  createPlaylist(variables: MutationCreatePlaylistArgs): Observable<MutationResult<{createPlaylist: Playlist }>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreatePlaylist($name: String, $tracks: [TrackInput!]) {
          createPlaylist(name: $name, tracks: $tracks) {
            id
            name
            tracks {
              ...TrackDetails
            }
          }
        }
        ${this.TRACK_DETAILS_FRAGMENT}`,
      variables
    })
}

addTrack(variables: MutationAddTrackArgs): Observable<MutationResult<{ addTrack: Playlist }>> {
  return this.apollo.mutate({
    mutation: gql`
      mutation AddTrack($playlistID: ID!, $track: TrackInput!) {
        addTrack(playlistID: $playlistID, track: $track) {
          id
            name
            tracks {
              ...TrackDetails
           }
        }
      }
      ${this.TRACK_DETAILS_FRAGMENT}`,
      variables
  })
}

updatePlaylistName(variables: MutationUpdatePlaylistNameArgs): Observable<MutationResult<{ updatePlaylistName: Playlist }>> {
  return this.apollo.mutate({
    mutation: gql`
      mutation UpdatePlaylistName($playlistID: ID!, $name: String!) {
        updatePlaylistName(playlistID: $playlistID, name: $name) {
          id
            name
            tracks {
              ...TrackDetails
           }
        }
      }
      ${this.TRACK_DETAILS_FRAGMENT}`,
      variables
  })
}

getPlaylist(playlistId: QueryPlaylistArgs['id']): Observable<ApolloQueryResult<{ playlist: Playlist}>> {
    return this.apollo.watchQuery<{ playlist: Playlist}>({
      variables: { id: playlistId },
      query: gql`
        query Playlist($id: ID!) {
          playlist(id: $id) {
            id
            name
            tracks {
              ...TrackDetails
            }
          }
        }
        ${this.TRACK_DETAILS_FRAGMENT}`,
    }).valueChanges;
  }
}
