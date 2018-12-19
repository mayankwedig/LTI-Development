import { ManageaccountService } from "./../manageaccount/manageaccount.service";
import { Injectable } from "@angular/core";
import { HelpersService } from "./../helpers/helpers.service";
import { DataService } from "./../data.service";
import { AuthService } from "../authService/auth.service";

@Injectable({
  providedIn: "root"
})
export class ComplaintsService {
  getComplaintCaseTypeAPI="users/getComplaintCaseType";
  getComplaintBillRelatedReasonAPI="users/getComplaintBillRelatedReason";
  addComplaintAPI="users/addComplaint";
  getComplaintSupplyProblemAPI="users/getComplaintSupplyProblem";
  getComplaintSupplyServiceRequestAPI="users/getComplaintSupplyServiceRequest";
  constructor(
    private userAccounts: ManageaccountService,
    private data: DataService,
    private auth: AuthService,
    private helper: HelpersService
  ) {}
  getAccounts() {
    return this.userAccounts.getAccount("");
  }
  getComplaintCaseType(){
   return this.data.getAll(this.getComplaintCaseTypeAPI,"",this.helper.setHeaderData(),"POST");
  }
  getComplaintBillRelatedReason(){
    return this.data.getAll(this.getComplaintBillRelatedReasonAPI,"",this.helper.setHeaderData(),"POST");
   }
   getComplaintSupplyProblem(){
    return this.data.getAll(this.getComplaintSupplyProblemAPI,"",this.helper.setHeaderData(),"POST");
   }
   getComplaintSupplyServiceRequest(){
    return this.data.getAll(this.getComplaintSupplyServiceRequestAPI,"",this.helper.setHeaderData(),"POST");
   }

   addComplaint(updSubsData){
    var currentUser=this.auth.getCurrentUser();
    updSubsData["profileToken"]=btoa(currentUser.userId);
    return this.data.getAll(this.addComplaintAPI,updSubsData,this.helper.setHeaderData(),"POST"); 
  }
}
