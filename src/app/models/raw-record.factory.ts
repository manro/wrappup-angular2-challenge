
import { Observable } from 'rxjs';
import { WindowRef } from '../services/utils/windowRef';
import { Inject, Injectable } from '@angular/core';

/* From the spec: This value controls how frequently the audioprocess event is
 dispatched and how many sample-frames need to be processed each call.
 Lower values for buffer size will result in a lower (better) latency.
 Higher values will be necessary to avoid audio breakup and glitches */
let bufferSize = 2048;


export class RawRecord {

    private _recording = true;


    stream = null;
    leftchannel = [];
    rightchannel = [];
    recorder = null;
    recordingLength = 0;
    sampleRate = null;
    context = null;

    stateObserver: Observable<any> = null;

    constructor(audioContext: any, stream: any) {

        this.stream = stream;

        this.context = audioContext;

        // we query the context sample rate (varies depending on platforms)
        this.sampleRate = this.context.sampleRate;

        // creates a gain node
        let volume = this.context.createGain();

        // creates an audio node from the microphone incoming stream
        let audioInput = this.context.createMediaStreamSource(stream);

        // connect the stream to the gain node
        audioInput.connect(volume);

        this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

        this.stateObserver = new Observable(observer => {
            this.recorder.onaudioprocess = (e) => {
                if (!this._recording) {
                    return;
                }

                let left = e.inputBuffer.getChannelData(0);
                let right = e.inputBuffer.getChannelData(1);

                // we clone the samples
                this.leftchannel.push(new Float32Array(left));
                this.rightchannel.push(new Float32Array(right));
                this.recordingLength += bufferSize;

                observer.next(this.recordingLength)
            };
        });

        // we connect the recorder
        volume.connect(this.recorder);

        this.recorder.connect(this.context.destination);
    }

    releaseResources():void {
        this.stream.stop();
        this.stream = null;
        //disconnect
        this.recorder.disconnect(this.context.destination);
        this.recorder = null;

        this.context = null;

        this.leftchannel = null;
        this.rightchannel = null;
    }

    set recording(val: boolean) {
        this._recording = !!val;
    }
}

@Injectable()
export class RawRecordFactory {
    constructor() {

    }

    public create(audioContext: any, stream: any): RawRecord {

        return new RawRecord(audioContext, stream);
    }
}
