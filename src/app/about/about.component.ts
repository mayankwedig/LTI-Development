import { environment } from './../../environments/environment';
import { AboutService } from './../services/about/about.service';
import { Component, OnInit,AfterViewInit } from '@angular/core';

declare var $: any;
require('../../assets/js/owl.carousel.js');
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,AfterViewInit {

  constructor(private _aboutServices:AboutService) { }

  ngOnInit() {
		this.getContent();
		this.getMissionAndVision();
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
	content:any="";
	contentLoader:boolean=false;
	isContentFound:boolean=false;
	contentTitle:any="";
	missionVisionLoader: boolean = true;
  missionVisionData: any = [];
  missionVisionFound: boolean = false;
	getContent(){
		this.contentLoader=true;
		this._aboutServices.getAboutContent()
			.subscribe((response:any)=>{
			/* 	console.log(response.data_params); */
				this.contentLoader=false;
				if(response.status && response.authCode == "200"){
					this.isContentFound=true;
					this.contentTitle=response.data_params.title;
					this.content=response.data_params.description;/* .replace(/<(.|\n)*?>/g, '').replace(/\n/g, '').replace(/\t/g, '').replace("&#39;", "'").replace("�",'-').replace("�",'"').replace("&ldquo;",'"').replace("&rdquo;",'"').replace("&amp;",'&').replace('&#39;',"'");	 */
				}else{
					this.content="";
					this.isContentFound=false;
				}
			},(error)=>{
				this.isContentFound=false;
				this.contentLoader=false;
				this.content="";
			});
	}
	visionImage="../assets/images/tabs-img-1.jpg";
	missionImage="../assets/images/tabs-img-2.jpg";
	getMissionAndVision() {
    this.missionVisionLoader = true;
    this._aboutServices.getMissionandVision().subscribe(
      (response: any) => {
        this.missionVisionLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
						this.missionVisionData = res.data_params;
						if(this.missionVisionData[0].display_picture != ""){ //visionimage
							this.visionImage=environment.missionImage+"/"+this.missionVisionData[0].id+"/"+this.missionVisionData[0].display_picture;
						}
						if(this.missionVisionData[1].display_picture != ""){ //visionimage
							this.missionImage=environment.missionImage+"/"+this.missionVisionData[1].id+"/"+this.missionVisionData[1].display_picture;
								
						}
            this.missionVisionFound = false; //data found
          } else {
            this.missionVisionData = [];
            this.missionVisionFound = false;
          }
        }
      },
      error => {
        this.missionVisionFound = false;
        this.missionVisionLoader = false;
        this.missionVisionData = [];
        throw error;
      }
    );
  }
}
