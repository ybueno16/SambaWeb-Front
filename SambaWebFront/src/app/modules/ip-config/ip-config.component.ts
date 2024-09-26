import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-ip-config',
  templateUrl: './ip-config.component.html',
  styleUrl: './ip-config.component.scss',
})
export class IpConfigComponent {
  ipConfigForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.ipConfigForm = this.formBuilder.group({
      ip: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(7),
      ]),
      port: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    });
  }
}
