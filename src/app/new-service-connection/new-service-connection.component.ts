import { DashboardService } from "./../services/dashboard/dashboard.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

@Component({
  selector: 'app-new-service-connection',
  templateUrl: './new-service-connection.component.html',
  styleUrls: ['./new-service-connection.component.css']
})

export class NewServiceConnectionComponent implements OnInit {
  newServiceConnectionFrm: FormGroup;
  dispString: any = "";

  defautlSelectedCaseType: any = "Meter Related";
  userAccounts = [];
  complaintCaseTypes = [];
  complaintBillRelatedReasons = [];
  complaintSupplyProblems = [];
  complaintSupplyServiceRequests = [];



  accountNumber = "";
  billingData = "";
  complaintSupplyProblemLoder: boolean = false;
  complaintSupplyServiceRequestLoder: boolean = false;
  userAccountsLoder: boolean = false;
  submitComplaingLoder: boolean = false;
  complaintCaseTypeLoder: boolean = false;
  complaintBillRelatedReasonLoder: boolean = false;
  billingDataLoder: boolean = false;
  isbillingDataFound: boolean = false;
  showTrackingNo = false;
  trackingNo = "";
  showMainForm:boolean=false;

  placeType:any=[];
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private complaints: ComplaintsService,
    private AuthService: AuthService,
    private DashboardService: DashboardService
  ) {}

  ngOnInit() {
    if (this.helpers.getLocalStoragData("accountToken") != null) {
      let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
      let accountTokenInfo = accountToken.split(":");
      this.accountNumber = accountTokenInfo[1]; //account Number
      this.dispString = "Account No. ( " + this.accountNumber + " ) ";
    } else {
      this.AuthService.getCurrentUser();
      this.dispString =
        "User Name ( " + this.AuthService.getCurrentUser().username + " ) ";
    }

    this.getUserAccounts();
    this.getComplaintCaseType();
    this.getComplaintBillRelatedReason();
    this.getComplaintSupplyProblem();
    this.getComplaintSupplyServiceRequest();
    this.getBillingData();
    this.initnewServiceConnectionFrm(this.defautlSelectedCaseType);
    this.placeType=[{"label":"Rural","value":"rural"},{"label":"Urban","value":"urban"}];
  }
  initnewServiceConnectionFrm(selectedCaseType) {
    var fields={
      discomName: ["", Validators.required],
      division: ["", [Validators.required]],
      sdoOfficeName: ["", [Validators.required]],
      load: ["", [Validators.required]],
      consumerType: ["", [Validators.required]],
    };
    this.newServiceConnectionFrm = this.fb.group(fields);
  }
  getBillingData() {
    this.billingDataLoder = true;
    this.DashboardService.getBillingData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.billingDataLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.billingData = res.data_params;
            this.isbillingDataFound = true;
          } else {
            this.isbillingDataFound = false;
            this.billingData = "";
          }
        }
      },
      (error: AppError) => {
        this.isbillingDataFound = false;
        this.billingDataLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  getUserAccounts() {
    this.userAccountsLoder = true;
    this.complaints.getAccounts().subscribe(
      (response: any) => {
        this.userAccountsLoder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.userAccounts = res.data_params;
          } else {
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
  get f() {
    return this.newServiceConnectionFrm.controls;
  }

  getComplaintCaseType() {
    this.complaintCaseTypeLoder = true;
    this.complaints.getComplaintCaseType().subscribe(
      (response: any) => {
        var res = response;
        this.complaintCaseTypeLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.complaintCaseTypes = res.data_params;
            this.defautlSelectedCaseType = this.complaintCaseTypes[0].case_type;
          } else {
            this.complaintCaseTypes = [];
          }
        }
      },
      (error: AppError) => {
        this.complaintCaseTypeLoder = false;
        this.complaintCaseTypes = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  getComplaintBillRelatedReason() {
    this.complaintBillRelatedReasonLoder = true;
    this.complaints.getComplaintBillRelatedReason().subscribe(
      (response: any) => {
        var res = response;
        this.complaintBillRelatedReasonLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.complaintBillRelatedReasons = res.data_params;
          } else {
            this.complaintBillRelatedReasons = [];
          }
        }
      },
      (error: AppError) => {
        this.complaintBillRelatedReasonLoder = false;
        this.complaintBillRelatedReasons = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  getComplaintSupplyProblem() {
    this.complaintSupplyProblemLoder = true;
    this.complaints.getComplaintSupplyProblem().subscribe(
      (response: any) => {
        var res = response;
        this.complaintSupplyProblemLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.complaintSupplyProblems = res.data_params;
          } else {
            this.complaintSupplyProblems = [];
          }
        }
      },
      (error: AppError) => {
        this.complaintSupplyProblemLoder = false;
        this.complaintSupplyProblems = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  getComplaintSupplyServiceRequest() {
    this.complaintSupplyServiceRequestLoder = true;
    this.complaints.getComplaintSupplyServiceRequest().subscribe(
      (response: any) => {
        var res = response;
        this.complaintSupplyServiceRequestLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.complaintSupplyServiceRequests = res.data_params;
          } else {
            this.complaintSupplyServiceRequests = [];
          }
        }
      },
      (error: AppError) => {
        this.complaintSupplyServiceRequestLoder = false;
        this.complaintSupplyServiceRequests = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  submitNewServiceConnectionFrm() {
    this.newServiceConnectionFrm = this.helpers.markAsTouched(this.newServiceConnectionFrm);
    if (this.newServiceConnectionFrm.status != "INVALID") { // If form is not invalid
      const newServiceConnectionFrmData = this.newServiceConnectionFrm.value;
        this.showMainForm=true;
    } else {
      this.toastr.warning("Please fill all required fields", "Failed!");
    }
  }
}

