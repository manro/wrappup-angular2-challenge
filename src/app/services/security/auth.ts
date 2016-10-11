import { Injectable, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenStorage } from '../storage/token.storage';
import { ApiToken } from '../api/token/apitoken';

@Injectable()
export class Auth {

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private _injector: Injector, private _tokenStorage: TokenStorage) {

    }

    private _saveTokenData(response) {
        this._tokenStorage.tokenData = response;
    }

    private _authenticated:boolean = false;

    login(username: string, password: string): Subscription {
        let _apiToken = this._injector.get(ApiToken);
        return _apiToken
                   .getByCreedentials(username, password)
                   .subscribe(this._saveTokenData);
    }

    get authenticated(): boolean {
        return this._authenticated;
    }

    get token(): string {
        if (this._tokenStorage.tokenData) {
            return this._tokenStorage.tokenData.token;
        }
        return void 0;
    }
}
