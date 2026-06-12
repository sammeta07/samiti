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
        // TODO: Replace with actual API call when backend is ready
        // return this.http.post<CreateCommitteeResponse>(`${this.baseUrl}${environment.endpoints.groups.create}`, body);
        
        // Mock implementation for now
        return of({
            statusCode: 201,
            status: 'success',
            message: 'Committee created successfully!',
            data: {
                id: Math.floor(Math.random() * 1000),
                committee_code: `COMM_${Math.floor(Math.random() * 1000)}`,
                name: body.name,
                since: body.since,
                area: body.area,
                contact_numbers: body.contact_numbers,
                description: body.description,
                logo: null,
                distance: 0,
                is_favourite: false,
                created_at: new Date().toISOString()
            }
        });
    }
}
