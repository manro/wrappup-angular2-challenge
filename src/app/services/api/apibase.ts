import { Injectable } from '@angular/core';
import { ApiCore } from './apicore';
import { Auth } from '../security/auth';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiBase {

    constructor(private _auth: Auth, private _apiCore: ApiCore) {

    }

    private get _authHeaders(): Headers {
        return new Headers({
            'Authorization': [ 'Bearer', this._auth.token ].join(' ')
        });
    }

    public GET(subURL = ''): Observable<any> {
        return this._apiCore.GET(subURL, this._authHeaders);
    }

    public POST(subURL = '', data: any): Observable<any> {
        return this._apiCore.POST(subURL, data, this._authHeaders);
    }

}
