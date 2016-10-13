import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { RecordingService } from '../../services/recording/recording.service';
import * as  Moment from 'moment';


@Component({
    selector: 'wu-recording',
    templateUrl: 'recording.component.html',
    styleUrls: ['recording.component.less'],
    providers: [ RecordingService ]
})
export class RecordingComponent implements OnInit {

    recording:boolean = false;
    bookmarking:boolean = false;



    constructor(private _recordingService: RecordingService, private _changeDetectorRef: ChangeDetectorRef) {
      // Do stuff
    }

    ngOnInit() {
      console.log('Recording comp init');
    }

    //public
    toggleRecording ():void {
        if (!this.recording) {
            this._start();
        } else {
            this._stop();
        }
    }
    addBookmark():void {
        this.bookmarking =! this.bookmarking;
    }

    //private
    private _formatTime(val:any):string {
        return Moment.utc(val).format('mm:ss:SSS');
    }

    private time: string = '00:00:000';

    private _startSub = null;
    private _stopSub = null;

    private _start(): void {
        this.recording = !this.recording;
        this._startSub = this._recordingService.start().subscribe((envelope) => {

            if (envelope.status && (envelope.status === 'recording')) {
                this.time = this._formatTime((envelope.payload / (1024 * 32) * 1000));

                this._changeDetectorRef.detectChanges();
            }

            /*console.log('record length ', );*/

        });

    }
    private _stop(): void {
        if (this._startSub) {
            this._startSub.unsubscribe();
            this._startSub = null;
        }
        this._stopSub = this._recordingService.stop().subscribe((envelope) => {
            debugger;
            if (envelope.status && (envelope.status === 'done')) {
                //base64AudioData
                this._stopSub.unsubscribe();
                this._stopSub = null;
                this.recording = !this.recording;
            }
        });
    }

}
