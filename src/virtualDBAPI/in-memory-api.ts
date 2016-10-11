import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Utils } from '../app/services/utils/utils';

@Injectable()
export class APIData implements  InMemoryDbService {

    constructor() { }
    createDb () {
        let users = [
            { id: 1, name : 'Vasia Pupkin', username: 'vp', password: '1' },
            { id: 2, name : 'Kolya Petrov', username: 'kp', password: '2' }
        ];

        return {
            'users': users,

            'token': users.map((u) => {
                return {
                    user: u,
                    token: Utils.getHash(),
                    expires: Date.now() + 100000
                };
            })
        };
    }

}
