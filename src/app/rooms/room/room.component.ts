import { RoomsService } from './../rooms.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { Player } from '../player.model';
import { PlayersService } from '../players.service';

import {SocketService} from '../../socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit, OnDestroy {

  players: any[] = [];
  private playersSub: Subscription;
  isLoading = false;
  roomId: string;
  displayedColumns = ['name', 'card'];
  session: Player;
  showSelections: Boolean = false;
  room: any = {};
  dataSource: MatTableDataSource<Player> = new MatTableDataSource();

  constructor(public playersService: PlayersService, public route: ActivatedRoute, public roomsService: RoomsService,
    private srv: SocketService) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('roomId')) {
        this.session = this.roomsService.getSession();
        this.roomId = paramMap.get('roomId');
        this.roomsService.getRoom(this.roomId).subscribe(
          res => {
            this.room = res;
          }
        );
        this.isLoading = true;
        this.getPlayers();
      this.srv.listen('changes').subscribe((res: any) => {
        if (res.operationType == 'update') {
          const index = this.players.findIndex(obj => obj._id === res.documentKey._id);
          console.log('index: ', index, 'data: ', this.players);
          this.players[index].card = res.updateDescription.updatedFields.card;
        } else if (res.operationType == 'insert') {
          const index = this.players.findIndex(obj => obj.id === res.documentKey._id);
          if (index == -1) {
            const fd = res.fullDocument;
            const newPlayer: any = {_id: fd._id, name: fd.name, card: fd.card, roomId: fd.roomId };
            this.players.push(newPlayer);
            this.dataSource.data = this.players;
            this.getPlayers();
          }
        }
      });
      this.srv.listen('changesRoom').subscribe((res: any) => {
        if (res.operationType == 'update' && this.roomId == res.documentKey._id) {
          console.log('Actualizado correctamente');
          this.showSelections = res.updateDescription.updatedFields.show;
        }
      });
      } else {
        // this.mode = 'create';
        // this.postId = null;
      }
    });
  }

  ngOnDestroy() {
    // this.playersService.deletePlayerListener();
    // this.playersSub.unsubscribe();
  }

  onUpdatePlayerCard(card) {
    this.isLoading = true;
    this.playersService.updatePlayer(this.session.id, this.session.name, card, this.roomId);
    this.isLoading = false;
  }

  onDeletePlayersSelection() {
    this.isLoading = true;
    this.playersService.deletePlayersSelection(this.roomId);
    this.roomsService.updateRoomShow(this.roomId, false);
    // this.showSelections = false;
    this.isLoading = false;
  }

  onShowPlayersSelection() {
    console.log(this.roomId);
    this.roomsService.updateRoomShow(this.roomId, true);
    // this.showSelections = true;
  }

  onHidePlayersSelection() {
    this.roomsService.updateRoomShow(this.roomId, false);
    // this.showSelections = false;
  }

  getPlayers() {
    this.playersService.getPlayers(this.roomId).subscribe(
      res => {
        this.dataSource.data = res['players'];
        console.log('dataSource:', this.dataSource);
        this.players = res['players'];
      }
    );
  }

  /*displayedColumns = ['name', 'card'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
    console.log(ELEMENT_DATA);
  }*/
}

export interface Element {
  name: string;
  card: string;
}

const ELEMENT_DATA: Element[] = [
  {name: 'Player 1', card: '-'},
  {name: 'Player 2', card: '-'},
  {name: 'Player 3', card: '-'},
  {name: 'Player 4', card: '-'}
];
