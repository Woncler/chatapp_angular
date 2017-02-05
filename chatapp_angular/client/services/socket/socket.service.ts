import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Message } from '../../types/message.type';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    socket: any = io();

    constructor() {
        console.log('socket service initialized');
    }    

    sendMessage(message: any) {
        this.socket.emit('chat message', message);
    }

    joinRoom(room: number) {
        this.socket.emit('joinRoom', { rname: room, uname: 'lul' });
    }
}