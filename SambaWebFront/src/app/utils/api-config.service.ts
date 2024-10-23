import { Injectable } from '@angular/core';
import { api_routes } from '../@shared/api-routes';
import { environment } from '../environments/environment';
import { IServerConfig } from '../modules/server-config/interfaces/server-config-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {

  private apiUrl: string;
  constructor(private readonly http: HttpClient) {
    this.apiUrl = localStorage.getItem('apiUrl') ?? '';
  }

  public updateApiUrl(ip: string, port: number): void {
    const newApiUrl = `http://host.docker.internal:${port}`;
    localStorage.removeItem('apiUrl');
    localStorage.setItem('apiUrl', newApiUrl);
    environment.API_URL_SAMBA = `${newApiUrl}/api/smb`;
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  saveServerConfig(body: IServerConfig) {
    return this.http.post<IServerConfig>(`${this.apiUrl}/${api_routes.SERVER_CONFIG}`, body);
  }
}
