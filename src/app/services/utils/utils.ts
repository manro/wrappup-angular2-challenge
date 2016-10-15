import { Injectable } from '@angular/core';
import * as  Moment from 'moment';

@Injectable()
export class Utils {

    constructor() { }

    static getGUID ():string {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    static formatTimeDuration(val:any):string {
        return Moment.utc(val).format('mm:ss:SSS');
    }

    static formatTimeDurationForAudioOffset(val:number):number{
        return (val / 1000);
    }

    static bytesToMilliseconds(val:any) {
        return (val / (1024 * 22) * 1000);
    }

    /*static mergeBuffers(channelBuffer, recordingLength): any{
        let result = new Float32Array(recordingLength);
        let offset = 0;
        let lng = channelBuffer.length;
        for (let i = 0; i < lng; i++){
            let buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    static interleave (leftChannel, rightChannel): any {
        let length = leftChannel.length + rightChannel.length;
        let result = new Float32Array(length);

        let inputIndex = 0;

        for (let index = 0; index < length; ){
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }

        return result;
    }

    static writeUTFBytes (view, offset, string): any {
        let lng = string.length;
        for (let i = 0; i < lng; i++){
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }*/

}
