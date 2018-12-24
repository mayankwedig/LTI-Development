import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

@Component({
  selector: 'app-view-all-complaints',
  templateUrl: './view-all-complaints.component.html',
  styleUrls: ['./view-all-complaints.component.css']
})
export class ViewAllComplaintsComponent implements OnInit {
  dispString: any = "";
  defautlSelectedCaseType: any = "Meter Related";
  accountNumber = "";
  complaintsData = []
  complaintsDataLoader: boolean = false;
  isComplaintsDataFound: boolean = false;


  constructor(

    private helpers: HelpersService,

    private complaints: ComplaintsService,
    private AuthService: AuthService,

  ) { }

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


    this.getComplaintData();

  }
  getComplaintData() {
    this.complaintsDataLoader = true;
    this.complaints.getComplaintData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.complaintsDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.complaintsData = res.data_params;
            this.isComplaintsDataFound = true;
          } else {
            this.isComplaintsDataFound = false;
            this.complaintsData = [];
          }
        }
      },
      (error: AppError) => {
        this.isComplaintsDataFound = false;
        this.complaintsDataLoader = false;
        this.complaintsData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }


}
