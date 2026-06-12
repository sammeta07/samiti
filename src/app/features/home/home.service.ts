import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { CommitteeListApiResponse, CommitteeListRequestBackend } from './home.models';
import { environment } from '../../../environments/environment';

@Injectable( { providedIn: 'root' })
export class HomeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.baseUrl;

    getCommitteeListByRange(body: CommitteeListRequestBackend) {
        const params = new HttpParams()
            .set('lat', body.lat.toString())
            .set('long', body.long.toString())
            .set('rangeKm', body.rangeKm.toString());
        return this.http.get<CommitteeListApiResponse>(`${this.baseUrl}${environment.endpoints.committees.list}`, { params });

    }

}
