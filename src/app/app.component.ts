import { Component } from '@angular/core';

import '../style/app.less';
import { UrlConstants } from './constants';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
    url = 'https://github.com/preboot/angular2-webpack';
    title = 'Angular2 app Boilerplate';

    UrlConstants = UrlConstants;

    constructor() {
      // Do something with api
    }
}
