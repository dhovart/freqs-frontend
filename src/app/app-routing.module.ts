import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@components/pages/home/home.component';
import { PlaylistEditorComponent } from '@components/pages/playlist-editor/playlist-editor.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Freqs'
  },
  {
    path: 'playlist',
    component: PlaylistEditorComponent,
    title: 'New playlist'
  },
  {
    path: 'playlist/:id',
    component: PlaylistEditorComponent,
    title: 'Edit a playlist'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
