import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { WindowRef } from '../utils/windowRef';
import { Utils } from '../utils/utils';
import { RawRecordFactory } from '../../models/raw-record.factory';

@Injectable()
export class RecordingService {

    private _currentRawRecord: any = null;

    private _recordingInProgress = false;

    private _audioContext = null;

    private _worker = null;

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

    start(): Observable<any> {

        if (this._recordingInProgress) {
            return;
        }

        this._recordingInProgress = true;

        let _window = this._windowRef.nativeWindow;
        let navigator = _window[ 'navigator' ];

        return new Observable(observer => {

            navigator.getUserMedia({ audio: true },
                (stream) => {

                    this._currentRawRecord = this._rawRecordFactory.create(this._audioContext, stream);

                    this._currentRawRecord.stateObserver.subscribe((length) => {
                        //send time status
                        observer.next({
                            status: 'recording',
                            payload: length
                        });

                    });
                }, () => {
                    this._recordingInProgress = false;
                    observer.error();
                });

        });
    }

    stop(): Observable<any> {
        this._recordingInProgress = false;

        return new Observable(observer => {

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

           /* // we flat the left and right channels down
            let leftBuffer = Utils.mergeBuffers(this._currentRawRecord.leftchannel, this._currentRawRecord.recordingLength);
            let rightBuffer = Utils.mergeBuffers(this._currentRawRecord.rightchannel, this._currentRawRecord.recordingLength);

            // we interleave both channels together
            let interleaved = Utils.interleave(leftBuffer, rightBuffer);

            // create the buffer and view to create the .WAV file
            let buffer = new ArrayBuffer(44 + interleaved.length * 2);
            let view = new DataView(buffer);

            // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
            // RIFF chunk descriptor
            Utils.writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, 44 + interleaved.length * 2, true);
            Utils.writeUTFBytes(view, 8, 'WAVE');
            // FMT sub-chunk
            Utils.writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            // stereo (2 channels)
            view.setUint16(22, 2, true);
            view.setUint32(24, this._currentRawRecord.sampleRate, true);
            view.setUint32(28, this._currentRawRecord.sampleRate * 4, true);
            view.setUint16(32, 4, true);
            view.setUint16(34, 16, true);
            // data sub-chunk
            Utils.writeUTFBytes(view, 36, 'data');
            view.setUint32(40, interleaved.length * 2, true);

            // write the PCM samples
            let lng = interleaved.length;
            let index = 44;
            let volume = 1;
            for (let i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[ i ] * (0x7FFF * volume), true);
                index += 2;
            }


            // our final binary blob that we can hand off
            let blob = new Blob([ view ], { type: 'audio/wav' });*/



            this._worker.onmessage = (e) => {
                let blob = e.data;

                let _window = this._windowRef.nativeWindow;
                let reader = new _window.FileReader();

                reader.readAsDataURL(blob);
                reader.onloadend = () => {

                    this._currentRawRecord.recording = false;

                    let base64AudioData = reader.result;

                    console.timeEnd('process');

                    observer.next({
                        status: 'done',
                        payload: base64AudioData
                    });

                    this._currentRawRecord.releaseResources();
                };
            }
        });

        // our final binary blob that we can hand off
        //return new Blob ( [ view ], { type : 'audio/wav' } );
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
