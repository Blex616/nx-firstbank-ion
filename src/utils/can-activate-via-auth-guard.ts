import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Functions } from './functions'

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor(private functions: Functions, public router: Router) { }

    canActivate() {
        if (!this.functions.authorization()) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}