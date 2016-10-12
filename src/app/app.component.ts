import { Component } from '@angular/core';

import '../style/app.less';
import { UrlConstants } from './constants';

@Component({
  selector: 'wu-app', // <wu-app></wu-app>
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
    UrlConstants = UrlConstants;

    constructor() {
        //run
    }
}
