import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

@Component({
  selector: "app-complaints",
  templateUrl: "./complaints.component.html",
  styleUrls: ["./complaints.component.css"]
})
export class ComplaintsComponent implements OnInit {
  complaintsFrm: FormGroup;
  dispString: any = "";

  defautlSelectedCaseType: any = "Meter Related";
  userAccounts = [];
  complaintCaseTypes = [];
  complaintBillRelatedReasons=[];
  complaintSupplyProblems=[];
  complaintSupplyServiceRequests=[];
  
  accountNumber = "";
  
  complaintSupplyProblemLoder:boolean=false;
  complaintSupplyServiceRequestLoder:boolean=false;
  userAccountsLoder: boolean = false;
  submitComplaingLoder: boolean = false;
  complaintCaseTypeLoder: boolean = false;
  complaintBillRelatedReasonLoder:boolean=false;
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private complaints: ComplaintsService,
    private AuthService: AuthService
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
    this.initComplaintsFrm(this.defautlSelectedCaseType);
  }
  initComplaintsFrm(selectedCaseType) {
    if (selectedCaseType == "Meter Related") {
      this.complaintsFrm = this.fb.group({
        accountNumber: [this.accountNumber, Validators.required],
        caseType: [selectedCaseType, [Validators.required]],
        comments: [""]
      });
    }
    if (selectedCaseType == "Bill Related") {
      this.complaintsFrm = this.fb.group({
        accountNumber: [this.accountNumber, Validators.required],
        caseType: [selectedCaseType, [Validators.required]],
        billId: ["", Validators.required],
        reason: ["", Validators.required],
        comments: ["", Validators.required]
      });
    }
    if (selectedCaseType == "Supply Related") {
      this.complaintsFrm = this.fb.group({
        accountNumber: [this.accountNumber, Validators.required],
        caseType: [selectedCaseType, [Validators.required]],
        serviceRequest: ["", Validators.required],
        problem: ["", Validators.required],
        comments: ["", Validators.required]
      });
    }
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
    return this.complaintsFrm.controls;
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
            this.defautlSelectedCaseType=this.complaintCaseTypes[0].case_type;
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
  getComplaintBillRelatedReason(){
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
  
  getComplaintSupplyProblem(){
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
  
  getComplaintSupplyServiceRequest(){
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
  
  submitComplaintFrm() {
      const complaintsFrmData = this.complaintsFrm.value;
      this.submitComplaingLoder = true;
      this.complaints.addComplaint(complaintsFrmData).subscribe(
        (response: any) => {
          var res = response;
          this.submitComplaingLoder = false;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              res["msg"]="Your complaint has been registered successfully, We've sent a notification E-mail along with tracking number.";
              this.toastr.success(res.msg, "Success!");
            } else {
              this.toastr.error(res.msg, "Faild!");
            }
          }
        },
        (error: AppError) => {
          this.submitComplaingLoder = false;
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
  }
}
