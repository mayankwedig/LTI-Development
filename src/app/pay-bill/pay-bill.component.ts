import { PayBillService } from "./../services/pay-bill/pay-bill.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

  constructor(private PayBillService: PayBillService,private fb: FormBuilder) {}
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
  accountDetailsLoader:boolean=false;
  isAccountDetailsFound:boolean=false;
  AccountDetails:any="";
  getBillAccountDetails(){
    this.accountDetailsLoader=true;
    var data={"account_number":123456};
    this.PayBillService.getBillAccountDetails(data)
    .subscribe((result:any)=>{
      this.accountDetailsLoader=false;
      if(result.authCode == 200 && result.status == true){
        this.isAccountDetailsFound=true;
        this.AccountDetails=result.data_params
      }else{
        this.isAccountDetailsFound=false;
        this.AccountDetails="";

      }
    },(error: AppError) => {
      this.isAccountDetailsFound = false;
      this.accountDetailsLoader = false;
      this.AccountDetails="";
      if (error instanceof BadInput) {
      } else {
        throw error;
      }
    })
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
      } else {
        this.getCurrentUser();
        this.dispString =
          "User Name ( " + this.getCurrentUser().username + " ) ";
      }
    } else {
      
    }
    this.getAdvertisementData();
  }
}
