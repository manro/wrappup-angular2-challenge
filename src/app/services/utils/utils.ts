import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

    constructor() { }

    static isNOU (testObj: any) {
        return (
            (testObj === null) ||
            (testObj === void 0)
        );
    }

    static getGUID ():string {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * http://stackoverflow.com/a/22429679
     * Calculate a 32 bit FNV-1a hash
     * Found here: https://gist.github.com/vaiorabbit/5657561
     * Ref.: http://isthe.com/chongo/tech/comp/fnv/
     *
     * @param {string} str the input value
     * @param {boolean} [asString=false] set to true to return the hash value as
     *     8-digit hex string instead of an integer
     * @param {integer} [seed] optionally pass the hash of the previous chunk
     * @returns {integer | string}
     */
    static getHash (str?: string, asString?: boolean, seed?: number): any {
        str = !Utils.isNOU(str) ? str.toString() : Utils.getGUID();
        let i,
            l,
            hval = (seed === undefined) ? 0x811c9dc5 : seed;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if (asString) {
            // Convert to 8 digit hex string
            return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
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
