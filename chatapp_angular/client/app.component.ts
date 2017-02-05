import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { SocketService } from './services/socket/socket.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
})

export class AppComponent {
    name = 'Angular';

    constructor(private userService: UserService, private socketService: SocketService) { }
}