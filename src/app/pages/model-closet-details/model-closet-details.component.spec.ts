import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelClosetDetailsComponent } from './model-closet-details.component';

describe('ModelClosetDetailsComponent', () => {
  let component: ModelClosetDetailsComponent;
  let fixture: ComponentFixture<ModelClosetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelClosetDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelClosetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
