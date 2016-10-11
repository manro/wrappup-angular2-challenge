import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';


const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

@Injectable()
export class ApiCore {

    private static _baseURL: string = '';

    private static _getURL(subURL: string): string {
        return [ ApiCore._baseURL, subURL ].join('/');
    }

    private static _getRequestOptions(userHeaders?: any) {

        let resultHeaders = new Headers();
        Object.assign(resultHeaders, new Headers(DEFAULT_HEADERS), new Headers(userHeaders));

        return new RequestOptions({
            headers: resultHeaders
        });
    }

    private static _defaultResponseMap(res: Response): any {
        return res.json();
    }

    private static _defaultErrorMap(err: any): any {
        Observable.throw(err.json().error || 'Server error');
    }

    constructor(private _http: Http) {
    }

    public GET(subURL = '', userHeaders?: any): Observable<any> {

        return this._http
                   .get(ApiCore._getURL(subURL), ApiCore._getRequestOptions(userHeaders))
                   .map(ApiCore._defaultResponseMap)
                   .catch(ApiCore._defaultErrorMap)
            ;

    }

    public POST(subURL = '', data: any, userHeaders?: any): Observable<any> {


        return this._http
                   .post(ApiCore._getURL(subURL), data, ApiCore._getRequestOptions(userHeaders))
                   .map(ApiCore._defaultResponseMap)
                   .catch(ApiCore._defaultErrorMap)
            ;

    }

}
