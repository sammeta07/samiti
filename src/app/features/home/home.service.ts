import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { GroupListApiResponse, GroupListRequestBackend } from './home.models';
import { environment } from '../../../environments/environment';

@Injectable( { providedIn: 'root' })
export class HomeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.baseUrl;

    // getGroupListByRange(body: GroupListRequestBackend) {
    //     return this.http.post<GroupListApiResponse>(`${this.baseUrl}${environment.apiEndpoint}`, body);
    // }

    getGroupListByRange(body: GroupListRequestBackend) {
        return of(this.getDummyGroupData());
    }

    private getDummyGroupData(): GroupListApiResponse {
        return {
            groups: [
                {
                    id: 12,
                    group_id: "RBC_12",
                    name: "Rudra Boys Club",
                    since: 2021,
                    area: "Zone-1, BMY, Charoda, Behind sub station -5, besides Railway Institute",
                    district_id: 897,
                    state_id: 7,
                    location_cords: {
                        lat: 21.2211103,
                        long: 81.4502262
                    },
                    contact_numbers: [
                        "9992381147",
                        "9691719866",
                        "9827697271"
                    ],
                    admins: [
                        {
                            email: "hsammeta@google.com",
                            contactNumber: "8787656543"
                        },
                        {
                            email: "rudra@rudra.com",
                            contactNumber: "8798734321"
                        }
                    ],
                    created_at: "2026-04-22T23:28:42.000Z",
                    distance: 18.487292566810062,
                    description: "A committee description—often formalized in a charter or terms of reference—defines the purpose, scope, and authority of a group. A well-defined description ensures accountability, improves efficiency, and aligns the committee's work with the organization's broader goals.",
                    logo: null
                },
                {
                    id: 11,
                    group_id: "LX_11",
                    name: "Love X11",
                    since: 22003026,
                    area: "Children Park BMY charoda, Zone -1",
                    district_id: 897,
                    state_id: 7,
                    location_cords: {
                        lat: 21.2211091,
                        long: 81.4502254
                    },
                    contact_numbers: [
                        "9770479974",
                        "7247241069"
                    ],
                    admins: [
                        {
                            email: "hariprasad8976@gmail.com",
                            contactNumber: "9770479974"
                        }
                    ],
                    created_at: "2026-04-20T01:21:30.000Z",
                    distance: 18.509072683081445,
                    description: "A highly energetic youth club organizing Ganesh Puja, Durga Puja, and massive cricket tournaments",
                    logo: null
                },
                {
                    id: 7,
                    group_id: "VNC_10",
                    name: "Very Nearby Club",
                    since: 2025,
                    area: "Kumhari",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.2301,
                        long: 81.4501
                    },
                    contact_numbers: [
                        "9000000000"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:43.000Z",
                    distance: 987.826447116974,
                    description: "A community club located very close to you, perfect for quick meetups and local events.",
                    logo: "https://picsum.photos/seed/nearby-test/200/200"
                },
                {
                    id: 2,
                    group_id: "ANM_1",
                    name: "Azad Navyuvak Mandal",
                    since: 2018,
                    area: "Kumhari",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.231,
                        long: 81.4508
                    },
                    contact_numbers: [
                        "9876543210",
                        "9123456780"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:42.000Z",
                    distance: 1090.396000956966,
                    description: "Azad Navyuvak Mandal is a vibrant youth organization based in Raipur, Chhattisgarh. Founded in 2018, the group has quickly become a hub for young people passionate about community service, cultural activities, and social change.",
                    logo: "https://picsum.photos/seed/anm-logo/200/200"
                },
                {
                    id: 3,
                    group_id: "ESB_2",
                    name: "Ekta Samiti Bhilai",
                    since: 2010,
                    area: "Charoda",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.2345,
                        long: 81.452
                    },
                    contact_numbers: [
                        "9876123456",
                        "9123456781"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:42.000Z",
                    distance: 1490.307433097131,
                    description: "Ekta Samiti Bhilai promotes community harmony and organizes cultural events that bring people together.",
                    logo: "https://picsum.photos/seed/esb-logo/200/200"
                },
                {
                    id: 4,
                    group_id: "NSM_3",
                    name: "Navjivan Samaj Mandal",
                    since: 2015,
                    area: "Bhilai 3",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.242,
                        long: 81.458
                    },
                    contact_numbers: [
                        "9876543211",
                        "9123456782"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:43.000Z",
                    distance: 2452.199704606335,
                    description: "Navjivan Samaj Mandal works towards social welfare and youth empowerment through various programs.",
                    logo: "https://picsum.photos/seed/nsm-logo/200/200"
                },
                {
                    id: 5,
                    group_id: "RSYC_4",
                    name: "Rising Star Youth Club",
                    since: 2021,
                    area: "Jamul",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.251,
                        long: 81.462
                    },
                    contact_numbers: [
                        "9876456789",
                        "9123456784"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:43.000Z",
                    distance: 3534.4093473275248,
                    description: "Rising Star Youth Club nurtures young talent through sports, education, and personality development programs.",
                    logo: "https://picsum.photos/seed/rsyc-logo/200/200"
                },
                {
                    id: 6,
                    group_id: "USM_5",
                    name: "Unity Seva Mandal",
                    since: 2012,
                    area: "Ahiwara",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.264,
                        long: 81.471
                    },
                    contact_numbers: [
                        "9876789012",
                        "9123456785"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:43.000Z",
                    distance: 5227.718375298719,
                    description: "Unity Seva Mandal is dedicated to community service, organizing health camps and educational programs.",
                    logo: "https://picsum.photos/seed/usm-logo/200/200"
                },
                {
                    id: 8,
                    group_id: "DSS_11",
                    name: "Bemetera Seva Sangh",
                    since: 2016,
                    area: "Bemetara",
                    district_id: 9,
                    state_id: 22,
                    location_cords: {
                        lat: 21.648,
                        long: 81.45
                    },
                    contact_numbers: [
                        "9876500011",
                        "9123400011"
                    ],
                    admins: [],
                    created_at: "2026-04-17T05:26:43.000Z",
                    distance: 47456.084380445674,
                    description: "Durg Seva Sangh is a long-running community organization known for devotional gatherings and public service programs.",
                    logo: "https://picsum.photos/seed/dss-logo/200/200"
                }
            ]
        };
    }

}
