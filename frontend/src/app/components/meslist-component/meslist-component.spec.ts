import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeslistComponent } from './meslist-component';

describe('MeslistComponent', () => {
  let component: MeslistComponent;
  let fixture: ComponentFixture<MeslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
