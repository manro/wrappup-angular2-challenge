import { Injectable } from '@angular/core';
import { TokenDataModel } from '../../models/tokenData/tokenData.model';

let tokenKey = 'token';

@Injectable()
export class TokenStorage {

    constructor() { }

    get tokenData(): TokenDataModel {
        return new TokenDataModel(
            localStorage.getItem(tokenKey)
        );
    }
    set tokenData(tokenData: TokenDataModel) {
        localStorage.setItem(tokenKey, JSON.stringify(tokenData));
    }

}
