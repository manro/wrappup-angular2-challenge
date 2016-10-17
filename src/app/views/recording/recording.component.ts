import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';

import { RecordingService } from '../../services/recording/recording.service';
import { Bookmark, BookmarkFactory } from '../../models/bookmark.factory';
import { BookmarksStorage } from '../../services/recording/bookmarks.storage';
import { Utils } from '../../services/utils/utils';
import { PlayingService } from '../../services/recording/playing.service';



@Component({
    selector: 'wu-recording',
    templateUrl: 'recording.component.html',
    styleUrls: ['recording.component.less']
})
export class RecordingComponent implements OnInit, OnDestroy {

    recording:boolean = false;
    bookmarking:boolean = false;

    processing:boolean = false;
    processed:boolean = false;

    currentBookmark: Bookmark = null;



    constructor(
        private _recordingService: RecordingService,
        private _playingService: PlayingService,
        private _changeDetectorRef: ChangeDetectorRef,
        public bookmarksStorage: BookmarksStorage,

        @Inject(BookmarkFactory) private _bookmarkFactory: BookmarkFactory
    ) {
      // Do stuff
    }

    ngOnInit() {
      console.log('Recording comp init');

        this._sub = this._recordingService.emitter.subscribe((data) => {

            if (data.action) {

                if (data.action === 'recording') {
                    this.duration = data.payload.duration;

                    this.time = Utils.formatTimeDuration(this.duration * 1000);

                    this._changeDetectorRef.detectChanges();
                }

                if (data.action === 'done') {
                    //base64AudioData
                    this._playingService.track = data.payload;
                    this._playingService.duration = this.duration;


                    this.processing = false;
                    this.processed = true;

                    this._changeDetectorRef.detectChanges();

                }
            }

        });
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
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

        this.bookmarksStorage.addBookmark(this.currentBookmark);

        this.currentBookmark.start = this.duration;
    }
    onBookmarkNotify($event) {
        if ($event.action === 'save') {
            this.currentBookmark.end = this.duration;
            this.bookmarking = false;
            this.currentBookmark = null;
        }

        if ($event.action === 'cancel') {
            this.bookmarksStorage.removeBookmark(this.currentBookmark.id);
            this.currentBookmark = null;
            this.bookmarking = false;
        }
    }


    private time: string = '00:00:000';

    private duration = null;

    private _sub = null;

    private _start(): void {
        this.bookmarksStorage.clearAll();

        this.recording = true;
        this.processed = false;

        this._recordingService.start();

    }
    private _stop(): void {

        this.processing = true;
        this.bookmarking = false;
        this.recording = false;


        this._recordingService.stop();
    }

}
