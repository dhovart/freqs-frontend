export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JsonNode: { input: any; output: any; }
};

export type Artist = {
  __typename?: 'Artist';
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  spotifyId: Scalars['String']['output'];
};

export type ArtistInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  spotifyId: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTrack?: Maybe<Playlist>;
  createPlaylist?: Maybe<Playlist>;
  voteForTrack?: Maybe<Playlist>;
};


export type MutationAddTrackArgs = {
  playlistID: Scalars['ID']['input'];
  track: TrackInput;
};


export type MutationCreatePlaylistArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  tracks?: InputMaybe<Array<TrackInput>>;
};


export type MutationVoteForTrackArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  playlistID: Scalars['ID']['input'];
  trackID: Scalars['ID']['input'];
};

export type Playlist = {
  __typename?: 'Playlist';
  creator: User;
  currentTrack?: Maybe<Track>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  tracks: Array<Maybe<Track>>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  playlist?: Maybe<Playlist>;
  playlists?: Maybe<Array<Maybe<Playlist>>>;
  search?: Maybe<Scalars['JsonNode']['output']>;
};


export type QueryPlaylistArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPlaylistsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};

export type Track = {
  __typename?: 'Track';
  albumName: Scalars['String']['output'];
  artists: Array<Artist>;
  duration: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  spotifyAlbumId?: Maybe<Scalars['String']['output']>;
  spotifyId: Scalars['String']['output'];
  submittedBy: User;
  votes: Array<Vote>;
};

export type TrackInput = {
  albumName: Scalars['String']['input'];
  artists: Array<ArtistInput>;
  duration: Scalars['Float']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  spotifyAlbumId?: InputMaybe<Scalars['String']['input']>;
  spotifyId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
};

export type Vote = {
  __typename?: 'Vote';
  comment: Scalars['String']['output'];
  issuer: User;
};
