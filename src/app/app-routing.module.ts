import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HomeComponent } from './home/home.component';
import { PlaylistCreatorComponent } from './playlist-creator/playlist-creator.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Freqs'
  },
  {
    path: 'new-playlist',
    component: PlaylistCreatorComponent,
    title: 'Create a playlist'
  },
  {
    path: 'search',
    component: SearchResultsComponent,
    title: 'Search for songs'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
