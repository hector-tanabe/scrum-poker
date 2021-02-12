import { Component, OnInit } from '@angular/core';
import { Room } from './../room.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RoomsService } from '../rooms.service';
import { PlayersService } from '../players.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  enteredCreator = '';
  enteredRoomName = '';
  private mode = 'create';
  private roomId: string;
  room: Room;
  isLoading = false;
  form: FormGroup;
  formJoin: FormGroup;

  constructor(public roomsService: RoomsService, public route: ActivatedRoute, public playersService: PlayersService) { }

  ngOnInit() {
    this.roomsService.deleteSession();
    this.playersService.deletePlayerListener();
    this.form = new FormGroup({
      'creator': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
      'roomName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });
    this.formJoin = new FormGroup({
      'name': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
      'roomId': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('roomId')) {
        this.mode = 'edit';
        this.roomId = paramMap.get('roomId');
        this.isLoading = true;
        this.roomsService.getRoom2(this.roomId).subscribe(roomData => {
          this.isLoading = false;
          this.room = {
            id: roomData._id,
            creator: roomData.creator,
            roomName: roomData.roomName
          };
          this.form.setValue({
            'creator': this.room.creator,
            'roomName': this.room.roomName
          });
        });
      } else {
        this.mode = 'create';
        this.roomId = null;
      }
    });
  }

  onSaveRoom() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.roomsService.addRoom(this.form.value.creator, this.form.value.roomName);
    } else {
      // this.roomsService.updateRoom(this.roomId, this.form.value.creator, this.form.value.roomName);
    }
    this.form.reset();
  }

  onJoinRoom() {
    if (this.formJoin.invalid) {
      return;
    }
    this.isLoading = true;
    this.playersService.addPlayer(this.formJoin.value.name, this.formJoin.value.roomId);
    this.formJoin.reset();
  }

}
