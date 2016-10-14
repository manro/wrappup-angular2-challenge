import { Injectable } from '@angular/core';
import * as  Moment from 'moment';

@Injectable()
export class Utils {

    constructor() { }

    static formatTimeDuration(val:any):string {
        return Moment.utc(val).format('mm:ss:SSS');
    }

    static bytesToMilliseconds(val:any) {
        return (val / (1024 * 32) * 1000)
    }

    static mergeBuffers(channelBuffer, recordingLength): any{
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
    }

}
