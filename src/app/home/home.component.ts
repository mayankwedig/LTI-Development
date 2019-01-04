import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD

=======
>>>>>>> parent of 336b2d9fc... Marquee
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
}]
  constructor() { }

  ngOnInit() {
  
  }

}
