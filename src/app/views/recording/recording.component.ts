import { Component, OnInit } from '@angular/core';

import { Moment } from 'moment'
import { RecordingService } from '../../services/recording/recording.service';


@Component({
    selector: 'wu-recording',
    templateUrl: 'recording.component.html',
    styleUrls: ['recording.component.less'],
    providers: [ RecordingService ]
})
export class RecordingComponent implements OnInit {

    recording:boolean = false;
    time: number = 0;

    toggleRecording ():void {
        if (!this.recording) {
            this._start();
        } else {
            this._stop();
        }
    }

    constructor(private _recordingService: RecordingService) {
      // Do stuff
    }

    ngOnInit() {
      console.log('Recording comp init');
    }

    private _startSub = null;
    private _stopSub = null;

    private _start(): void {
        this.recording = !this.recording;
        this._startSub = this._recordingService.start().subscribe(() => {
            console.log('obs start');
            debugger;
            this._startSub.unsubscribe();
            this._startSub = null;
        });

    }
    private _stop(): void {
        this._stopSub = this._recordingService.stop().subscribe((base64AudioData) => {
            console.log('obs stop');
            this._stopSub.unsubscribe();
            this._stopSub = null;
            this.recording = !this.recording;
        });
    }

}
