import { Component, OnInit } from '@angular/core';
import { BookmarksStorage } from '../../services/recording/bookmarks.storage';
import { Input } from '@angular/core';
import { Bookmark } from '../../models/bookmark.factory';
import { PlayingService } from '../../services/recording/playing.service';

@Component({
    selector: 'wu-view-record',
    templateUrl: 'view-record.component.html',
    styleUrls: ['view-record.component.less']
})
export class ViewRecordComponent implements OnInit {
    @Input() duration;

    playing:boolean = false;
    progress:number = 0;

    constructor(public bookmarksStorage: BookmarksStorage, private _playingService: PlayingService) { }

    ngOnInit() { }

    ngAfterContentInit() {
        this._playSub = this._playingService.emitter.subscribe((data) => {

            if (!data.payload.bookmark_id) {
                if (data.action === 'update') {
                    this.progress = data.payload.progress;
                }
                if (data.action === 'play') {
                    this.progress = data.payload.progress;
                    this.playing = true;
                }
                if (data.action === 'stop') {
                    this.progress = data.payload.progress;
                    this.playing = false;
                }
            }
        });
    }

    getLeft(bookmark:Bookmark) {
        return [100 * (bookmark.start / this.duration), '%'].join('');
    }
    getWidth(bookmark:Bookmark) {
        let end = bookmark.end || this.duration;
        return [100 * ((end - bookmark.start) / this.duration), '%'].join('');
    }

    isProcessed():boolean {
        return this._playingService.isProcessed();
    }

    play():void {
        this._playingService.play();
    }
    stop():void {
        this._playingService.stop();
    }

    private _playSub:any = null;

}
