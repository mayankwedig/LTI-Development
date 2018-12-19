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

  constructor(public auth:AuthService,public dataservice:DataService) { }
  dashboardDataApiUrl='users/getUserData'
  userName
  userEmail
  ngOnInit() {
  
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
