import { Component, OnInit,AfterViewInit,Input} from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
require('../../assets/js/owl.carousel.js');
@Component({
  selector: 'home-page-slider',
  templateUrl: './home-page-slider.component.html',
  styleUrls: ['./home-page-slider.component.css']
})

export class HomePageSliderComponent implements OnInit,AfterViewInit {
	@Input('content') content:any;
  constructor(private route:Router) { }

  ngOnInit() {
  	
	}
	redirecttocomplaints(path){
		this.route.navigate(["/"+path]);
	}
  ngAfterViewInit(){
		$(function() {
			$('.main-carousel').owlCarousel({
				navigation : true,
				loop:true,
				margin:10,
				dots:true,
				nav:false,
				responsive:{
					0:{
						items:1
					},
					600:{
						items:1
					},
					1000:{
						items:1
					}
				}
				})
	})
  	
  }

}
