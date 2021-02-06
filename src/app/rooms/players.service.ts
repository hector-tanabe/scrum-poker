import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { from, Subject, of } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Player } from './player.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PlayersService {
  private players: Player[] = [];
  private playersUpdated = new Subject<Player[]>();
  private session: Player;

  constructor(private http: HttpClient, private router: Router) {}

  saveSession(session) {
    this.session = session;
    sessionStorage.setItem('currentPlayer', JSON.stringify(session));
  }

  getSession() {
    return JSON.parse(sessionStorage.getItem('currentPlayer'));
  }

  getPlayers(roomId: string) {
    // this.playersUpdated = new Subject<Player[]>();
    // this.playersUpdated.next(null);
    this.http.get<{message: string, players: any}>('http://localhost:3000/api/players/room/' + roomId)
      .pipe(map((playerData) => {
        return playerData.players.map(player => {
          return {
            name: player.name,
            card: player.card,
            id: player._id,
            roomId: player.roomId
          };
        });
      }))
      .subscribe((transformedPlayer) => {
        this.players = transformedPlayer;
        this.playersUpdated.next([...this.players]);
      });
  }

  getPlayerUpdateListener() {
    return this.playersUpdated.asObservable();
  }

  updatePlayerListener(player: Player) {
    this.players.push(player);
    const newArr = [...this.players, player];
    console.log(...this.players);
    this.playersUpdated.next(newArr);
    // this.playersUpdated.next([...this.players]);
  }

  deletePlayerListener() {
    // this.players = players;
    this.playersUpdated = new Subject<Player[]>();
    // this.playersUpdated.complete();
    // this.playersUpdated = new Subject<Player[]>();
    // this.playersUpdated.next();
    // this.playersUpdated.unsubscribe();
    // this.playersUpdated.next([...this.players]);
  }

  /*getRoom(id: string) {
    // return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string; creator: string; roomName: string}>('http://localhost:3000/api/players/' + id);
  }*/

  addPlayer(name: string, roomId: string) {
    const player: Player = {id: null, name: name, card: '-', roomId: roomId};
    this.http.post<{message: string, playerId: string}>('http://localhost:3000/api/players', player)
      .subscribe((responseData) => {
        const id = responseData.playerId;
        player.id = id;
        // this.players.push(player);
        // this.playersUpdated.next([...this.players]);
        this.saveSession(player);
        this.router.navigate(['room/' + roomId]);
      });
  }

  updatePlayer(id: string, name: string, card: string, roomId: string) {
    const player: Player = {id: id, name: name, card: card, roomId: roomId};
    this.http.put('http://localhost:3000/api/players/' + id + '/card/' + card, player)
      .subscribe(response => {
        const updatedPlayers = [...this.players];
        const oldPostIndex = updatedPlayers.findIndex(p => p.id === player.id);
        updatedPlayers[oldPostIndex] = player;
        this.players = updatedPlayers;
        this.playersUpdated.next([...this.players]);
        this.router.navigate(['room/' + roomId]);
      });
  }

  deletePlayer(playerId: string) {
    this.http.delete<{message: string}>('http://localhost:3000/api/players/' + playerId)
      .subscribe(() => {
        const updatedPlayers = this.players.filter(player => player.id !== playerId);
        this.players = updatedPlayers;
        this.playersUpdated.next([...this.players]);
      });
  }

  deletePlayersSelection(roomId: string) {
    const player: Player = this.getSession();
    this.http.put('http://localhost:3000/api/players/room/' + roomId, player)
      .subscribe(response => {
        // const updatedPlayers = [...this.players];
        // const oldPostIndex = updatedPlayers.findIndex(p => p.id === player.id);
        // updatedPlayers[oldPostIndex] = player;
        // this.players = updatedPlayers;
        // this.playersUpdated.next([...this.players]);
        this.getPlayers(roomId);
        // this.router.navigate(['room/' + roomId]);
      });
  }

}
