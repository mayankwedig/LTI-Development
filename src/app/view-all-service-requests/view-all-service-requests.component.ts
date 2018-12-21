import { DashboardService } from './../services/dashboard/dashboard.service';
import { ViewAllServiceRequestsService } from './../services/view-all-service-requests/view-all-service-requests.service';
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";


import { Router } from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: 'app-view-all-service-requests',
  templateUrl: './view-all-service-requests.component.html',
  styleUrls: ['./view-all-service-requests.component.css']
})
export class ViewAllServiceRequestsComponent implements OnInit {
  serviceRequestLoder: any = false;
  ServiceRequestFound = false;
  ServiceRequests: any = "";
  dispString = "";
  accountNumber
  constructor(
    private viewAllServiceRequests: ViewAllServiceRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private helper: HelpersService,
    private DashboardService:DashboardService
  ) {}
  ngOnInit() {
    let accountToken = atob(this.helper.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";
    this.getServiceRequest();
   
  }
  getServiceRequest() {
    this.serviceRequestLoder = true;
    this.DashboardService.getServiceRequest(
      this.accountNumber,
      (result: any) => {
        this.serviceRequestLoder = false;
        if (result.authCode == "200" && result.data_params.length > 0) {
          this.ServiceRequests = result.data_params;
          this.ServiceRequestFound = true;
        } else {
          this.ServiceRequests = "";
          this.ServiceRequestFound = false;
        }
      }
    );
  }
 
  redirectoDashBoard(accountId, userId) {
    this.router.navigate(["/dashboard"]); 
  }
}
