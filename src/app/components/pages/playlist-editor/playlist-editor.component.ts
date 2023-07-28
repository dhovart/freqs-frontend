import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StealthInputComponent } from '@components/forms/stealth-input/stealth-input.component';
import { SpotifyTrackSearchComponent } from '@components/spotify-track-search/spotify-track-search.component';
import { PlaylistService } from '@services/playlist.service';
import { Track, TrackInput } from '@typings/api';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'freqs-pages-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  imports: [
    CommonModule,
    StealthInputComponent,
    SpotifyTrackSearchComponent,
    CdkDropList,
    CdkDrag
  ],
  styleUrls: ['./playlist-editor.component.scss']
})
export class PlaylistEditorComponent implements OnInit, OnDestroy {

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map(params => params.get('id') ?? null));
    this.playlistService.fetchOrInitEmptyPlaylist(id$);
  }

  ngOnDestroy(): void {
      this.playlistService.cleanup();
  }

  get playlist$() {
    return this.playlistService.playlist$
  }

  onNameChanged(name: string) {
    return this.playlistService.onNameChanged(name);
  }

  onNameBlur() {
    return this.playlistService.updatePlaylistNameOrCreateNew();
  }

  onTrackSelected(track: TrackInput) {
    return this.playlistService.onTrackSelected(track);
  }

  drop(event: CdkDragDrop<Track>) {
    return this.playlistService.reorderTrack(event.previousIndex, event.currentIndex);
  }

}
