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
    full_playing:boolean = false;
    progress:number = 0;

    constructor(public bookmarksStorage: BookmarksStorage, private _playingService: PlayingService) { }

    ngOnInit() { }

    ngAfterContentInit() {
        this._playSub = this._playingService.emitter.subscribe((data) => {

                this.progress = this.getPercentProgressFromTime(data.payload.time);

                if (data.action === 'update') {

                }
                if (data.action === 'play') {
                    this.playing = true;
                }
                if (data.action === 'stop') {
                    this.full_playing = false;
                    this.playing = false;
                }
        });
    }

    getPercentProgressFromTime(time:number) {
        return (
            100 * (time / this.duration)
        );
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
        this.full_playing = true;
    }
    stop():void {
        this._playingService.stop();
    }

    playFrom(bookmark: Bookmark):void {
        if (this.full_playing) {
            this._playingService.jumpTo(bookmark.start)
        } else {
            this._playingService.play(bookmark);
        }
    }

    private _playSub:any = null;

}
