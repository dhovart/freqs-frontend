import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@services/api.service';
import { Playlist, TrackInput } from '@typings/api';
import { map, take, switchMap, of, catchError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SpotifyTrackSearchComponent } from '@components/spotify-track-search/spotify-track-search.component'
import { StealthInputComponent } from '@components/forms/stealth-input/stealth-input.component'
import { CommonModule } from '@angular/common';

type PlaylistWithDefinedFields = Partial<Playlist> & Pick<Playlist, 'name' | 'tracks'>

@Component({
  standalone: true,
  selector: 'freqs-pages-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  imports: [CommonModule, StealthInputComponent, SpotifyTrackSearchComponent],
  styleUrls: ['./playlist-editor.component.scss']
})
export class PlaylistEditorComponent implements OnInit {
  private playlistSubject = new BehaviorSubject<PlaylistWithDefinedFields>({ name: '', tracks: [] });
  playlist$ = this.playlistSubject.asObservable();

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id') || null),
      switchMap(id => {
        if (id) {
          return this.apiService.getPlaylist(id).pipe(map(result => result.data.playlist));
        }
        return of({
          name: '',
          tracks: []
        });
      }),
    ).subscribe(playlist => this.playlistSubject.next(playlist));
    }

  onTrackSelected(track: TrackInput) {
    this.playlist$.pipe(
      take(1),
      switchMap(playlist => {
        if (playlist.id) {
          return this.apiService.addTrack({playlistID: playlist.id, track });
        } else {
          return this.apiService.createPlaylist({
            name: playlist.name,
            tracks: [track]
          });
        }
      })
    ).subscribe({
      next: (res: any) => { // FIXME
        if (res.data) {
          const newPlaylist = res.data.createPlaylist || res.data.addTrack;
          this.playlistSubject.next(newPlaylist);   
        }
      },
      error: () => console.error(this)
   })}

   onNameChanged(newName: string) {
    this.playlistSubject.pipe(
      take(1),
      map(playlist => ({...playlist, name: newName}))
    ).subscribe(playlist => this.playlistSubject.next(playlist));
  }

  onNameBlur() {
    this.playlistSubject.pipe(
      take(1),
      switchMap(playlist => {
  
        if (playlist.id) {
          return this.apiService.updatePlaylistName({ playlistID: playlist.id, name: playlist.name }).pipe(
            map((result: any) => result.data.updatePlaylistName), // FIXME any
            catchError(error => {
              console.error('Error updating playlist:', error);
              return of(playlist);
            }),
          );
        } 
        else {
          return this.apiService.createPlaylist({ name: playlist.name }).pipe(
            map((result: any) => result.data.createPlaylist), // FIXME any
            catchError(error => {
              console.error('Error creating playlist:', error);
              return of(playlist);
            }),
          );
        }
      }),
    ).subscribe(updatedPlaylist => this.playlistSubject.next(updatedPlaylist));
    }

}
