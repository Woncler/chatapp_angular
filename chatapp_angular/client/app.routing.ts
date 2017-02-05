import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserResolve } from './resolvers/user.resolve';
import { RoomResolve } from './resolvers/room.resolve';


import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NewRoomComponent } from './components/new-room/new-room.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'rooms/new',
        component: NewRoomComponent
    },
    {
        path: 'rooms/:id',
        component: ChatComponent,
        resolve: {
            room: RoomResolve,
            user: UserResolve
        }
    },
    {
        path: 'lul/lul',
        component: HomeComponent
    },
    {
        path: 'lul',
        component: HomeComponent
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);