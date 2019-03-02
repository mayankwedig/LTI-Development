import { AuthService } from "./../authService/auth.service";
import { HelpersService } from "./../helpers/helpers.service";
import { Injectable } from "@angular/core";
import { DashboardService } from "../dashboard/dashboard.service";
import { DataService } from "../data.service";
import { ToastrService } from "ngx-toastr";
import { ManageaccountService } from "../manageaccount/manageaccount.service";
@Injectable({
  providedIn: "root"
})
export class PayBillService {
  constructor(
    private _data: DataService,
    private AuthService: AuthService,
    private DashboardService: DashboardService,
    private helpers: HelpersService,
    private toaster: ToastrService,
    private userAccounts:ManageaccountService
  ) {}
  getAdvertisementData() {
    return this.DashboardService.getAdvertisementData();
  }
  translate(string: string): string {
    return this.helpers.translate(string);
  }
  getAccountToken() {
    return this.helpers.getLocalStoragData("accountToken");
  }
  getCurrentUser() {
    return this.AuthService.getCurrentUser();
  }
  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }
  getBillAccountDetails(body) {
    return this._data.getAll("users/billPayEnquiry", body, {}, "POST");
  }
  getAccounts() {
    return this.userAccounts.getAccount("");
  }
  getPaymentChecksm(){
    return this._data.getAll("users/paytmCheckout",{},{},"POST");
  }
  prompt(flag: string, msg: string) {
    var translatedMsg = this.translate(msg);
    switch (flag) {
      case "success":
        this.toaster.success(translatedMsg);
        break;
      case "warning":
        this.toaster.warning(translatedMsg);
        break;
      case "error":
        this.toaster.error(translatedMsg);
        break;
      default:
        this.toaster.error("Something went wrong!");
        break;
    }
  }
}
