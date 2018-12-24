import { DashboardService } from "./../services/dashboard/dashboard.service";
import { SerivceRequestService } from "./../services/service-request/serivce-request.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

@Component({
  selector: 'app-service-request-details',
  templateUrl: './service-request-details.component.html',
  styleUrls: ['./service-request-details.component.css']
})
export class ServiceRequestDetailsComponent implements OnInit {
 
  accountNumber = "";
  dispString: any = "";

  
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private AuthService: AuthService,
    private SerivceRequest: SerivceRequestService,
    private DashboardService: DashboardService
  ) {}

  ngOnInit() {
    
    
    

    if (this.helpers.getLocalStoragData("accountToken") != null) {
      let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
      let accountTokenInfo = accountToken.split(":");
      this.accountNumber = accountTokenInfo[1]; //account Number
      this.dispString = "Account No. ( " + this.accountNumber + " ) ";
      //this.showAccountDetails(this.accountNumber); // if account no is already selected then show details of selected account.
    } else {
      this.AuthService.getCurrentUser();
      this.dispString =
        "User Name ( " + this.AuthService.getCurrentUser().username + " ) ";
      //this.initServiceRequestFrm(this.selectedRequestType); // init form
    }
    this.showAccountDetails(this.accountNumber);
  }
  
  accountDetailsLoder:boolean=false;
  accountDetails={
    "name":"",
    "installationAddress":"",
    "currentLoad":"",
    "supplyType":"",
    "mobileNumber":"",
    "emailId":""

  };
  showAccountDetails(accNo) {
    this.accountDetailsLoder = true;
    this.DashboardService.getAccountDetails(accNo, (result: any) => {
      this.accountDetailsLoder = false;
      if (result.authCode == "200") {
        this.accountNumber = accNo;
        var accountDetails = result.data_params;
        /* this.name = this.accountDetails.account_name;
        this.installationAddress = this.accountDetails.premise_address;
        this.currentLoad = this.accountDetails.current_load;
        this.supplyType = this.accountDetails.supply_type;
        this.mobileNumber = this.accountDetails.mobile;
        this.emailId = this.accountDetails.email; */
       this.accountDetails["name"]=accountDetails.account_name;
       this.accountDetails["installationAddress"]=accountDetails.premise_address;
       this.accountDetails["currentLoad"]=accountDetails.current_load;
       this.accountDetails["supplyType"]=accountDetails.supplyType;
       this.accountDetails["mobileNumber"]=accountDetails.mobile;
       this.accountDetails["emailId"]=accountDetails.email;
      } else {
       
      }
    });
  }
}

