import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Functions } from '../../utils/functions'

@Injectable({
    providedIn: 'root'
})
export class ThirdAccountUserService {

    constructor(private http: HttpClient, private functions: Functions) { }

    saveThirdAccountUser(paramsRequest?: any) {
        let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
        return this.http.post<any>(this.functions.urlWhithParams('thirdPartyAccounts/save', environment.urlServer, ""), paramsRequest, { headers })
    }

    thirdAccounstUser(paramsRequest?: any) {
        let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
        return this.http.post<any>(this.functions.urlWhithParams('thirdPartyAccounts/accountsUser', environment.urlServer, ""), paramsRequest, { headers })
    }
}
