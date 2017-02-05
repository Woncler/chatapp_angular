import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { TabsModule } from 'ng2-bootstrap';
import { routing } from './app.routing';

import { ChatService } from './services/chat/chat.service';
import { NavbarService } from './services/navbar/navbar.service';
import { UserService } from './services/user/user.service';
import { SocketService } from './services/socket/socket.service';
import { RoomResolve } from './resolvers/room.resolve';
import { UserResolve } from './resolvers/user.resolve';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { ContenteditableModel } from './directives/contenteditable.directive';

@NgModule({
  imports:      [ BrowserModule, HttpModule, MaterialModule.forRoot(), TabsModule.forRoot(), routing, FormsModule ],
  declarations: [ AppComponent, NavbarComponent, AppHeaderComponent, ChatComponent, HomeComponent, NotFoundComponent, ContenteditableModel, NewRoomComponent ],
  bootstrap: [ AppComponent ],
  providers: [ChatService, NavbarService, UserService, SocketService, RoomResolve, UserResolve]
})
export class AppModule { }
