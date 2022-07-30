import { Injectable } from '@angular/core';
import { JwtTokenService } from './jwt-token.service';
import { StoreTokenService } from './store-token.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private token: StoreTokenService, private jwt: JwtTokenService) { }

  getUser() {
    this.jwt.setToken(this.token.get("token"));
    this.jwt.decodeToken();
    return { userId: this.jwt.getDecodeToken("userId") };
  }

  envUrl() {

    let url = "";
    let location = window.location;
    const hostName = location["hostname"];
    console.log(hostName)
    if (hostName == "192.168.1.103") {
      url = "http://192.168.1.103:8080/";
    } else {
      url = "http://103.137.194.167:8080/";
    }

    return "http://192.168.29.17:8000/";

  }

  decToBin(n): any {
    var bin = (+n).toString(2);
    let count = 10 - bin.length;
    let zero = "0";
    bin = zero.repeat(count) + bin;
    return bin;
  }

}
