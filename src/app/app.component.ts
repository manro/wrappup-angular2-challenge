import { Component } from '@angular/core';

import '../style/app.less';
import { UrlConstants } from './constants';
import { BookmarksStorage } from './services/recording/bookmarks.storage';
import { PlayingService } from './services/recording/playing.service';
import { RecordingService } from './services/recording/recording.service';
import { Utils } from './services/utils/utils';

@Component({
  selector: 'wu-app', // <wu-app></wu-app>
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less'],
  providers: [ BookmarksStorage, PlayingService, RecordingService, Utils, Window ]
})
export class AppComponent {
    UrlConstants = UrlConstants;

    constructor() {
        //run
    }
}
