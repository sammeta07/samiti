import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GroupListApiResponse, GroupListRequestBackend } from './home.models';
import { environment } from '../../../environments/environment';

@Injectable( { providedIn: 'root' })
export class HomeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.baseUrl;

    getGroupListByRange(body: GroupListRequestBackend) {
        return this.http.post<GroupListApiResponse>(`${this.baseUrl}${environment.apiEndpoint}`, body);
    }

}
