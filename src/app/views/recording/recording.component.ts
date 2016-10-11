import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-home',
  templateUrl: 'recording.component.html',
  styleUrls: ['recording.component.less']
})
export class RecordingComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello REcording');
  }

}
