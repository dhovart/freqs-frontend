import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistCreatorComponent } from './playlist-creator.component';

describe('PlaylistCreatorComponent', () => {
  let component: PlaylistCreatorComponent;
  let fixture: ComponentFixture<PlaylistCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistCreatorComponent]
    });
    fixture = TestBed.createComponent(PlaylistCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
