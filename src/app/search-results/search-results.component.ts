import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  term = '';
  results$!: Observable<any[]>;

  constructor(private apiService: ApiService) { }

  search(): void {
    this.results$ = this.apiService.searchSpotifyTracks(this.term).pipe(
      map(response => response.data.search.tracks.items)
    );
  }

  addToPlaylist(track: any) {}

}
