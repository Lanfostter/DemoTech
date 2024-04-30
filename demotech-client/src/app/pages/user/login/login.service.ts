import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Login} from "../../model/login";
import {catchError} from "rxjs";
import {LoginConstants} from "./login-constants";
import {ConfigInitService} from "../../../init/config-init.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly HOST = this.configInitService.apiBaseUrl;

  constructor(private http: HttpClient, private configInitService: ConfigInitService) {
  }

  login(loginDto: Login) {
    return this.http.post<Login>(this.HOST + LoginConstants.API_LOGIN, loginDto, httpOptions)
  }
}
