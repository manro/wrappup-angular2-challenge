
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { AppComponent } from './app.component';

import { AppConstantsModule } from './constants/_constants.module';
import { routing } from './app.routing';
import { RecordingService } from './services/recording/recording.service';
import { Utils } from './services/utils/utils';
import { WindowRef } from './services/utils/windowRef';
import { RecordingComponent } from './views/recording/recording.component';
import { AddBookmarkComponent } from './components/add-bookmark/add-bookmark.component';

import { RawRecordFactory } from './models/raw-record.factory';
import { BookmarkFactory } from './models/bookmark.factory';
import { BookmarksStorage } from './services/recording/bookmarks.storage';
import { ViewBookmarkComponent } from './components/view-bookmark/view-bookmark.component';
import { PlayingService } from './services/recording/playing.service';
import { ViewRecordComponent } from './components/view-record/view-record.component';


@NgModule({
  imports: [
      BrowserModule,
      HttpModule,
      FormsModule,

      //index-modules
      AppConstantsModule,

      //routes-module
      routing,
  ],
  declarations: [
      AppComponent,
      RecordingComponent,
      AddBookmarkComponent,
      ViewBookmarkComponent,
      ViewRecordComponent
  ],
  providers: [
      //services
      RecordingService,
      PlayingService,
      Utils,
      BookmarksStorage,

      //models
      RawRecordFactory,
      BookmarkFactory,

      //native objects
      WindowRef,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
