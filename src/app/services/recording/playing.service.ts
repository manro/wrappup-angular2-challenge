import { Injectable, Inject, EventEmitter } from '@angular/core';
import { WindowRef } from '../utils/windowRef';
import { Bookmark } from '../../models/bookmark.factory';

@Injectable()
export class PlayingService {

    current_bookmark_id = null;
    audio = null;
    emitter: EventEmitter<any> = new EventEmitter();

    constructor(@Inject(WindowRef) private _windowRef: WindowRef) {
        let _window = this._windowRef.nativeWindow;

        let _audio = _window.Audio;

        this.audio = new _audio();


        this.audio.onloadedmetadata = () => {
            this._loadedmetadata = true;
            this._onloadedmetadatacallback();
        };
        this.audio.ontimeupdate = () => {
            this._ontimeupdatecallback();

            this.emitter.emit({
                action: 'update',
                payload: {
                    progress: this._progress,
                    bookmark_id: this.current_bookmark_id
                }
            });
        };
        this.audio.onplaying = () => {
            this.emitter.emit({
                action: 'play',
                payload: {
                    progress: this._progress,
                    bookmark_id: this.current_bookmark_id
                }
            });
        };
        this.audio.onpause = () => {
            this.emitter.emit({
                action: 'stop',
                payload: {
                    progress: 0,
                    bookmark_id: this.current_bookmark_id
                }
            });
        }


    }

    play(bookmark:Bookmark) {
        if (this._track) {

            this.current_bookmark_id = bookmark.id;

            this.stop();



            this._onloadedmetadata(() => {
                this.audio.currentTime = bookmark.start;
                this.audio.play();
            });
            this._ontimeupdate(() => {
                let end = bookmark.end;
                let start = bookmark.start;

                this._progress = (100 * ((this.audio.currentTime - start) / (end - start ) ));
                if (this.audio.currentTime >= end) {
                    this._progress = 100;
                    this.audio.pause();
                    //this.audio.currentTime = start;
                }
            });
        }

    }
    stop():void {
        this.audio && this.audio.pause();
        this._progress = 0;
    }
    isPlaying():boolean {
        return (
            this.audio &&
            !this.audio.ended &&
            !this.audio.paused
        );
    }

    private _track = null;
    set track(base64AudioData: string) {
        this._track = base64AudioData;

        this._loadedmetadata = false;
        this.audio.src = this._track;



        this._onloadedmetadatacallback = () => {};
    }
    get track():string {
        return this._track;
    }

    private _progress = 0;

    private _loadedmetadata = false;
    private _onloadedmetadatacallback = () => {};
    private _onloadedmetadata (callback:any) {
        if (typeof  callback === 'function') {
            if (this._loadedmetadata) {
                callback();
            } else {
                this._onloadedmetadatacallback = callback;
            }
        }
    }

    private _ontimeupdatecallback = () => {};
    private _ontimeupdate(callback:any) {
        if (typeof  callback === 'function') {
            this._ontimeupdatecallback = callback;
        }
    }



}
