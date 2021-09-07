import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Functions } from '../../utils/functions'

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private http: HttpClient, private functions: Functions) { }

    getAccountsUser(paramsRequest?: any) {
        let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
        return this.http.post<any>(this.functions.urlWhithParams('account/accountUser', environment.urlServer, ""), paramsRequest, { headers })
    }

    getAccountsUserHistory(paramsRequest?: any) {
        let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
        return this.http.post<any>(this.functions.urlWhithParams('accountHistory/accountUserHistory', environment.urlServer, ""), paramsRequest, { headers })
    }

    transferAccountThird(paramsRequest?: any) {
        let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
        return this.http.post<any>(this.functions.urlWhithParams('account/transfer', environment.urlServer, ""), paramsRequest, { headers })
    }
}
