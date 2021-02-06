import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatTableModule
} from '@angular/material';

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { RoomComponent } from './rooms/room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateRoomComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
