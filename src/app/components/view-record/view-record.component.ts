import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BookmarksStorage } from '../../services/recording/bookmarks.storage';
import { Bookmark } from '../../models/bookmark.factory';
import { PlayingService } from '../../services/recording/playing.service';
import { RecordingService } from '../../services/recording/recording.service';
import { WindowRef } from '../../services/utils/windowRef';


@Component({
    selector: 'wu-view-record',
    templateUrl: 'view-record.component.html',
    styleUrls: ['view-record.component.less']
})
export class ViewRecordComponent implements OnInit {
    @Input() duration;
    @ViewChild('canvas') canvas;
    @ViewChild('rc') rc;

    canvasCtx:any = null;

    playing:boolean = false;
    full_playing:boolean = false;
    progress:number = 0;



    constructor(
        public bookmarksStorage: BookmarksStorage,
        private _playingService: PlayingService,
        private _recordingService: RecordingService,
        private _windowRef: WindowRef
    ) { }

    ngOnInit() {

    }

    ngAfterContentInit() {
        this.canvasCtx = this.canvas.nativeElement.getContext('2d');
        this.canvasCtx.fillStyle = '#333';

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

        let lastTimestamp = 0;
        this._recordSub = this._recordingService.emitter.subscribe((data) => {
            if (data.action && data.action === 'recording') {
                let _window = this._windowRef.nativeWindow;
                let now = _window.Date.now();
                if (now - lastTimestamp > 1000 / 30) {

                    _window.requestAnimationFrame(() => {
                        let bands = data.payload.bands;
                        let len = bands.length;
                        let canvasCtx = this.canvasCtx;
                        let width = this._canvasWidth;
                        let height = this._canvasHeight;
                        let barWidth = (width / len - 2);

                        //canvasCtx.clearRect(0, 0, width, height);
                        let x = 0;
                        for (let i = 0; i < len; i++) {
                            let barHeight = height * (bands[ i ] / 256);

                            canvasCtx.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);

                            x += barWidth + 2;
                        }
                    });


                    lastTimestamp = now;
                }

                /*canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = '#333';
                canvasCtx.beginPath();

                let s = 0;
                for (let i =0; i < this.bands.length; i++) {
                    s += this.bands[i];
                }
                console.log(s);*/
            }
        });
    }

    ngAfterViewChecked() {
        let _window = this._windowRef.nativeWindow;

        _window.onresize = () => {
            this._setCanvasWidth();
        };
        _window.setTimeout(() => {
            this._setCanvasWidth();
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

    draw(){

    }

    private _setCanvasWidth():void {
        this._canvasWidth = this.rc.nativeElement.offsetWidth;
        this.canvas.nativeElement.setAttribute('width', this._canvasWidth);
    }

    private _playSub:any = null;
    private _recordSub:any = null;

    private _canvasWidth = 0;
    private _canvasHeight = 75;

}
