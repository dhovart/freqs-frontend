import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyTrackSearchComponent } from './spotify-track-search.component';

describe('SpotifyTrackSearchComponent', () => {
  let component: SpotifyTrackSearchComponent;
  let fixture: ComponentFixture<SpotifyTrackSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpotifyTrackSearchComponent]
    });
    fixture = TestBed.createComponent(SpotifyTrackSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
