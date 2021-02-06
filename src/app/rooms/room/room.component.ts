import { RoomsService } from './../rooms.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Player } from '../player.model';
import { PlayersService } from '../players.service';

import {SocketService} from '../../socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit, OnDestroy {

  players: Player[] = [];
  private playersSub: Subscription;
  isLoading = false;
  roomId: string;
  displayedColumns = ['name', 'card'];
  session: Player;
  showSelections: Boolean = false;

  constructor(public playersService: PlayersService, public route: ActivatedRoute, public roomsService: RoomsService,
    private srv: SocketService) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('roomId')) {
        this.session = this.roomsService.getSession();
        this.roomId = paramMap.get('roomId');
        this.isLoading = true;
        this.playersService.getPlayers(this.roomId);
      this.playersSub = this.playersService.getPlayerUpdateListener()
          .subscribe((players: Player[]) => {
        this.isLoading = false;
        this.players = players;
        this.srv.listen('changes').subscribe((res: any) => {
          // console.log(res);
          if (res.operationType == 'update') {
            const index = this.players.findIndex(obj => obj.id === res.documentKey._id);
            this.players[index].card = res.updateDescription.updatedFields.card;
          }
          /*else if (res.operationType == 'insert') {
            const index = this.players.findIndex(obj => obj.id === res.documentKey._id);
            console.log(index);
            if (index == -1) {
              const fd = res.fullDocument;
              const newPlayer: Player = {id: fd._id, name: fd.name, card: fd.card, roomId: fd.roomId };
              // players.push(newPlayer);
              // this.players = players;
              // this.playersService.getPlayers(this.roomId);
              this.playersService.updatePlayerListener(newPlayer);
              console.log(players);
            }
          }*/
        });
      });
      } else {
        // this.mode = 'create';
        // this.postId = null;
      }
    });
  }

  ngOnDestroy() {
    this.playersService.deletePlayerListener();
    this.playersSub.unsubscribe();
    // this.players = [];
    // this.playersService.deletePlayerListener();
  }

  onUpdatePlayerCard(card) {
    this.isLoading = true;
    this.playersService.updatePlayer(this.session.id, this.session.name, card, this.roomId);
    this.isLoading = false;
  }

  onDeletePlayersSelection() {
    this.isLoading = true;
    this.playersService.deletePlayersSelection(this.roomId);
    this.showSelections = false;
    this.isLoading = false;
  }

  onShowPlayersSelection() {
    this.showSelections = true;
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
