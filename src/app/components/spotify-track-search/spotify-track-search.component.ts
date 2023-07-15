import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ApiService } from '@services/api.service';
import { FormsModule } from '@angular/forms';
import { TrackInput } from '@typings/api';

@Component({
  selector: 'freqs-spotify-track-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spotify-track-search.component.html',
  styleUrls: ['./spotify-track-search.component.scss']
})
export class SpotifyTrackSearchComponent {
  term = '';
  results$!: Observable<any[]>;
  @Output() trackSelected = new EventEmitter<TrackInput>()

  constructor(private apiService: ApiService) { }

  search(): void {
    this.results$ = this.apiService.searchSpotifyTracks({ term: this.term}).pipe(
      map(response => response.data.search.tracks.items)
    );
  }

  find300pxImage(image: { width: number, height: number, url: string}) { return image.width === 300 }

  selectTrack(track: any) {
    const trackInput: TrackInput = {
      spotifyId: track.id,
      name: track.name,
      albumName: track.album.name,
      spotifyAlbumId: track.album.id,
      image: track.album.images.find(this.find300pxImage)?.url,
      duration: track.duration_ms,
      artists: track.artists.map(
        (artist: any) => ({
          spotifyId: artist.id,
          name: artist.name,
        }
      ))
    }
    this.trackSelected.emit(trackInput)
  }

}
