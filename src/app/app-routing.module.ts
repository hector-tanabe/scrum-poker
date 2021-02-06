import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { RoomComponent } from './rooms/room/room.component';

const routes: Routes = [
  { path: '', component: CreateRoomComponent },
  { path: 'create', component: CreateRoomComponent },
  { path: 'edit/:roomId', component: CreateRoomComponent },
  { path: 'room', component: RoomComponent },
  { path: 'room/:roomId', component: RoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

