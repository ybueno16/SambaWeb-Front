import { Injectable } from '@angular/core';
import { api_routes } from '../../../@shared/api-routes';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interfaces/login-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  #URL = `${environment.API_URL_SAMBA}/${api_routes.LOGIN}`;

  constructor(private readonly http: HttpClient) { }

  login(body: ILogin) {
    return this.http.post<ILogin>(this.#URL, body);
  }
}
