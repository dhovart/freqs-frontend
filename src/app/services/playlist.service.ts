import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, catchError, of, switchMap, Subscription, take } from 'rxjs';
import { Playlist, TrackInput } from '@typings/api';
import { ApiService } from '@services/api.service';
import { MutationResult } from 'apollo-angular';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {

  private playlistSubject = new BehaviorSubject<Partial<Playlist>>({ name: '', tracks: [] });
  playlist$ = this.playlistSubject.asObservable();

  private trackAddedSubscription?: Subscription;
  private trackMovedSubscription?: Subscription;

  constructor(private apiService: ApiService, private location: Location) {}

  fetchPlaylistById(id: string): Observable<Playlist> {
    return this.apiService.getPlaylist(id).pipe(map((result) => result.data.playlist));
  }

  onNewPlaylistCreated(playlist: Playlist) {
    this.initTrackAddedSubscription(playlist.id)
    this.initTrackMovedSubscription(playlist.id)
    this.playlistSubject.next(playlist)
    this.location.replaceState(`/playlist/${playlist.id}`)
  }


  initTrackMovedSubscription(playlistID: string) {
    if (playlistID && !this.trackMovedSubscription) {
      this.trackMovedSubscription = this.apiService.subscribeToTrackMoved(playlistID).subscribe(({ data }) => {
        const playlist = this.playlistSubject.value;
        if (playlist.tracks && data?.trackMoved) {
          const tracks = [...playlist.tracks]
          moveItemInArray(tracks, data.trackMoved.oldPosition, data.trackMoved.newPosition)
          this.playlistSubject.next({ ...playlist, tracks });
        }
      });
    }
  }

  initTrackAddedSubscription(playlistID: string) {
    if (playlistID && !this.trackAddedSubscription) {
      this.trackAddedSubscription = this.apiService.subscribeToTrackAdded(playlistID).subscribe(({ data }) => {
        const currentPlaylist = this.playlistSubject.value;
        if (data?.trackAdded.track) {
          const updatedPlaylist = {...currentPlaylist, tracks: [...currentPlaylist.tracks ?? [], data.trackAdded.track]};
          this.playlistSubject.next(updatedPlaylist);
        }
      });
    }
  }

  fetchOrInitEmptyPlaylist(id$: Observable<string| null>) {
    return id$.pipe(
      switchMap(id => {
        if (id) {
          return this.fetchPlaylistById(id).pipe(
            tap(this.onNewPlaylistCreated.bind(this))
          );
        }
        return of({
          id: undefined,
          name: '',
          tracks: []
        });
      })
    ).subscribe((playlist: Partial<Playlist>) => this.playlistSubject.next(playlist))
  }

  createPlaylist(
    playlist: Partial<Playlist>,
    tracks: TrackInput[] = []
  ): Observable<Partial<Playlist>> {
    return this.apiService.createPlaylist({
      name: playlist.name,
      tracks
    }).pipe(
      map((result: MutationResult<{ createPlaylist: Playlist }>) => result.data!.createPlaylist), // FIXME handle error
      tap(this.onNewPlaylistCreated.bind(this)),
      catchError(error => {
        console.error('Error creating playlist:', error);
        return of(playlist);
      }),
    );
  }

  onTrackSelected(track: TrackInput) {
    this.playlist$.pipe(
      take(1),
      switchMap(playlist => {
        if (playlist.id) {
          return this.apiService.addTrack({playlistID: playlist.id, track });
        } else {
          return this.createPlaylist(playlist, [track])
        }
      })
    ).subscribe({
      error: () => console.error(this)
   })
  }

  onNameChanged(newName: string) {
    const playlist = this.playlistSubject.value;
    this.playlistSubject.next({...playlist, name: newName});
  }

  updatePlaylistNameOrCreateNew() {
    this.playlistSubject.pipe(
      take(1),
      switchMap(playlist => {
        if (playlist.id) {
          if (!playlist.name) return of(playlist)
          return this.apiService.updatePlaylistName({ playlistID: playlist.id, name: playlist.name }).pipe(
            map((result: any) => result.data.updatePlaylistName),
            catchError(error => {
              console.error('Error updating playlist:', error);
              return of(playlist);
            }),
          );
        } 
        else {
          return this.createPlaylist(playlist)
        }
      }),
    ).subscribe(updatedPlaylist => this.playlistSubject.next(updatedPlaylist));
  }

  reorderTrack(previousIndex: number, currentIndex: number): void {
    const currentPlaylist = this.playlistSubject.value;
    const movedTrack = currentPlaylist.tracks?.[previousIndex];
    if (currentPlaylist.tracks && movedTrack) {
      const newPosition = currentIndex;
      if (currentPlaylist.id && movedTrack?.id) {
        this.apiService.updatePlaylistTrackPosition({
          playlistID: currentPlaylist.id, trackID: movedTrack.id, newPosition
        }).pipe(
          map((result: MutationResult<{ updatePlaylistTrackPosition: Playlist }>) => result.data!.updatePlaylistTrackPosition),
          catchError(error => {
            console.error('Error moving track:', error);
            return of(null);
          }),
        ).subscribe((playlist: Playlist | null) => {
          if(playlist) this.playlistSubject.next(playlist)
        })
      }
    }
  }
  

}
