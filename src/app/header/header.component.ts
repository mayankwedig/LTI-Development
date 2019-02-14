import { WindowRefService } from './../services/window-ref/window-ref.service';
import { NotificationsService } from './../services/notifications/notifications.service';
import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app-error';
import { ProfileService } from './../services/profile/profile.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import {AuthService} from '../services/authService/auth.service';
import { DataService } from '../services/data.service';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var $: any;
require('../../assets/js/owl.carousel.js');
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  constructor(private winRef: WindowRefService,public router: Router, public notificationsService:NotificationsService,public auth:AuthService,public dataservice:DataService,private helpers:HelpersService,private profile:ProfileService) { }
  searchKeyWord="";
  dashboardDataApiUrl='users/getUserData'
  userName
  userEmail
  accountNumber=""
  notificationLoder:boolean=true;
  notifications:any=[];
  totalNotifications:any=0;
  hideTotalNotification:boolean=true;
  selected_lang="eng";//localStorage.getItem("selected_lag"); 
  logogImage="";
  doSearch(){
    if(this.searchKeyWord != ""){
      if(localStorage.getItem('search') != null){
          localStorage.removeItem('search');
      }
      localStorage.setItem("search",this.searchKeyWord);
      this.router.navigate(["/search"]);
    }
  }
  ngOnInit() {
    this.getSiteLogo();
    if(localStorage.getItem('search') != null){
      this.searchKeyWord=localStorage.getItem('search');
    }else{
      this.searchKeyWord="";
    }
    if(localStorage.getItem('selected_lag') == null){
      localStorage.setItem("selected_lag",this.selected_lang);
    }else{
      this.selected_lang=localStorage.getItem('selected_lag');
    }
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
    this.getLimitedNotifications();
  }
  getSiteLogo(){
     this.logogImage=environment.logo_not_found;
    this.profile.getSiteLogo().subscribe((result:any)=>{
        console.log(result);
        if(result.authCode == 200 && result.status){
          if(result.home_logo != ''){
            this.logogImage= environment.logoUrl+result.data_params.home_logo;
          }else{
            this.logogImage=environment.logo_not_found;
          }
          
        }
    },(error:AppError)=>{
      this.logogImage=environment.logo_not_found;
      if (error instanceof BadInput) {
      } else {
        throw error;
      }
    });
  }
  loderLoder=false;
  profile_image:any="../assets/images/placeholder-man-grid-240x268.png";
  changeLang(changeLang){
    localStorage.setItem("selected_lag",changeLang);
    /* this.ngOnInit(); */
    this.onRefresh();
  }
  onRefresh() {
   
    this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
  
    let currentUrl = this.router.url; 
   
    if(currentUrl == "/"){
      this.winRef.nativeWindow.location=this.helpers.getSiteUrl()+"/home";
    }else{
      this.winRef.nativeWindow.location=this.helpers.getSiteUrl()+currentUrl;
    }
    
    /* this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      }); */
    }
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
  
 getLimitedNotifications(){
   var limited=true;
   this.notificationsService.getNotifications(limited).subscribe(
    (response: any) => {
      var res = response;
      this.notificationLoder = false;
      if (res.authCode) {
        if (res.authCode == "200" && res.status == true) {
          this.totalNotifications=res.data_params.length;
          this.hideTotalNotification=false;
          this.notifications = res.data_params;
        } else {
          this.notifications = [];
        }
      }
    },
    (error: AppError) => {
      this.notificationLoder = false;
      this.notifications = [];
      if (error instanceof BadInput) {
      } else {
        throw error;
      }
    }
  );
 }
 funcHideNotification(){
   this.hideTotalNotification=true;
 }
 

  logout(){
    this.auth.logout()
  }

}
