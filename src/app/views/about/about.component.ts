import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
  }

}
