import { HelpersService } from "./../services/helpers/helpers.service";
import { AuthService } from "./../services/authService/auth.service";
import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "../services/window-ref/window-ref.service";

import * as $ from "jquery";
@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit {
  @Input("displayUserInfo") displayUserInfo: any;
  currentUrl: any = "";
  account_no;
  userName;
  dashboardDataApiUrl = "users/getUserData";
  is_net_metering: boolean = false; // by Default Net metering will be 0
  userData = "";
  constructor(
    private helpers: HelpersService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private winRef: WindowRefService,
    private auth: AuthService
  ) {}
  removeCss($event) {
    $("li").removeClass("openDropdown");
    var target: any = event.target || event.srcElement || event.currentTarget;
    var value: any = target.id;
    $("#li" + value).addClass("openDropdown");
  }

  ngOnInit() {
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token
      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
        // if token of current user
        if (parseInt(accountTokenInfo[2]) == 0) {
          this.is_net_metering = false;
        } else {
          this.is_net_metering = true;
        }
      }
    }
    var init = [];
    this.winRef.nativeWindow.PixelAdmin.start(init);
    this.currentUrl = this.router.url;
    this.userData = this.auth.getCurrentUser();
  }
}
