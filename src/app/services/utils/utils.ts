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
}
