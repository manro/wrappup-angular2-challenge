import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from './auth';
import { UrlConstants } from '../../constants';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private _auth: Auth, private _router: Router) {
        debugger;
    }

    checkAuth(url: string): boolean {
        if (this._auth.authenticated) {
            return true;
        }

        // Store the attempted URL for redirecting
        this._auth.redirectUrl = url;

        // Navigate to the login page with extras
        this._router.navigate([UrlConstants.public.login.url]);

        return false;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkAuth(url);
    }

    canActivateChild (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

}
