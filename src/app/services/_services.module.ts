import { NgModule } from '@angular/core';

import { CanActivate, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { ApiToken, ApiBase, ApiCore, Auth, AuthGuard, TokenStorage, Utils } from '../services';


@NgModule({
    /*imports: [
        CanActivate, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, Router
    ],*/
    providers: [
        ApiToken,
        ApiBase,
        ApiCore,
        Auth,
        AuthGuard,
        TokenStorage,
        Utils
    ]
})
export class AppServicesModule { }

