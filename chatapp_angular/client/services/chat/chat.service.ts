import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Room } from '../../types/room.type';

@Injectable()
export class ChatService {
    constructor(private http: Http) {
        console.log('Chat service initialized');
    }

    getRoomDetails(id: number) {
        return this.http.get('/api/get-room-details/' + id)
            .map(res => res.json());
    }

    getRoomDetailsResolve(id: number): Promise<Room> {
        return this.http.get('/api/get-room-details/' + id)
            .toPromise()
            .then(res => res.json() as Room);
    }
}