import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Functions } from '../../utils/functions'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private functions: Functions) { }

  login(paramsRequest?: any) {
    return this.http.post<any>(this.functions.urlWhithParams('user/login', environment.urlServer, ""), paramsRequest, {})
  }

  getUser(paramsRequest?: any) {
    let headers = new HttpHeaders({ 'Authorization': this.functions.getJwtWithKey() });
    return this.http.post<any>(this.functions.urlWhithParams('user/getUser', environment.urlServer, ""), paramsRequest, { headers })
  }
}
