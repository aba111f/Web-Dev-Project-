import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfitComponent } from './new-profit.component';

describe('NewProfitComponent', () => {
  let component: NewProfitComponent;
  let fixture: ComponentFixture<NewProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProfitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
