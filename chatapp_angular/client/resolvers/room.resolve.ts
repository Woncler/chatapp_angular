import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ChatService } from '../services/chat/chat.service';
import { Room } from '../types/room.type';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoomResolve implements Resolve<Room> {
    constructor(private chatService: ChatService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.chatService.getRoomDetailsResolve(route.params['id']);
    }
}