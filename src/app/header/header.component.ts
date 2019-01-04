import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app-error';
import { ProfileService } from './../services/profile/profile.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import {AuthService} from '../services/authService/auth.service';
import { DataService } from '../services/data.service';
declare var $: any;
require('../../assets/js/owl.carousel.js');


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  dashboardDataApiUrl='users/getUserData'
  userName
  userEmail
  accountNumber=""

  NotificationsLoader:boolean=false
  notificationsdata:any=[];
  notificationfound:boolean=false

  constructor(
    public auth:AuthService,
    public dataservice:DataService,
    private helpers:HelpersService,
    private profile:ProfileService) { }
  

  ngOnInit() {

    this.getnotificationData();
    
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


  // getnotificationData() {
  //   console.log("getnotificationData");
  //   this.NotificationsLoader = true;
  //   this.profile.getnotificationData(header).subscribe(
  //     (response: any) => {
  //       this.NotificationsLoader = false;
  //       var res = response;
  //       if (res.authCode) {
  //         if (res.data_params.length > 0) {
  //           this.notificationsdata = res.data_params;
  //         } else {
  //           this.notificationsdata = [];
  //         }
  //       }
  //     },
  //     error => {
  //       this.NotificationsLoader = false;
  //       this.notificationsdata = [];
  //       throw error;
  //     }
  //   );
  // }


  getnotificationData() {
    this.NotificationsLoader = true;
    this.profile.getnotificationData().subscribe(
      (response: any) => {
        var res = response;
        this.NotificationsLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.notificationsdata = res.data_params;
          } else {
            
            this.notificationsdata = "";
          }
        }
      },
      (error: AppError) => {
        this.NotificationsLoader = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
 
  

  logout(){
    this.auth.logout()
  }

}
