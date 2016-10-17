import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { WindowRef } from '../utils/windowRef';
import { Utils } from '../utils/utils';
import { RawRecordFactory } from '../../models/raw-record.factory';

@Injectable()
export class RecordingService {

    private _currentRawRecord: any = null;

    private _currentRawRecordSub = null;

    private _recordingInProgress = false;

    private _audioContext = null;

    private _worker = null;

    emitter: EventEmitter<any> = new EventEmitter();

    constructor(
        @Inject(WindowRef) private _windowRef: WindowRef,
        @Inject(RawRecordFactory) private _rawRecordFactory: RawRecordFactory
    ) {
        this._configureMediaStream();
        this._configureGetUserMedia();

        let _window = this._windowRef.nativeWindow;

        // creates the audio context
        let audioContext = _window.AudioContext || _window.webkitAudioContext;
        this._audioContext = new audioContext();

        //create worker
        this._worker = new _window.Worker('processing-worker.js');
    }

    start(): void {

        if (this._recordingInProgress) {
            return;
        }

        this._recordingInProgress = true;

        let _window = this._windowRef.nativeWindow;
        let navigator = _window[ 'navigator' ];

        navigator.getUserMedia({ audio: true },
            (stream) => {

                this._currentRawRecord = this._rawRecordFactory.create(this._audioContext, stream);

                this._currentRawRecordSub = this._currentRawRecord.stateObserver.subscribe((data) => {
                    //send time status
                    this.emitter.emit(data);

                });
            }, (e) => {
                this._recordingInProgress = false;
                this.emitter.emit({
                    action: 'error',
                    payload: e
                });
            });

    }

    stop(): void {
        this._recordingInProgress = false;

        if (this._currentRawRecordSub) {
            this._currentRawRecordSub.unsubscribe();
        }



        console.time('process');

        this._worker.postMessage({
            action: 'getBlob',
            payload: {
                leftchannel: this._currentRawRecord.leftchannel,
                rightchannel: this._currentRawRecord.rightchannel,
                recordingLength: this._currentRawRecord.recordingLength,
                sampleRate: this._currentRawRecord.sampleRate
            }
        });

        this._worker.onmessage = (e) => {
            let blob = e.data;

            let _window = this._windowRef.nativeWindow;
            let reader = new _window.FileReader();

            reader.readAsDataURL(blob);

            reader.onloadend = () => {

                this._currentRawRecord.recording = false;

                let base64AudioData = reader.result;

                console.timeEnd('process');

                this.emitter.emit({
                    action: 'done',
                    payload: base64AudioData
                });

                this._currentRawRecord.releaseResources();
            };
        }

    }


    private _configureMediaStream(): void {

        let _window = this._windowRef.nativeWindow;
        let MediaStream = _window[ 'MediaStream' ];

        if (typeof MediaStream === 'undefined' && typeof _window[ 'webkitMediaStream' ] !== 'undefined') {
            MediaStream = _window[ 'webkitMediaStream' ];
        }

        /*global MediaStream:true */
        if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
            MediaStream.prototype.stop = function () {
                var self = this;

                self.getAudioTracks().forEach(function (track) {
                    track.stop();
                });

                self.getVideoTracks().forEach(function (track) {
                    track.stop();
                });
            };
        }
    }

    private _configureGetUserMedia(): void {
        let _window = this._windowRef.nativeWindow;
        let navigator = _window[ 'navigator' ];

        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    }

}
