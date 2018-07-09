import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of, from} from 'rxjs';
import { pluck } from 'rxjs/operators';
import {Song} from "../class/song";


declare var gapi: any;
@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  @Output() userEmail: EventEmitter<string> = new EventEmitter<string>();
  @Output() isSignIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  nextPageToken: string;
  modifiedSongs: Set<Song>;
  constructor() {
    gapi.load('client:auth2', this.initClient.bind(this));
    this.modifiedSongs = new Set();
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient() {
    gapi.client.init({
      apiKey: 'AIzaSyDEl89FPJ7jJ6MSZTKFvcJrFaCNi52c01E',
      clientId: '993045338415-td39lct09as7t8q9r6vt9evbr0d6biq4.apps.googleusercontent.com',
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      scope: 'https://www.googleapis.com/auth/drive'
    }).then(this.updateSignInStatus.bind(this));
  }

  updateSignInStatus(): void {

    this.userEmail.emit(
      gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail());
    this.isSignIn.emit(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn().then(
      this.updateSignInStatus.bind(this));
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut().then(
      this.updateSignInStatus.bind(this));
  }

  getSongs(): Observable<Song[]> {
    let res: Observable<any> = from(gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name, webContentLink, viewedByMeTime)",
      'q': "mimeType='audio/mp3' and not name contains 'tlog'",
      'orderBy': "viewedByMeTime",
      'pageToken': this.nextPageToken
    }));
    res.pipe(pluck('result', 'nextPageToken')).subscribe(
      (token: string)=>this.nextPageToken=token);
    return res.pipe(pluck('result', 'files'));
  }

  randomViewByMeTime(song: Song): void {
    if (!this.modifiedSongs.has(song)) {
      this.modifiedSongs.add(song);
      let rightNow = new Date().getTime();
      let randTime = new Date(rightNow-1000*60*60*24*30*Math.random()).toISOString();
      gapi.client.drive.files.update({
        fileId: song.id,
        resource: {
          "viewedByMeTime": randTime
        }
      }).then(function(response){
        if ('error' in response.result) {
          console.log(response.result.error);
        }
      });
    }
  }
}
