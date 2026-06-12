import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateCommitteePayload, CreateCommitteeResponse } from './create-committee.models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CreateCommitteeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.baseUrl;

createCommittee(body: CreateCommitteePayload): Observable<CreateCommitteeResponse> {
        return this.http.post<CreateCommitteeResponse>(`${this.baseUrl}${environment.endpoints.committees.create}`, body);
    }
}