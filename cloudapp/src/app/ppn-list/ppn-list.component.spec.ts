import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpnListComponent } from './ppn-list.component';

describe('PpnListComponent', () => {
  let component: PpnListComponent;
  let fixture: ComponentFixture<PpnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PpnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
