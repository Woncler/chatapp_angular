import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../types/user.type';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserResolve implements Resolve<User> {
    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.userService.getUserResolve();
    }
}