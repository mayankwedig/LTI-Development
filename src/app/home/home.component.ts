import { Component, OnInit } from '@angular/core';
import {HomeService} from '../services/home/home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  ngOnInit() {this.getLatestNews();}
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
}
