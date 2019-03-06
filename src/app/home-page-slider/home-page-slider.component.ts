import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit,AfterViewInit,Input} from '@angular/core';
import { Router } from '@angular/router';
import { IconsService } from '../services/icons/icons.service';
import { environment } from "../../environments/environment";
declare var $: any;
require('../../assets/js/owl.carousel.js');
@Component({
  selector: 'home-page-slider',
  templateUrl: './home-page-slider.component.html',
  styleUrls: ['./home-page-slider.component.css']
})

export class HomePageSliderComponent implements OnInit,AfterViewInit {
	@Input('content') content:any;
	constructor(private route:Router,
		private helpers: HelpersService,
    private icones: IconsService) { }
		headerIcons: any = null;
		getIcones() {
			this.headerIcons = null;
			if (this.helpers.getLocalStoragData("icons") == null) {
				this.icones.getIcons().subscribe(
					(response: any) => {
						if (response.authCode == "200" && response.status == true) {
							this.helpers.setLocalStoragData(
								"icons",
								JSON.stringify(response.data_params)
							);
						}
					},
					error => {}
				);
			} else {
				if (this.route.url == "/") {
					this.icones.getIcons().subscribe(
						(response: any) => {
							if (response.authCode == "200" && response.status == true) {
								this.helpers.setLocalStoragData(
									"icons",
									JSON.stringify(response.data_params)
								);
							}
						},
						error => {}
					);
				}
			}
			this.headerIcons = JSON.parse(this.helpers.getLocalStoragData("icons"));
		}
		setIconeImage(index) {
			if (this.headerIcons != null) {
				let image = environment.icon_img + this.headerIcons[index];
				if (image) {
					return image;
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
  ngOnInit() {
  	this.getIcones();
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
