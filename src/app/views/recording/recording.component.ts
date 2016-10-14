import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';

import { RecordingService } from '../../services/recording/recording.service';
import * as  Moment from 'moment';
import { Bookmark, BookmarkFactory } from '../../models/bookmark.factory';


@Component({
    selector: 'wu-recording',
    templateUrl: 'recording.component.html',
    styleUrls: ['recording.component.less'],
    providers: [ RecordingService ]
})
export class RecordingComponent implements OnInit {

    recording:boolean = false;
    bookmarking:boolean = false;

    processing:boolean = false;

    currentBookmark: Bookmark = null;



    constructor(
        private _recordingService: RecordingService,
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
    addBookmark():void {
        this.bookmarking = true;
        this.currentBookmark = this._bookmarkFactory.create();

        this.currentBookmark.start = this.raw_len;
    }
    onBookmarkNotify($event) {
        if ($event.action === 'save') {
            this.currentBookmark.end = this.raw_len;
            debugger;
        }

        if ($event.action === 'cancel') {
            this.currentBookmark = null;
        }
    }

    //private
    private _formatTime(val:any):string {
        return Moment.utc(val).format('mm:ss:SSS');
    }

    private raw_len = null;
    private time: string = '00:00:000';

    private _startSub = null;
    private _stopSub = null;

    private _start(): void {
        this.recording = true;
        this._startSub = this._recordingService.start().subscribe((envelope) => {

            if (envelope.status && (envelope.status === 'recording')) {
                this.raw_len = envelope.payload;
                this.time = this._formatTime((envelope.payload / (1024 * 32) * 1000));

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


        this._stopSub = this._recordingService.stop().subscribe((envelope) => {
            if (envelope.status && (envelope.status === 'done')) {
                //base64AudioData
                this._stopSub.unsubscribe();
                this._stopSub = null;

                this.processing = false;
                this.recording = false;
                this.bookmarking = false;

            }
        });
    }

}
