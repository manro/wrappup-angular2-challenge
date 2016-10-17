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
                    time: this.audio.currentTime,
                    bookmark_id: this.current_bookmark_id
                }
            });
        };
    }

    play(bookmark?:Bookmark) {
        if (this._track) {

            if (this.isPlaying()) {
                this.emitter.emit({
                    action: 'stop',
                    payload: {
                        time: this.audio.currentTime,
                        bookmark_id: this.current_bookmark_id
                    }
                });
            }

            let id = bookmark ? bookmark.id : null;
            let start = bookmark ? bookmark.start : 0;
            let end = bookmark ? bookmark.end : this._duration;


            this.current_bookmark_id = id;


            this._onloadedmetadata(() => {
                this.audio.currentTime = start;
                this.audio.play();

                this.emitter.emit({
                    action: 'play',
                    payload: {
                        time: this.audio.currentTime,
                        bookmark_id: this.current_bookmark_id
                    }
                });
            });
            this._ontimeupdate(() => {
                 if (this.audio.currentTime >= end) {

                     this._ontimeupdate(() => {});

                     this.audio.pause();

                     this.audio.currentTime = end;

                    this.emitter.emit({
                        action: 'stop',
                        payload: {
                            time: this.audio.currentTime,
                            bookmark_id: this.current_bookmark_id
                        }
                    });
                }
            });
        }

    }
    stop():void {
        this.audio && this.audio.pause();


        this.emitter.emit({
            action: 'stop',
            payload: {
                time: this.audio.currentTime,
                bookmark_id: this.current_bookmark_id
            }
        });
    }
    jumpTo(time: number) {
        this.audio.currentTime = time;
    }


    isPlaying():boolean {
        return (
            this.audio &&
            !this.audio.ended &&
            !this.audio.paused
        );
    }
    isProcessed():boolean {
        return (
            !!this._track
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

    private _duration = 0;
    set duration(val:number) {
        this._duration = val;
    }

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
