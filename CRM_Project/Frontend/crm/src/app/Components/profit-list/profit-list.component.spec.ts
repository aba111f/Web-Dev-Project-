import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitListComponent } from './profit-list.component';

describe('ProfitListComponent', () => {
  let component: ProfitListComponent;
  let fixture: ComponentFixture<ProfitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
