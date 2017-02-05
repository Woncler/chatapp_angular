import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { User } from '../../types/user.type';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    user: User;

    constructor(private http: Http) {
        console.log('user service initialized');
        // this.getUser();
    }

    /*private getUserP(): Promise<User> {
        console.log('getting user');
        return this.http.get('/api/get-user-details')
            .map(res => res.json())
            .map(user => {
                    return user;
                }).toPromise();
    }

    getUser() {
        this.getUserP().then(user => this.user = user);
    }*/

    getUserResolve(): Promise<User> {
        return this.http.get('/api/get-user-details')
            .toPromise()
            .then(res => res.json() as User);
    }
}