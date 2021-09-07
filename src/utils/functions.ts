import { Injectable } from '@angular/core';
// @ts-ignore  
import jwt_decode from "jwt-decode";
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Injectable({
    providedIn: 'root'
})
export class Functions {

    userInfo: any;
    DECIMAL_SEPARATOR = ".";
    GROUP_SEPARATOR = ",";

    constructor() {
        this.checkUserInfo()
    }

    checkUserInfo() {
        this.userInfo = this.authorization() ? this.decodedJwt(this.authorization()) : {}
    }

    urlWhithParams(moreUrl: any, urlService: any, params?: any) {
        let url = urlService + `${moreUrl}`;
        if (params) {
            Object.keys(params).forEach(function (value) {
                url += `/${params[value]}`;
            })
        }
        return url
    }

    authorization() {
        var tokenAuth = localStorage.getItem('jwt_token_user') || '';
        return tokenAuth
    }

    getJwtWithKey(suffix = '') {
        return `${suffix} ${this.authorization()}`
    }

    decodedJwt(jwt: any) {
        return jwt_decode(jwt);
    }

    saveToken(token: any, key?: any) {
        localStorage.setItem(key || 'jwt_token_user', token);
    }

    format(valString) {
        if (!valString) {
            return '';
        }
        let val = valString.toString();
        const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
        return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
    };

    unFormat(val) {
        if (!val) {
            return '';
        }
        val = val.replace(/^0+/, '');

        if (this.GROUP_SEPARATOR === ',') {
            return val.replace(/,/g, '');
        } else {
            return val.replace(/\./g, '');
        }
    };
}