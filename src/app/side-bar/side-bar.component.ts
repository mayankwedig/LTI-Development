import { HelpersService } from "./../services/helpers/helpers.service";
import { AuthService } from "./../services/authService/auth.service";
import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "../services/window-ref/window-ref.service";
import { ManageaccountService } from "./../services/manageaccount/manageaccount.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";

import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

import { ToastrService } from "ngx-toastr";

import * as $ from "jquery";
@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit {
  @Input("displayUserInfo") displayUserInfo: any;
  currentUrl: any = "";
  account_no;
  userName;
  dashboardDataApiUrl = "users/getUserData";
  is_net_metering: boolean = false; // by Default Net metering will be 0
  userData = "";
  accountLoder:boolean=false;
  accountData="";
  isAccountDataFound:boolean=false;
  accountNumber="";
  constructor(
    private helpers: HelpersService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private winRef: WindowRefService,
    private auth: AuthService,
    private accountServices: ManageaccountService,
    private toastr: ToastrService,
    private Dashboard: DashboardService,
  ) {}
  removeCss($event) {
    $("li").removeClass("openDropdown");
    var target: any = event.target || event.srcElement || event.currentTarget;
    var value: any = target.id;
    $("#li" + value).addClass("openDropdown");
  }

  ngOnInit() {
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token
      
      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
          this.accountNumber=accountTokenInfo[1];
        // if token of current user
        if (parseInt(accountTokenInfo[2]) == 0) {
          this.is_net_metering = false;
        } else {
          this.is_net_metering = true;
        }
      }
    }
    var init = [];
    this.winRef.nativeWindow.PixelAdmin.start(init);
    this.currentUrl = this.router.url;
    if(this.currentUrl.indexOf("serviceReq") !== -1){
      this.currentUrl="/service-request-details";
    }else if(this.currentUrl.indexOf("complaintReq") !== -1){
      this.currentUrl="/complaint-request-details";
    }
    this.userData = this.auth.getCurrentUser();
    this.getAccount("");
  }
  getAccount(searchKeyWord) {
    this.accountLoder = true;

    this.accountServices.getAccount(searchKeyWord).subscribe(
      (response: any) => {
        var res = response;
        this.accountLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            console.log(res.data_params)
            this.accountData = res.data_params;
            this.isAccountDataFound = true;
          } else {
            this.toastr.error(res.msg, "failed!");
            this.isAccountDataFound = false;
          }
        }
      },
      (error: AppError) => {
        this.isAccountDataFound = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
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

  redirectoDashBoard(accountId, userId) {
      
    this.redirectLoding = true; // make loder true
    var userId = this.auth.getCurrentUser().userId;
    var is_net_metering = 0;
    //fetching Account details for getting net metering is on/off
    this.Dashboard.getAccountDetails(accountId, (result: any) => {
      this.redirectLoding = false;
      if (result.authCode == "200") {
        is_net_metering = result.data_params.is_net_metering;
        this.helpers.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + is_net_metering)
        ); // set new account access token.
      } else {
        this.helpers.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + 0)
        ); // set new account access token.
      }
      this.currentUrl = this.router.url;
      if(this.currentUrl.indexOf("dashboard") !== -1){
       /*  this.currentUrl="/redirect-dashboard"; */
        this.router.navigate(["/redirect-dashboard"]);
      }else{
        this.router.navigate(["/dashboard"]); //redirect user to dashboard.
      }
      
    });
  }
}
