import { HelpersService } from './../helpers/helpers.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private data:DataService,private auth:AuthService,private helper:HelpersService) { }
  getProfileUrl="users/getProfile";
  updateProfileUrl="users/updateProfile";
  updateProfileImageUrl="users/updateProfileImage";
  getProfile(accountNumber){
    var currentUser=this.auth.getCurrentUser();
    var body={"profileToken":btoa(currentUser.userId),"accountToken":btoa(accountNumber)};
   return this.data.getAll(this.getProfileUrl,body,this.helper.setHeaderData(),"POST");
  }
  saveProfile(data_object){
    var currentUser=this.auth.getCurrentUser();
    data_object.profileToken=btoa(currentUser.userId);
    return this.data.create(this.updateProfileUrl,data_object,this.helper.setHeaderData());
  }
  saveProfileIamge(data_object){
    var currentUser=this.auth.getCurrentUser();
    data_object["profileToken"]=btoa(currentUser.userId);
    return this.data.create(this.updateProfileImageUrl,data_object,this.helper.setHeaderData());
  }
}
