import { Component, OnInit } from '@angular/core';
import { NewConnectionRequest } from "./../services/new-connection-request/new-connection-request.service";

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



  latestnewsLoader: boolean = false;
  latestnewsFound: false;
  LatestNews = [];

  constructor(
    private newConnectionRequestService: NewConnectionRequest
  ) { }

  ngOnInit() {

    this.GetlatestData();

  }

  GetlatestData() {
   
    this.latestnewsLoader = true;
    var header = {
      supplyType: "latest_news"
    };
    this.newConnectionRequestService.getlatestData(header).subscribe(
      (response: any) => {
        console.log(response);
        this.latestnewsLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.data_params.length > 0) {
           
            this.LatestNews = res.data_params;
          } else {
            this.LatestNews = [];
          }
        }
      },
      error => {
        this.latestnewsLoader = false;
        this.LatestNews = [];
        throw error;
      }
    );
  }




}
