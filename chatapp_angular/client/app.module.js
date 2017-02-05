"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var ng2_bootstrap_1 = require("ng2-bootstrap");
var app_routing_1 = require("./app.routing");
var chat_service_1 = require("./services/chat/chat.service");
var navbar_service_1 = require("./services/navbar/navbar.service");
var user_service_1 = require("./services/user/user.service");
var socket_service_1 = require("./services/socket/socket.service");
var room_resolve_1 = require("./resolvers/room.resolve");
var user_resolve_1 = require("./resolvers/user.resolve");
var app_component_1 = require("./app.component");
var navbar_component_1 = require("./components/navbar/navbar.component");
var app_header_component_1 = require("./components/app-header/app-header.component");
var chat_component_1 = require("./components/chat/chat.component");
var home_component_1 = require("./components/home/home.component");
var not_found_component_1 = require("./components/not-found/not-found.component");
var new_room_component_1 = require("./components/new-room/new-room.component");
var contenteditable_directive_1 = require("./directives/contenteditable.directive");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, material_1.MaterialModule.forRoot(), ng2_bootstrap_1.TabsModule.forRoot(), app_routing_1.routing, forms_1.FormsModule],
        declarations: [app_component_1.AppComponent, navbar_component_1.NavbarComponent, app_header_component_1.AppHeaderComponent, chat_component_1.ChatComponent, home_component_1.HomeComponent, not_found_component_1.NotFoundComponent, contenteditable_directive_1.ContenteditableModel, new_room_component_1.NewRoomComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [chat_service_1.ChatService, navbar_service_1.NavbarService, user_service_1.UserService, socket_service_1.SocketService, room_resolve_1.RoomResolve, user_resolve_1.UserResolve]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map