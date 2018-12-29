import { HelpersService } from './../services/helpers/helpers.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
require("../../../node_modules/moment/min/moment.min.js");
declare var moment: any;
declare var $: any;

@Component({
  selector: 'app-recharge-history',
  templateUrl: './recharge-history.component.html',
  styleUrls: ['./recharge-history.component.css']
})
export class RechargeHistoryComponent implements OnInit {
  accountNumber: any = "";
  rechargeDataLoder: boolean = false;
  isrechargeDataFound: boolean = false;
  rechargeData: any = "";
  dispString: any = "";
  rechargechartData: any = [];
  constructor(
    private DashboardService: DashboardService,
    private activateRoute: ActivatedRoute,
    private helpers:HelpersService,
    
  ) {}

  ngOnInit() {
    let accountToken=atob(this.helpers.getLocalStoragData("accountToken"));// fetch account number.
    let accountTokenInfo=accountToken.split(":");
    this.accountNumber=accountTokenInfo[1]//account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";
    this.getrechargeData();
    };

  getrechargeData() {
    
    this.rechargeDataLoder = true;
    this.DashboardService.getrechargeData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.rechargeDataLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.rechargeData = res.data_params;
            this.isrechargeDataFound = true;
          } else {
            this.isrechargeDataFound = false;
            this.rechargeData = "";
          }
        }
      },
      (error: AppError) => {
        this.isrechargeDataFound = false;
        this.rechargeDataLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}

