
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
      RecordingComponent
  ],
  providers: [
      //services
      RecordingService,
      Utils,
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
