import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StealthInputComponent } from './stealth-input.component';

describe('StealthInputComponent', () => {
  let component: StealthInputComponent;
  let fixture: ComponentFixture<StealthInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StealthInputComponent]
    });
    fixture = TestBed.createComponent(StealthInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
