"use strict";
var router_1 = require("@angular/router");
var user_resolve_1 = require("./resolvers/user.resolve");
var room_resolve_1 = require("./resolvers/room.resolve");
var chat_component_1 = require("./components/chat/chat.component");
var home_component_1 = require("./components/home/home.component");
var not_found_component_1 = require("./components/not-found/not-found.component");
var new_room_component_1 = require("./components/new-room/new-room.component");
var appRoutes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent
    },
    {
        path: 'rooms/new',
        component: new_room_component_1.NewRoomComponent
    },
    {
        path: 'rooms/:id',
        component: chat_component_1.ChatComponent,
        resolve: {
            room: room_resolve_1.RoomResolve,
            user: user_resolve_1.UserResolve
        }
    },
    {
        path: 'lul/lul',
        component: home_component_1.HomeComponent
    },
    {
        path: 'lul',
        component: home_component_1.HomeComponent
    },
    {
        path: '404',
        component: not_found_component_1.NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map