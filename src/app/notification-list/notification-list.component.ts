import { NotificationsService } from './../services/notifications/notifications.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { AuthService } from "../services/authService/auth.service";
import { DataService } from '../services/data.service';




require("../../../node_modules/moment/min/moment.min.js");

declare var moment: any;
declare var $: any;

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {

  notificationLoder:boolean=false
  notifications:any=[];
  notificationfound:boolean=false
  isnotificationFound:boolean=false;

  constructor(
    public auth:AuthService,
    public dataservice:DataService,
    private helpers:HelpersService,
    private notificationsService:NotificationsService
  ) { }

  ngOnInit() {


    this.getAllNotifications();
  };
  getAllNotifications(){
    var limited=false;
    this.notificationsService.getNotifications(limited).subscribe(
     (response: any) => {
       var res = response;
       this.notificationLoder = false;
       if (res.authCode) {
         if (res.authCode == "200" && res.status == true) {
           this.notifications = res.data_params;
           this.isnotificationFound=true;
         } else {
           this.notifications = [];
           this.isnotificationFound=false;
         }
       }
     },
     (error: AppError) => {
      this.isnotificationFound=false; 
      this.notificationLoder = false;
       this.notifications = [];
       if (error instanceof BadInput) {
       } else {
         throw error;
       }
     }
   );
  }
  


  }









  
  

 

  



