import { Component, OnInit} from '@angular/core';
import {WindowRefService} from './services/window-ref/window-ref.service';
import { fadeAnimation } from './animations';
import * as $  from "jquery";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeAnimation
    // animation triggers go here
  ]
})
export class AppComponent implements OnInit {
  prepareRoute(outlet: any) {
    return outlet.isActivated ? outlet.activatedRoute : '';
    /* return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']; */
  }
  title = 'lti';
  constructor(private winRef: WindowRefService){
    
    
  }
  public ngOnInit(){
    var init = [];
    init.push(function () {
     
      });
     this.winRef.nativeWindow.PixelAdmin.start(init);
  }
}
