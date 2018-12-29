import { DashboardService } from "./../services/dashboard/dashboard.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from "../services/login/login.service";

declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  sliderContent = [
    {
      image: "../assets/images/main-slide1.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide2.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide3.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    }
  ];
  showForgotPass() {
    $("#loginFr").fadeOut(350);
    $("#forgotPass").fadeIn(350);
  }
  showLogin() {
    $("#forgotPass").fadeOut(300);
    $("#loginFr").fadeIn(300);
  }
  loder: boolean = false;
  loginFrm: FormGroup;
  forgotPassFrm: FormGroup;
  get f() {
    return this.loginFrm.controls;
  }
  get forgotPassFields() {
    return this.forgotPassFrm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private Dashboard: DashboardService,
    private helper: HelpersService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {
    this.initLoginFrm();
    this.initForgotFormFrm();
  }
  initLoginFrm() {
    this.loginFrm = this.fb.group({
      user_name: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  initForgotFormFrm() {
    this.forgotPassFrm = this.fb.group({
      email: ["", Validators.required]
    });
  }
  forgotPassFunction() {
    this.loder = true;
    const forgotPassData = this.forgotPassFrm.value;
    this.loginService
      .forgotPassService("users/forgotPassword", forgotPassData)
      .subscribe((response: any) => {
        this.loder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.loginService.setOtpVerificationSession(res.data_params.id);
            var OtpVerificationToken = this.loginService.getOtpVerificationSession();

            if (OtpVerificationToken != null) {
              /*   console.log("Test"); */
              this.toastr.success(res.msg, "Verification is successful!");
              this.router.navigate(["/otp-verification"]);
            }
          } else {
            this.toastr.error(res.msg, "Failed!");
          }
        }
      });
  }
   /** Redirection Loder*/
   redirectLoding = false;
   PrimaryWhite = "#16689e";
   SecondaryGrey = "#ffffff";
   PrimaryRed = "#dd0031";
   SecondaryBlue = "#006ddd";
   public primaryColour = this.PrimaryWhite;
   public secondaryColour = this.SecondaryGrey;
   public coloursEnabled = false;
 
   public config = {
     primaryColour: this.primaryColour,
     secondaryColour: this.secondaryColour,
     tertiaryColour: this.primaryColour,
     backdropBorderRadius: "3px"
   };
   /** Redirection Loder Ends Here*/
 
  login() {
    // login funtion goes here
    const loginData = this.loginFrm.value;
    this.loder = true;
    this.loginService.loginUser("users/login", loginData).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true && res.token) {
            this.loginService.setLoginData(res.token);
            this.toastr.success(res.msg, "Success!");
            let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
            var UserData = this.loginService.getUserData();
            if (UserData.numberOfAccounts == 1) { // If user has single Account
              var userId = UserData.userId; //get user Id
              var accountId = UserData.accountNumber; //get Account Id
              var is_net_metering = 0; // Set Default Net Metering Status
              //fetching Account details for getting net metering Status
              this.redirectLoding = true; //redirecting loder
              this.Dashboard.getAccountDetails(accountId, (result: any) => {
                console.log(result);
                this.redirectLoding = false; //redirecting loder false
                if (result.authCode == "200") { // if Success
                  is_net_metering = result.data_params.is_net_metering; //getting Net Metering
                  this.helper.setLocalStoragData(
                    "accountToken",
                    btoa(userId + ":" + accountId + ":" + is_net_metering)
                  ); // set new account access token.
                } else {
                  this.helper.setLocalStoragData(
                    "accountToken",
                    btoa(userId + ":" + accountId + ":" + 0)
                  ); // set new account access token.
                }
                 //redirect user to dashboard.
                 this.router.navigate([returnUrl || "/dashboard"]);
              });
              
            } else {
              this.router.navigate([returnUrl || "/manageaccount"]);
            }
          } else {
            this.toastr.error(res.msg, "Failed!");
          }
        }
      },
      (error: AppError) => {
        this.loder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
