import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenService } from '../../@theme/services/jwt-token.service';
import { StoreTokenService } from '../../@theme/services/store-token.service';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginModal } from '../../@theme/models/login';
import { AuthService } from '../../@theme/services/auth.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formSubmitted = false;
  userPermission = [];
  loginReq: LoginModal;
  constructor(
    private route: Router,
    private authService: AuthService,
    private jwtToken: JwtTokenService,
    private storeTokenService: StoreTokenService,
    private toaster:NbToastrService
  ) {
    this.loginReq = new LoginModal();
  }

  ngOnInit(){
    console.log("HIII");
  }

  // On submit button click
  onSubmit(myForm) {

    this.formSubmitted = true;
    if (myForm.valid) {
      let md5 = new Md5();
      this.loginReq.password = md5.appendStr(this.loginReq.password).end()
      this.authService.checkUserLogin(this.loginReq).subscribe(
        (data) => {
          if (data["success"]) {
            this.storeTokenService.set("token", data["data"].accessToken);
            this.storeTokenService.set(
              "refreshToken",
              data["data"].refreshToken
            );
            this.loginReq.password = '';
            this.toaster.success("Login Successfull");
            this.route.navigate(["/pages"]);
          } else {
            this.loginReq.password = '';
            this.toaster.danger("Invalid UserName Or Password");
          }
        },
        (error) => {
          this.loginReq.password = '';
          this.toaster.danger("No internet access or Server failuer");
        }
      );
    }
  }


}
