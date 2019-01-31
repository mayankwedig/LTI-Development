import { HomeService } from './../services/home/home.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

require('../../assets/js/owl.carousel.js');

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	impLinks:any=[];
	impLinkLoader:boolean=false;
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
  constructor(public homeService:HomeService) { }

  ngOnInit() {
		this.getImportantLink();
  }

}
