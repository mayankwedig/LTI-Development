import { Component, OnInit} from '@angular/core';
import {HomeService} from '../services/home/home.service';

require('../../assets/js/owl.carousel.js');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  sliderContent=[{
      "image":"../assets/images/main-slide1.jpg",
      "desc":"Changing The Power<br> That Changes<br> The World"
      },{
        "image":"../assets/images/main-slide2.jpg",
        "desc":"Changing The Power<br> That Changes<br> The World"
    },{
      "image":"../assets/images/main-slide3.jpg",
      "desc":"Changing The Power<br> That Changes<br> The World"
}];
constructor(private homeService:HomeService) {  this.getLatestNews();}
latestNewsLoader:boolean=false;
latestNews:any=[];
ministerLoader:boolean=false;
ministermsg:any=[];
impLinkLoader:boolean=false;
impLinks:any=[];
  ngOnInit() {this.getLatestNews();this.getMinisterMessage();this.getImportantLink();}
  
  getLatestNews() {
    this.latestNewsLoader = true;
    var header = {
      "supplyType": "latest_news"
      
    };
    this.homeService.getMasterData(header).subscribe(
      (response: any) => {
        this.latestNewsLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.latestNews = res.data_params;
          } else {
            this.latestNews = [];
          }
        }
      },
      error => {
        this.latestNewsLoader = false;
        this.latestNews = [];
        throw error;
      }
    );
  }
  ministerDataFound:boolean=false;
  getMinisterMessage() {
    this.ministerLoader = true;
    
    this.homeService.getMinisterdata().subscribe(
      (response: any) => {
        this.ministerLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
           
            this.ministermsg = res.data_params;
            this.ministerDataFound=true;
          } else {
            this.ministermsg = [];
            this.ministerDataFound=false;
          }
        }
      },
      error => {
        this.ministerDataFound=false;
        this.ministerLoader = false;
        this.ministermsg = [];
        throw error;
      }
    );
  }


  getImportantLink() {
    this.impLinkLoader = true;
    this.homeService.getImportantLink().subscribe(
      (response: any) => {
        this.impLinkLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
             this.impLinks = res.data_params;
          } else {
            this.impLinks = [];
          }
        }
      },
      error => {
        this.impLinkLoader = false;
        this.impLinks = [];
        throw error;
      }
    );
  }

}
