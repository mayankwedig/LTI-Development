import { Component, OnInit,AfterViewInit } from '@angular/core';
declare var $: any;
require('../../assets/js/owl.carousel.js');

@Component({
  selector: 'home-imp-link-slider',
  templateUrl: './home-imp-link-slider.component.html',
  styleUrls: ['./home-imp-link-slider.component.css']
})
export class HomeImpLinkSliderComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $(function() {
			$('.important-links-slide').owlCarousel({
		    loop:true,
		    margin:10,
		    dots:false,
		    nav:true,
		    navText:["<img src='../../assets/images/left-nav.png'>", "<img src='../../assets/images/right-nav.png'>"],
		    responsive:{
		        0:{
		            items:2,
		        },
		        600:{
		            items:3,
		        },
		        1000:{
		            items:5
		        }
		    }
		})
	})
  }

}
