import { Component, Input, OnInit, Inject } from '@angular/core';

import { WindowRef } from '../../services/utils/windowRef';
import { Utils } from '../../services/utils/utils';

@Component({
    selector: 'wu-view-bookmark',
    templateUrl: 'view-bookmark.component.html',
    styleUrls: ['view-bookmark.component.less']
})
export class ViewBookmarkComponent implements OnInit {

    @Input() bookmark;

    audio = null;
    progress:any = 0;

    constructor(@Inject(WindowRef) private _windowRef: WindowRef) {




    }

    play():void {
        this.audio && this.audio.play();
    }
    pause():void {
        this.audio && this.audio.pause();
    }

    ngOnInit() {
        this.bookmark.subscribeOnProcessed(() => {
            let _window = this._windowRef.nativeWindow;

            let _audio = _window.Audio;

            this.audio = new _audio(
                this.bookmark.base64AudioData
            );

            this.audio.onloadedmetadata = () => {
                this.audio.currentTime = Utils.formatTimeDurationForAudioOffset(this.bookmark.start);
            };

            this.audio.ontimeupdate = () => {
                let end = Utils.formatTimeDurationForAudioOffset(this.bookmark.end);
                let start = Utils.formatTimeDurationForAudioOffset(this.bookmark.start);
                this.progress = (100 * ((this.audio.currentTime - end) / (start - end ) ));
                if (this.audio.currentTime >= end) {
                    this.audio.pause();
                    this.audio.currentTime = start;
                }
            };
        });
    }

}
