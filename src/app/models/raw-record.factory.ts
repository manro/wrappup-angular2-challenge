
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
    analyser  = null;
    analyserNode = null;
    bands = null;
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

        //creating recorder
        this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

        //creating analyzer
        this.analyserNode = audioContext.createScriptProcessor(2048, 1, 1);
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 512;
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);

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


                //renew analyser bands
                this.analyser.getByteFrequencyData(this.bands);

                observer.next({
                    action: 'recording',
                    payload: {
                        duration: this.recordingLength / this.sampleRate,
                        bands: this.bands
                    }
                })
            };
        });

        // we connect the recorder
        volume.connect(this.recorder);
        this.recorder.connect(this.context.destination);

        //we connect the analyser
        this.analyserNode.connect(volume);
        audioInput.connect(this.analyser);
        this.analyser.connect(this.analyserNode);


    }

    releaseResources():void {
        this.stream.stop();
        this.stream = null;

        //disconnect
        this.recorder.disconnect(this.context.destination);
        this.recorder = null;

        //disconnect
        this.analyser.disconnect(this.analyserNode);
        this.analyser = null;

        this.bands = null;

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
