import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app-error';
import { ProfileService } from './../services/profile/profile.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import {AuthService} from '../services/authService/auth.service';
import { DataService } from '../services/data.service';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';


declare var $: any;
require('../../assets/js/owl.carousel.js');
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  constructor(public auth:AuthService,public dataservice:DataService,private helpers:HelpersService,private profile:ProfileService) { }
  dashboardDataApiUrl='users/getUserData'
  userName
  userEmail
  accountNumber=""
  ngOnInit() {
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token
      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
        this.accountNumber=accountTokenInfo[1];
        if(this.auth.getCurrentUser().username != null){
          this.userName=this.auth.getCurrentUser().username;
        }
        this.getProfile();
        // if token of current user
       /*  if (parseInt(accountTokenInfo[2]) == 0) {
          this.is_net_metering = false;
        } else {
          this.is_net_metering = true;
        } */
      }
    }else{
      if(this.auth.isLoggedIn()){
        if(this.auth.getCurrentUser().username != null){
          this.userName=this.auth.getCurrentUser().username;
        }
      }
      
     
    }
  }
  loderLoder=false;
  profile_image:any="../assets/images/placeholder-man-grid-240x268.png";
  getProfile() {
    this.loderLoder = true;
    this.profile.getProfile(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.loderLoder = false;

        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            var profileData = res.data_params;
            this.profile_image = profileData.profile_image;
          } 
        }
      },
      (error: AppError) => {
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  ngAfterViewInit(){
    $(function() {
      $('#main-navbar-notifications').slimScroll({ 
        height: 250 ,
        color: '#1d9455',
        opacity : 1,
        size: '15px'
      });
	})
  }
 
  

  logout(){
    this.auth.logout()
  }

}
