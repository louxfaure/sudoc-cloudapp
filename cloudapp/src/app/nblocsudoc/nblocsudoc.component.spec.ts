import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NblocsudocComponent } from './nblocsudoc.component';

describe('NblocsudocComponent', () => {
  let component: NblocsudocComponent;
  let fixture: ComponentFixture<NblocsudocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NblocsudocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NblocsudocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
