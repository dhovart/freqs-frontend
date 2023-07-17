import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '@services/api.service';
import { Playlist, TrackInput } from '@typings/api';
import { BehaviorSubject, map, take, switchMap, of, tap, catchError, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SpotifyTrackSearchComponent } from '@components/spotify-track-search/spotify-track-search.component'
import { StealthInputComponent } from '@components/forms/stealth-input/stealth-input.component'
import { CommonModule } from '@angular/common';
import { MutationResult } from 'apollo-angular';

@Component({
  standalone: true,
  selector: 'freqs-pages-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  imports: [CommonModule, StealthInputComponent, SpotifyTrackSearchComponent],
  styleUrls: ['./playlist-editor.component.scss']
})
export class PlaylistEditorComponent implements OnInit, OnDestroy {
  private playlistSubject = new BehaviorSubject<Partial<Playlist>>({ name: '', tracks: [] });
  private trackAddedSubscription?: Subscription;
  playlist$ = this.playlistSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? null),
      switchMap(id => {
        if (id) {
          return this.apiService.getPlaylist(id).pipe(map(result => result.data.playlist));
        }
        return of({
          id: undefined,
          name: '',
          tracks: []
        });
      }),
    ).subscribe((playlist: Partial<Playlist>) => this.playlistSubject.next(playlist));
  }

  onNewPlaylistCreated(playlist: Playlist) {
    this.initTrackAddedSubscription(playlist.id)
    this.playlistSubject.next(playlist)
    this.location.replaceState(`/playlist/${playlist.id}`)
  }

  createPlaylist(playlist: Partial<Playlist>, tracks: TrackInput[] = []) {
    return this.apiService.createPlaylist({
      name: playlist.name,
      tracks
    }).pipe(
      map((result: MutationResult<{ createPlaylist: Playlist }>) => result.data!.createPlaylist),
      tap((newPlaylist: Playlist) => this.onNewPlaylistCreated(newPlaylist)),
      catchError(error => {
        console.error('Error creating playlist:', error);
        return of(playlist);
      }),
    );
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
      // not defining a `next` handler, we're handling the track added in the graphql trackAdded subscription callback
      error: () => console.error(this)
   })}

  onNameChanged(newName: string) {
    const playlist = this.playlistSubject.value;
    this.playlistSubject.next({...playlist, name: newName});
  }

  onNameBlur() {
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

    ngOnDestroy(): void {
      this.trackAddedSubscription?.unsubscribe();
    }

}
