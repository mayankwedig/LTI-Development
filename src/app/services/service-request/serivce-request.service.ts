import { ManageaccountService } from "./../manageaccount/manageaccount.service";
import { Injectable } from '@angular/core';
import { HelpersService } from "./../helpers/helpers.service";
import { DataService } from "./../data.service";
import { AuthService } from "../authService/auth.service";
@Injectable({
  providedIn: 'root'
})
export class SerivceRequestService {
  getServiceRequestTypeAPI="users/getServiceRequestType";
  getServReqEnclosedIdentifDocAPI="users/getServiceRequestEnclosedIdentificationDocument";
  getChangeReasonsAPI="users/getServiceRequestChangeReason";
  addServiceRequestAPI="users/addServiceRequest";
  constructor(
    private userAccounts: ManageaccountService,
    private data: DataService,
    private auth: AuthService,
    private helper: HelpersService
  ) {}
  getAccounts() {
    return this.userAccounts.getAccount("");
  }
  getServiceRequestType(){
    return this.data.getAll(this.getServiceRequestTypeAPI,"",this.helper.setHeaderData(),"POST");
   }
   getServReqEnclosedIdentifDoc(){
    return this.data.getAll(this.getServReqEnclosedIdentifDocAPI,"",this.helper.setHeaderData(),"POST");
   }
   getChangeReasons(){
    return this.data.getAll(this.getChangeReasonsAPI,"",this.helper.setHeaderData(),"POST");
   }
   addServiceRequest(updSubsData){
    var currentUser=this.auth.getCurrentUser();
    updSubsData["profileToken"]=btoa(currentUser.userId);
    return this.data.getAll(this.addServiceRequestAPI,updSubsData,this.helper.setHeaderData(),"POST"); 
  }
}
