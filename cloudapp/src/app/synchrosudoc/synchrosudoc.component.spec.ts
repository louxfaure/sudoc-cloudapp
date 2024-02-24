import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchrosudocComponent } from './synchrosudoc.component';

describe('SynchrosudocComponent', () => {
  let component: SynchrosudocComponent;
  let fixture: ComponentFixture<SynchrosudocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynchrosudocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynchrosudocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
