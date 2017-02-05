import { Component, OnInit } from '@angular/core';
import { Room } from '../../types/room.type';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavbarService } from '../../services/navbar/navbar.service';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'new-room',
    templateUrl: 'new-room.component.html'
})

export class NewRoomComponent {
    model: Room;
    data: Data;
    exists: boolean = false;

    constructor(private http: Http, private router: Router, private navbarService: NavbarService) { }

    ngOnInit() {
        let date = new Date();
        this.model = { id: null, name: '', desc: '', created: date, private: false };
    }

    onSubmit() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.http.post('/api/newroom', { name: this.model.name, desc: this.model.desc, private: this.model.private }, options)
            .map(res => res.json())
            .subscribe((data: Room) => {
                console.log(data);
                this.navbarService.addRoom(data);
                this.router.navigateByUrl('/rooms/' + data.id);

            },
            (err: any) => {
                this.exists = true;
            });
        console.log('form submitted');
    }


}

interface Data {
    id: number
}