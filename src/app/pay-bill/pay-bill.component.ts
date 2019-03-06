import { environment } from '../../environments/environment';
import { PayBillService } from "./../services/pay-bill/pay-bill.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

  advertDataLoader: boolean = false;
  advertisementData: any = "";
  isAdvertDataFound: boolean = false;

  billing: any = {};
  callBackUrl=environment.siteUrl+"/payment-process";
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
    private fb: FormBuilder
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
  getPaymentChksmLoader:boolean=false;
  isPaymentChksmReceived:boolean=false;
  showPaymentProcessSection:boolean=false;
  payMentDetails= {
            "MID": "zZrvAW66270870088570",
            "WEBSITE": "http://103.249.98.101:82/",
            "CHANNEL_ID": "WEB",
            "INDUSTRY_TYPE_ID": "Retail",
            "ORDER_ID": "TEST_1551349811730",
            "CUST_ID": "Customer001",
            "TXN_AMOUNT": "1.00",
            "CALLBACK_URL": "http://localhost:8080/callback",
            "EMAIL": "abc@mailinator.com",
            "MOBILE_NO": "7777777777"
        }
        submitPaymentFrm(){
          setTimeout(()=>{
          $('#payMentFrm').submit();
          console.log("submit frm called");
          },10);
        }
  getPaymentChecksm(){
   /*  this.showPaymentProcessSection=true;
    setTimeout(()=>{
      this.submitPaymentFrm();
    },1) */
  this.getPaymentChksmLoader=true;
    if(this.billing.accountNumber != null){
      this.PayBillService.getPaymentChecksm(this.billing.accountNumber)
  .subscribe((response:any)=>{
    this.getPaymentChksmLoader=false;
    if(response.authCode == "200" && response.status == true){
      this.isPaymentChksmReceived=true;
      this.showPaymentProcessSection=true;
      this.payMentDetails=response.data_params.paramsData
      this.submitPaymentFrm();
    }else{
      this.showPaymentProcessSection=false;
      this.prompt("error",response.msg);
      this.isPaymentChksmReceived=false;
    }
  },(error)=>{
    this.showPaymentProcessSection=false;
    this.getPaymentChksmLoader=false;
  });
    }else{
      this.prompt("error","Please provide account number");
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
            this.prompt("error",res.msg);
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
            this.prompt("error","Billing Details not found.  "+result.msg);
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
  getAdvertisementData() {
    this.advertDataLoader = true;
    this.PayBillService.getAdvertisementData().subscribe(
      (response: any) => {
        var res = response;
        this.advertDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.advertisementData = res.data_params;
            this.isAdvertDataFound = true;
          } else {
            this.isAdvertDataFound = false;
            this.advertisementData = [];
          }
        }
      },
      (error: AppError) => {
        this.isAdvertDataFound = false;
        this.advertDataLoader = false;
        this.advertisementData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  ngOnInit() {
    if (this.isLoggedIn()) {
      if (this.getAccountToken() != null) {
        let accountToken = atob(this.getAccountToken()); // fetch account number.
        let accountTokenInfo = accountToken.split(":");
        this.accountNumber = accountTokenInfo[1]; //account Number
        this.dispString =
          this.translate("accountnumber") + " ( " + this.accountNumber + " ) ";
         
          this.getBillAccountDetails();
      } else {
      
        this.getCurrentUser();
        this.dispString =
          "User Name ( " + this.getCurrentUser().username + " ) ";
      }
      this.getUserAccounts();
    } else {
    }
    this.initBillingData();
    this.getAdvertisementData();
  }
}
