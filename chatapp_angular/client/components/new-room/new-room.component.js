"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var navbar_service_1 = require("../../services/navbar/navbar.service");
require("rxjs/add/operator/map");
var router_1 = require("@angular/router");
var NewRoomComponent = (function () {
    function NewRoomComponent(http, router, navbarService) {
        this.http = http;
        this.router = router;
        this.navbarService = navbarService;
        this.exists = false;
    }
    NewRoomComponent.prototype.ngOnInit = function () {
        var date = new Date();
        this.model = { id: null, name: '', desc: '', created: date, private: false };
    };
    NewRoomComponent.prototype.onSubmit = function () {
        var _this = this;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post('/api/newroom', { name: this.model.name, desc: this.model.desc, private: this.model.private }, options)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            _this.navbarService.addRoom(data);
            _this.router.navigateByUrl('/rooms/' + data.id);
        }, function (err) {
            _this.exists = true;
        });
        console.log('form submitted');
    };
    return NewRoomComponent;
}());
NewRoomComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'new-room',
        templateUrl: 'new-room.component.html'
    }),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router, navbar_service_1.NavbarService])
], NewRoomComponent);
exports.NewRoomComponent = NewRoomComponent;
//# sourceMappingURL=new-room.component.js.map