import { Component, OnInit } from '@angular/core';
import {GoogleDriveService} from "../service/google-drive.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private driveService: GoogleDriveService) { }

  ngOnInit() {
  }

  testAuthClick() {
    this.driveService.handleAuthClick();
  }

  testGetSongs() {
    this.driveService.getSongs().subscribe(x => console.log(x));
  }

}
