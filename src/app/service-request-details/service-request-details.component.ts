import { DashboardService } from "./../services/dashboard/dashboard.service";
import { SerivceRequestService } from "./../services/service-request/serivce-request.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

@Component({
  selector: "app-service-request-details",
  templateUrl: "./service-request-details.component.html",
  styleUrls: ["./service-request-details.component.css"]
})
export class ServiceRequestDetailsComponent implements OnInit {
  accountNumber = "";
  dispString: any = "";

  accountDetailsLoder: boolean = false;
    name ="";
    installationAddress="";
    currentLoad="";
    supplyType="";
    mobileNumber="";
    emailId="";

  serviceTokenNumber: any = "";
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private AuthService: AuthService,
    private SerivceRequest: SerivceRequestService,
    private DashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    
    if (this.route.snapshot.queryParams.serviceReq != null) {
      if (this.helpers.getLocalStoragData("accountToken") != null) {
        let accountToken = atob(
          this.helpers.getLocalStoragData("accountToken")
        ); // fetch account number.
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
      this.serviceTokenNumber=this.route.snapshot.queryParams.serviceReq;
      this.showAccountDetails(this.accountNumber);
      this.getServiceRequestDetails();
    } else {
      this.router.navigate(["/view-all-service-request"]);
    }

    
  }
  showAccountDetails(accNo) {
    this.accountDetailsLoder = true;
    this.DashboardService.getAccountDetails(accNo, (result: any) => {
      this.accountDetailsLoder = false;
      if (result.authCode == "200") {
        this.accountNumber = accNo;
        var accountDetails = result.data_params;
       this.name = accountDetails.account_name;
       this.installationAddress = accountDetails.premise_address;
        this.currentLoad = accountDetails.current_load;
        this.supplyType = accountDetails.supply_type;
        this.mobileNumber = accountDetails.mobile;
        this.emailId = accountDetails.email; 
        
        

      } else {
       
      }
    });
  }
  getSerReqDtLoder: boolean = false;
  serviceRequestDetails:any= [];
  getServiceRequestDetails() {
    var requestData = {
      accountToken: btoa(this.accountNumber),
      serviceToken: this.serviceTokenNumber
    };
    this.getSerReqDtLoder = true;
    this.SerivceRequest.getServiceRequestDetails(requestData).subscribe(
      (response: any) => {
        var res = response;
        this.getSerReqDtLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.serviceRequestDetails = res.data_params;
          } else {
            this.serviceRequestDetails = [];
          }
        }
      },
      (error: AppError) => {
        this.getSerReqDtLoder = false;
        this.serviceRequestDetails = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
      
    );
  }
}
