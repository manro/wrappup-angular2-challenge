import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { PlayingService } from '../../services/recording/playing.service';

@Component({
    selector: 'wu-view-bookmark',
    templateUrl: 'view-bookmark.component.html',
    styleUrls: ['view-bookmark.component.less']
})
export class ViewBookmarkComponent implements OnInit, OnDestroy {

    @Input() bookmark;

    progress:any = 0;
    playing:boolean = false;

    constructor(private _playingService: PlayingService) {

    }

    ngOnInit() {

    }

    ngAfterContentInit() {
        this._playSub = this._playingService.emitter.subscribe((data) => {
            debugger;
            if (data.payload.bookmark_id === this.bookmark.id) {
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

    ngOnDestroy () {
        this._playSub.unsubscribe();
        this._playSub = null;
    }

    play():void {

        this._playingService.play(this.bookmark);
    }

    stop():void {
        this._playingService.stop();
    }

    isProcessed():boolean {
        return (
            !!this._playingService.track
        );
    }



    private _playSub = null;

}
