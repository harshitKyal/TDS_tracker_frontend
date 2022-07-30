import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient,
    private commonService: CommonService) { }

  // getAllPartyListPaginated(data: RequestData) {
  //   return this.httpClient.post(
  //     this.commonService.envUrl() + "api/party/allPaginated", data
  //   );
  // }

  getAllPartyList() {
    return this.httpClient.get(this.commonService.envUrl() + "api/party/allPaginated");
  }
}
