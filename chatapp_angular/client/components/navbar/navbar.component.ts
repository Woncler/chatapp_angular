import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';
import { Room } from '../../types/room.type';

@Component({
    moduleId: module.id,
    selector: 'navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
    rooms: Room[];

    constructor(private navbarService: NavbarService) { }

    ngOnInit() {
        this.navbarService.rooms.subscribe(rooms => {
            this.rooms = rooms;
        });
        this.navbarService.getRooms();
    }
}