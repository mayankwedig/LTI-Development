import { Router } from "@angular/router";
import { PayBillService } from "./../services/pay-bill/pay-bill.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DashboardService } from "../services/dashboard/dashboard.service";

declare var $: any;

@Component({
  selector: "app-pay-bill",
  templateUrl: "./pay-bill.component.html",
  styleUrls: ["./pay-bill.component.css"]
})
export class PayBillComponent implements OnInit {
  displayUserInfo = "";
  accountNumber = "";
  dispString = "";

  billing: any = {};

  fetchAdQuery = "profile"; // advertisment query.

  initBillingData() {
    this.billing = {
      accountNumber: this.accountNumber,
      accountName: "ashu123",
      bill_amount: 0.0,
      due_date: "",
      payable_amount: 0.0
    };
  }

  accountDetailsLoader: boolean = false;
  isAccountDetailsFound: boolean = false;
  AccountDetails: any = "";

  userAccountsLoder: boolean = false;
  userAccounts: any = "";

  constructor(
    private PayBillService: PayBillService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  translate(string: string): string {
    return this.PayBillService.translate(string);
  }
  getCurrentUser() {
    return this.PayBillService.getCurrentUser();
  }
  getAccountToken() {
    return this.PayBillService.getAccountToken();
  }
  isLoggedIn() {
    return this.PayBillService.isLoggedIn();
  }
  prompt(flag: string, msg: string) {
    this.PayBillService.prompt(flag, msg);
  }
  getPaymentChksmLoader: boolean = false;
  isPaymentChksmReceived: boolean = false;
  showPaymentProcessSection: boolean = false;
  payMentDetails: any = {};
  submitPaymentFrm() {
    setTimeout(() => {
      $("#payMentFrm").submit();
    }, 10);
  }
  getPaymentChecksm() {
    this.getPaymentChksmLoader = true;
    if (this.billing.accountNumber != null) {
      this.PayBillService.getPaymentChecksm(
        this.billing.accountNumber,
        0
      ).subscribe(
        (response: any) => {
          this.getPaymentChksmLoader = false;
          if (response.authCode == "200" && response.status == true) {
            this.isPaymentChksmReceived = true;
            this.showPaymentProcessSection = true;
            this.payMentDetails = response.data_params.paramsData;
            this.submitPaymentFrm();
          } else {
            this.showPaymentProcessSection = false;
            this.prompt("error", response.msg);
            this.isPaymentChksmReceived = false;
          }
        },
        error => {
          this.showPaymentProcessSection = false;
          this.getPaymentChksmLoader = false;
        }
      );
    } else {
      this.prompt("error", "Please provide account number");
    }
  }

  getUserAccounts() {
    this.userAccountsLoder = true;
    this.PayBillService.getAccounts().subscribe(
      (response: any) => {
        this.userAccountsLoder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.userAccounts = res.data_params;
          } else {
            this.prompt("error", res.msg);
            this.userAccounts = [];
          }
        }
      },
      error => {
        this.userAccountsLoder = false;
        this.userAccounts = [];
        throw error;
      }
    );
  }
  focusFunction() {
    this.initBillingData();
    this.isAccountDetailsFound = false;
  }
  getBillAccountDetails() {
    if (this.accountNumber != "") {
      // account number not blank
      this.accountDetailsLoader = true;
      var data = { account_number: this.accountNumber };
      this.PayBillService.getBillAccountDetails(data).subscribe(
        (result: any) => {
          this.accountDetailsLoader = false;
          if (result.authCode == 200 && result.status == true) {
            this.isAccountDetailsFound = true;
            this.billing = result.data_params;
            this.billing["payable_amount"] = this.billing.bill_amount;
          } else {
            this.isAccountDetailsFound = false;
            this.prompt("error", "Billing Details not found.  " + result.msg);
            this.initBillingData();
          }
        },
        (error: AppError) => {
          this.initBillingData();
          this.isAccountDetailsFound = false;
          this.accountDetailsLoader = false;
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
    } else {
      this.initBillingData();
      this.prompt("warning", "Please provide your account number.");
    }
  }
  checkAccountType(accountNumber) {
    if (accountNumber != "") {
      this.checkIfAccountIsPrepaid(accountNumber);
    } else {
      this.prompt("warning", "Please select an account number.");
    }
  }
  checkIfAccountIsPrepaid(accNumber) {
    this.PayBillService.checkIfAccountIsPrepaid(this.accountNumber, (result: any) => {
      if (result.authCode == "200") {
        if (result.data_params.isPrepaid == "Yes") {
          this.router.navigate(["/recharge-history"]);
        }
      }
    });
  }
  ngOnInit() {
    if (this.isLoggedIn()) { // if logged in 
      if (this.getAccountToken() != null) { // if account selected
        let accountToken = atob(this.getAccountToken()); // fetch account number.
        let accountTokenInfo = accountToken.split(":");
        this.accountNumber = accountTokenInfo[1]; //account Number
        this.dispString =
          this.translate("accountnumber") + " ( " + this.accountNumber + " ) ";
        this.checkIfAccountIsPrepaid(this.accountNumber);
        this.getBillAccountDetails();
      } else { // if account not selected
        this.prompt("warning", "Please select an account number.");
        this.router.navigate(["/manageaccount"]);
        this.getCurrentUser();
        this.dispString =
          "User Name ( " + this.getCurrentUser().username + " ) ";
      }
      this.getUserAccounts();
    } else {
    }
    this.initBillingData();
  }
}
