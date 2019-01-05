import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { AuthService } from "../services/authService/auth.service";
import { DataService } from '../services/data.service';
import { ProfileService } from './../services/profile/profile.service';


require("../../../node_modules/moment/min/moment.min.js");

declare var moment: any;
declare var $: any;

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {

  NotificationsLoader:boolean=false
  notificationsdata:any=[];
  notificationfound:boolean=false

  constructor(
    public auth:AuthService,
    public dataservice:DataService,
    private helpers:HelpersService,
    private profile:ProfileService
  ) { }

  ngOnInit() {


    this.getnotificationwithoutData();
  };

    getnotificationwithoutData() {
      // this.NotificationsLoader = true;
      // this.profile.getnotificationwithoutData().subscribe(
      //   (response: any) => {
      //     var res = response;
      //     this.NotificationsLoader = false;
      //     if (res.authCode) {
      //       if (res.authCode == "200" && res.status == true) {
      //         this.notificationsdata = res.data_params;
              
      //         this.notificationfound = true;
      //       } else {
      //         this.notificationfound = false;
      //         this.notificationsdata = "";
      //       }
      //     }
      //   },
      //   (error: AppError) => {
      //     this.notificationfound = false;
      //     this.NotificationsLoader = false;
      //     // if (error instanceof BadInput) {
      //     } else {
      //       throw error;
      //     }
      //   }
      // );
    }


  }









  
  

 

  



