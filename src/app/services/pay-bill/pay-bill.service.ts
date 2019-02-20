import { AuthService } from './../authService/auth.service';
import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class PayBillService {

  constructor(private _data:DataService,private AuthService:AuthService ,private DashboardService:DashboardService, private helpers: HelpersService) { }
  getAdvertisementData() {
   return this.DashboardService.getAdvertisementData();
  }
  translate(string: string): string {
    return this.helpers.translate(string);
  }
  getAccountToken(){
    return this.helpers.getLocalStoragData("accountToken");
  }
  getCurrentUser(){
    return this.AuthService.getCurrentUser();
  }
  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }
  getBillAccountDetails(body){
  return this._data.getAll("users/billPayEnquiry",body,{},"POST");
  }
}
