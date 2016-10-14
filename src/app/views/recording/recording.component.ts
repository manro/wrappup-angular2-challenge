import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';

import { RecordingService } from '../../services/recording/recording.service';
import { Bookmark, BookmarkFactory } from '../../models/bookmark.factory';
import { BookmarksStorage } from '../../services/recording/bookmarks.storage';
import { Utils } from '../../services/utils/utils';



@Component({
    selector: 'wu-recording',
    templateUrl: 'recording.component.html',
    styleUrls: ['recording.component.less'],
    providers: [ RecordingService, BookmarksStorage ]
})
export class RecordingComponent implements OnInit {

    recording:boolean = false;
    bookmarking:boolean = false;

    processing:boolean = false;

    currentBookmark: Bookmark = null;



    constructor(
        private _recordingService: RecordingService,
        public bookmarksStorage: BookmarksStorage,
        private _changeDetectorRef: ChangeDetectorRef,

        @Inject(BookmarkFactory) private _bookmarkFactory: BookmarkFactory
    ) {
      // Do stuff
    }

    ngOnInit() {
      console.log('Recording comp init');
    }

    //public
    toggleRecording ():void {
        if (!this.recording) {
            this._start();
        } else {
            this._stop();
        }
    }
    isAvailableAddBookmark():boolean {
        return (
            this.recording && this.bookmarking && !this.processing
        )
    }
    showAddBookmark():void {
        this.bookmarking = true;
        this.currentBookmark = this._bookmarkFactory.create();

        this.currentBookmark.start = this._raw_len;
    }
    onBookmarkNotify($event) {
        if ($event.action === 'save') {
            this.currentBookmark.end = this._raw_len;

            this.bookmarksStorage.addBookmark(this.currentBookmark);
            this.bookmarking = false;
            this.currentBookmark = null;
        }

        if ($event.action === 'cancel') {
            this.currentBookmark = null;
            this.bookmarking = false;
        }
    }


    private time: string = '00:00:000';

    private _raw_len = null;
    private _startSub = null;
    private _stopSub = null;

    private _start(): void {
        this.bookmarksStorage.clearAll();

        this.recording = true;
        this._startSub = this._recordingService.start().subscribe((envelope) => {

            if (envelope.status && (envelope.status === 'recording')) {
                this._raw_len = envelope.payload;
                this.time = Utils.formatTimeDuration(Utils.bytesToMilliseconds(this._raw_len));

                this._changeDetectorRef.detectChanges();
            }

            /*console.log('record length ', );*/

        });

    }
    private _stop(): void {
        if (this._startSub) {
            this._startSub.unsubscribe();
            this._startSub = null;
        }
        this.processing = true;
        this.bookmarking = false;
        this.recording = false;


        this._stopSub = this._recordingService.stop().subscribe((envelope) => {
            if (envelope.status && (envelope.status === 'done')) {
                //base64AudioData
                this.bookmarksStorage.setProcessedAudioData(envelope.payload);
                this._stopSub.unsubscribe();
                this._stopSub = null;

                this.processing = false;

                this._changeDetectorRef.detectChanges();

            }
        });
    }

}
