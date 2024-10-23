import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { IServerConfig } from './interfaces/server-config-interface';
import { FormValidations } from '../../@shared/validators/form-validations';
import { ApiConfigService } from '../../utils/api-config.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-server-config',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiConfigService],
  templateUrl: './server-config.component.html',
  styleUrls: ['./server-config.component.scss'],
})
export class ServerConfigComponent {
  ipConfig = new FormGroup({
    ip: new FormControl('', [
      Validators.required,
      FormValidations.ipOrUrlValidator(),
    ]),
    port: new FormControl('', [
      Validators.required,
      FormValidations.portValidator(),
    ]),
  });

  constructor(private apiConfig: ApiConfigService) { }

  public onSubmit(): void {
    const serverConfig: IServerConfig = {
      ip: this.ipConfig.get('ip')!.value ?? '',
      port: parseInt(this.ipConfig.get('port')!.value ?? '8080', 10),
    };
    this.apiConfig.updateApiUrl(serverConfig.ip, serverConfig.port);
    console.log(this.apiConfig.getApiUrl());

    this.apiConfig
      .saveServerConfig(serverConfig)
      .pipe(
        catchError((error: any) => {
          console.error('Erro ao salvar servidor:', error);
          return throwError(() => error);
        }),
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
