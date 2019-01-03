import { ManageaccountService } from "./../manageaccount/manageaccount.service";
import { Injectable } from "@angular/core";
import { HelpersService } from "./../helpers/helpers.service";
import { DataService } from "./../data.service";
import { AuthService } from "../authService/auth.service";

@Injectable({
  providedIn: "root"
})
export class NewConnectionRequest {
  masterDropDownAPI = "users/masterDropDown";
  dropdownDataAPI = "users/dropdownData";
  addNewConnectionAPI = "users/addConnection";
  constructor(
    private userAccounts: ManageaccountService,
    private data: DataService,
    private auth: AuthService,
    private helper: HelpersService
  ) {}
  getMasterData(header) {
    return this.data.getAll(
      this.masterDropDownAPI,
      header,
      this.helper.setHeaderData(),
      "POST"
    );
  }


  // getlatestData(header) {
  //   return this.data.getAll(
  //     this.masterDropDownAPI,
  //     header,
  //     this.helper.setHeaderData(),
  //     "GET"
  //   );
  // }




  getlatestData(header){
    alert("tesdfs");
     return this.data.getAll(this.masterDropDownAPI, header,this.helper.setHeaderData(),"POST");
  }


  getDivisions(header) {
    return this.data.getAll(
      this.dropdownDataAPI,
      header,
      this.helper.setHeaderData(),
      "POST"
    );
  }
  addNewConnection(updSubsData) {
    var currentUser = this.auth.getCurrentUser();
    updSubsData["profileToken"] = btoa(currentUser.userId);
    return this.data.getAll(
      this.addNewConnectionAPI,
      updSubsData,
      this.helper.setHeaderData(),
      "POST"
    );
  }
}
