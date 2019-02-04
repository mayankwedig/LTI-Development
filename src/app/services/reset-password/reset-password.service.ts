import { AuthService } from './../authService/auth.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
resetPasswordAPI="users/resetPassword";
  constructor(private _dataService:DataService,private _auth:AuthService) { }
  resetPassword(data_object){
    var currentUser=this._auth.getCurrentUser();
    data_object["resetPasswordToken"]=btoa(currentUser.userId)
    return this._dataService.create(this.resetPasswordAPI,data_object); 
  }
}
