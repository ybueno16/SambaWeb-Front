import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpConfigComponent } from './ip-config.component';

describe('IpConfigComponent', () => {
  let component: IpConfigComponent;
  let fixture: ComponentFixture<IpConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IpConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
