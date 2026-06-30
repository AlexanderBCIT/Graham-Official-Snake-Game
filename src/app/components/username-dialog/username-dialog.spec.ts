import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameDialog } from './username-dialog';

describe('UsernameDialog', () => {
  let component: UsernameDialog;
  let fixture: ComponentFixture<UsernameDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
