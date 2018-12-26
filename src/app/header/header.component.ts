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

  constructor(public auth:AuthService,public dataservice:DataService,private helpers:HelpersService) { }
  dashboardDataApiUrl='users/getUserData'
  userName
  userEmail
  ngOnInit() {
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token
      console.log(accountTokenInfo);
      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
        // if token of current user
       /*  if (parseInt(accountTokenInfo[2]) == 0) {
          this.is_net_metering = false;
        } else {
          this.is_net_metering = true;
        } */
      }
    }
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
