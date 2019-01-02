import { CustomValidationsService } from './../services/custom-validations/custom-validations.service';
import { SerivceRequestService } from './../services/service-request/serivce-request.service';
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { NewConnectionRequest } from "./../services/new-connection-request/new-connection-request.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";


@Component({
  selector: 'app-new-service-connection',
  templateUrl: './new-service-connection.component.html',
  styleUrls: ['./new-service-connection.component.css'],

})

export class NewServiceConnectionComponent implements OnInit {
  newServiceConnectionFrm: FormGroup;
  newServiceConnectionFrmSetp2: FormGroup;
  dispString: any = "";
  
  accountNumber = "";

  discomNames = [];
  discomNameLoader: boolean = false;

  divisionLoder: boolean = false;
  
  showTrackingNo:boolean = false;
  trackingNo = "";
  
  showMainForm:boolean=false;

  enclosedIdentifDocLoder:boolean=false;
  enclosedIdentifDocs:any=[];
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private newConnectionRequestService: NewConnectionRequest,
    private AuthService: AuthService,
    private DashboardService: DashboardService,
    private SerivceRequest:SerivceRequestService,
    private customValidations:CustomValidationsService
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

    this.getDiscomName();
    this.initnewServiceConnectionFrm();
    this.initnewServiceConnectionStep2Frm();
    this.getServReqEnclosedIdentifDoc();
  }
  initnewServiceConnectionFrm() {
    var fields={
      discomName: ["", Validators.required],
      division: ["", [Validators.required]],
      sdoOfficeName: ["", [Validators.required]],
      load: ["", [Validators.required]],
      consumerType: ["", [Validators.required]],
    };
    this.newServiceConnectionFrm = this.fb.group(fields);
  }
  getServReqEnclosedIdentifDoc() {
    this.enclosedIdentifDocLoder = true;
    this.SerivceRequest.getServReqEnclosedIdentifDoc().subscribe(
      (response: any) => {
        var res = response;
        this.enclosedIdentifDocLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.enclosedIdentifDocs = res.data_params;
          } else {
            this.enclosedIdentifDocs = [];
          }
        }
      },
      (error: AppError) => {
        this.enclosedIdentifDocLoder = false;
        this.enclosedIdentifDocs = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  initnewServiceConnectionStep2Frm(){
    
    var fields={
     "firstName":["", Validators.required],
      "lastName":["", Validators.required],
      "fatherFirstName":["", Validators.required],
      "fatherLastName":["", Validators.required],
      "husbandFirstName":"",
      "husbandLastName":"",
      "motherName":["", Validators.required],
      "occupation":[""],
      "communicationAddress1":["", Validators.required],
      "communicationAddress2":["", Validators.required],
      "communicationAddress3":["", Validators.required],
      "communicationPincode":["", Validators.required],
      "communicationMobileNumber":["", Validators.required],
      "installationAddress1":["", Validators.required],
      "installationAddress2":["", Validators.required],
      "installationAddress3":["", Validators.required],
      "installationPincode":["", Validators.required],
      "installationMobileNumber":["", Validators.required],
      "isPermanentAddressIntallation":["yes"],
      "plotSize":["", Validators.required],
      "coveredArea":["", Validators.required],
      "townName":["", Validators.required],
      "units":[""],
      "purposeOfSupply":["Domestic", Validators.required],
      "connectionPoint":[""],
      "adjacentAccountNumber":[""],
      "email":["", [Validators.required, this.customValidations.isEmailValid("email")]],
      "placeType":["Urban"],
      "connectionType":["Post Paid"],
      "phaseType":[""],
      "possessionDetails":["No"],
      "documentIdentification":[""],
      "noc":["No"],
      "ownerConcentLetter":["No"],
      "workCompletionCertificate":["No"]
      }
      this.newServiceConnectionFrmSetp2 = this.fb.group(fields);
  }
  getDiscomName() {
    this.discomNameLoader = true;
    var header={
      "supplyType":"discoms"
    };
    this.newConnectionRequestService.getMasterData(header).subscribe(
      (response: any) => {
        this.discomNameLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.discomNames = res.data_params;
          } else {
            this.discomNames = [];
          }
        }
      },
      error => {
        this.discomNameLoader = false;
        this.discomNames = [];
        throw error;
      }
    );
  }
  divisions : any=[];
  sdoOffices:any=[];
  sdoOfficeLoader:boolean=false;
  fetchDevision(id) {
  var divisionId=id.value;
  if(divisionId != ""){
    this.divisions=[];
    this.sdoOffices=[];
    this.divisionLoder = true;
    this.sdoOfficeLoader= true;
    var header={"dropdownId":divisionId};
    this.newConnectionRequestService.getDivisions(header).subscribe(
      (response: any) => {
        this.divisionLoder = false;
        this.sdoOfficeLoader=false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.divisions = res.data_params[0]; //Divisions
            this.sdoOffices=res.data_params[1]; //SDO Offices
          } else {
            this.divisions = [];
          }
        }
      },
      error => {
        this.divisionLoder = false;
        this.sdoOfficeLoader=false;
        this.divisions = [];
        throw error;
      }
    )
  }else{
    this.toastr.error("Please select discom name","Failed");
  }
  }
  get f() {
    return this.newServiceConnectionFrm.controls;
  }
  get step2f() {
    return this.newServiceConnectionFrmSetp2.controls;
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
  submitNewConnectReqLoader:boolean=false;
  submitNewConnectionStep2Frm() {
    this.submitNewConnectReqLoader=true;
    this.newServiceConnectionFrmSetp2 = this.helpers.markAsTouched(this.newServiceConnectionFrmSetp2);
    if (this.newServiceConnectionFrmSetp2.status != "INVALID") { // If form is not invalid
      const newServiceConnectionFrmSetp2Data = this.newServiceConnectionFrmSetp2.value;
      const setp1FrmValues=this.newServiceConnectionFrm.value;
      newServiceConnectionFrmSetp2Data["discomName"]=setp1FrmValues.discomName;
      newServiceConnectionFrmSetp2Data["division"]=setp1FrmValues.division;
      newServiceConnectionFrmSetp2Data["sdoOfficerName"]=setp1FrmValues.sdoOfficeName;
      newServiceConnectionFrmSetp2Data["consumerType"]=setp1FrmValues.consumerType;
      newServiceConnectionFrmSetp2Data["load"]=setp1FrmValues.load;
      newServiceConnectionFrmSetp2Data["accountToken"]=btoa(this.accountNumber);
      newServiceConnectionFrmSetp2Data["typeUser"]="login";
      this.newConnectionRequestService.addNewConnection(newServiceConnectionFrmSetp2Data).subscribe(
        (response: any) => {
          var res = response;
          this.submitNewConnectReqLoader = false;
          this.showMainForm = false;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              res["msg"] =
                "Your new connection request has been registered successfully, We've sent a notification E-mail along with tracking number.";
              this.toastr.success(res.msg, "Success!");
              this.showTrackingNo = true;
              this.trackingNo = res.data_params;
              setTimeout(() => {
                this.showTrackingNo = false;
                this.trackingNo = res.data_params;
                this.initnewServiceConnectionFrm();
                this.initnewServiceConnectionStep2Frm();  
              }, 30000);
            } else {
              this.toastr.error(res.msg, "Failed!");
            }
          }
        },
        (error: AppError) => {
          this.submitNewConnectReqLoader = false;
          this.showMainForm = true;
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );        
    } else {
      this.toastr.warning("Please fill all required fields", "Failed!");
    }
  }
}

