import { Injectable } from '@angular/core';

@Injectable()
export class TokenDataModel {

    token: string;
    expires: string;

    constructor(rawData: string) {
        try {
            let rawObj = JSON.parse(rawData);

            this.token = rawObj.token;
            this.expires = rawObj.expires;
        } catch (e) {

        }
    }

}
