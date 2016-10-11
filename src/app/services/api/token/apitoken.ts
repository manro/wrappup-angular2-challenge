import { Injectable } from '@angular/core';
import { ApiBase } from '../apibase';
import { Observable } from 'rxjs';

@Injectable()
export class ApiToken {

    constructor(private _apiBase: ApiBase) { }

    public getByCreedentials(username: string, password: string): Observable<any> {
        return this._apiBase.GET('/token');
    }
}
