import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Room } from './room.model';
import { Player } from './player.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class RoomsService {
  private rooms: Room[] = [];
  private roomsUpdated = new Subject<Room[]>();
  private session = [];

  constructor(private http: HttpClient, private router: Router) {}

  saveSession(session) {
    this.session = session;
    sessionStorage.setItem('currentPlayer', JSON.stringify(session));
  }

  getSession() {
    return JSON.parse(sessionStorage.getItem('currentPlayer'));
  }

  deleteSession() {
    sessionStorage.clear();
    this.session = [];
  }

  getRooms() {
    this.http.get<{message: string, rooms: any}>('http://localhost:3000/api/rooms')
      .pipe(map((roomData) => {
        return roomData.rooms.map(room => {
          return {
            creator: room.creator,
            roomName: room.roomName,
            id: room._id
          };
        });
      }))
      .subscribe((transformedRoom) => {
        this.rooms = transformedRoom;
        this.roomsUpdated.next([...this.rooms]);
      });
  }

  getRoomUpdateListener() {
    return this.roomsUpdated.asObservable();
  }

  getRoom2(id: string) {
    return this.http.get<{_id: string; creator: string; roomName: string; creatorId: string; show: string}>
    ('http://localhost:3000/api/rooms/' + id);
  }

  getRoom(id: string) {
    return this.http.get('http://localhost:3000/api/rooms/' + id);
  }

  async addRoom(creator: string, roomName: string) {
    const room: Room = {id: null, creator: creator, roomName: roomName};
    await this.http.post<{message: string, roomId: string}>('http://localhost:3000/api/rooms', room)
      .subscribe((responseData) => {
        const id = responseData.roomId;
        room.id = id;
        this.rooms.push(room);
        this.roomsUpdated.next([...this.rooms]);
        const player: Player = {id: null, name: creator, card: null, roomId: id};
        this.http.post<{message: string, playerId: string}>('http://localhost:3000/api/players', player)
          .subscribe((responseDataPlayer) => {
          const playerId = responseDataPlayer.playerId;
          player.id = playerId;
          this.saveSession(player);
          room.creatorId = playerId;
          this.http.put<{message: string, id: string}>('http://localhost:3000/api/rooms/' + id, room)
            .subscribe((responseDataRoom) => {
            this.router.navigate(['room/' + id]);
          });
        });
      });
  }

  updateRoom(id: string, creatorId: string, creator: string, roomName: string, show: boolean) {
    const room: Room = {id: id, creatorId: creatorId, creator: creator, roomName: roomName, show: show};
    this.http.put('http://localhost:3000/api/rooms/' + id, room)
      .subscribe(response => {
        const updatedPosts = [...this.rooms];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === room.id);
        updatedPosts[oldPostIndex] = room;
        this.rooms = updatedPosts;
        this.roomsUpdated.next([...this.rooms]);
        this.router.navigate(['/']);
      });
  }

  updateRoomShow(id: string, show: Boolean) {
    const room: Room = {id: id, show: show};
    console.log(room);
    this.http.put('http://localhost:3000/api/rooms/' + id + '/show', room)
      .subscribe(response => {
        // const updatedPosts = [...this.rooms];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === room.id);
        // updatedPosts[oldPostIndex] = room;
        // this.rooms = updatedPosts;
        // this.roomsUpdated.next([...this.rooms]);
        // this.router.navigate(['/']);
      });
  }

  deleteRoom(roomId: string) {
    this.http.delete<{message: string}>('http://localhost:3000/api/rooms/' + roomId)
      .subscribe(() => {
        const updatedRooms = this.rooms.filter(post => post.id !== roomId);
        this.rooms = updatedRooms;
        this.roomsUpdated.next([...this.rooms]);
      });
  }

}
