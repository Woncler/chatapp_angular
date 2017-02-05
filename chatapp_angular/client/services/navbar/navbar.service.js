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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/map");
var NavbarService = (function () {
    function NavbarService(http) {
        this.http = http;
        console.log('Navbar service initialized');
        this.roomStore = { rooms: [] };
        this._rooms = new BehaviorSubject_1.BehaviorSubject([]);
        this.rooms = this._rooms.asObservable();
    }
    NavbarService.prototype.getRooms = function () {
        var _this = this;
        this.http.get('/api/get-rooms')
            .map(function (res) { return res.json(); }).subscribe(function (rooms) {
            _this.roomStore.rooms = rooms;
            _this._rooms.next(Object.assign({}, _this.roomStore).rooms);
        });
    };
    NavbarService.prototype.addRoom = function (room) {
        this.roomStore.rooms.push(room);
        this._rooms.next(Object.assign({}, this.roomStore).rooms);
    };
    return NavbarService;
}());
NavbarService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], NavbarService);
exports.NavbarService = NavbarService;
//# sourceMappingURL=navbar.service.js.map