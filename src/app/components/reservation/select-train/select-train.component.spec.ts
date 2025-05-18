import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTrainComponent } from './select-train.component';

describe('SelectTrainComponent', () => {
  let component: SelectTrainComponent;
  let fixture: ComponentFixture<SelectTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTrainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
