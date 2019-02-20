import { AuthService } from "./../services/authService/auth.service";
import { TranslationService } from "src/app/services/translation/translation.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pay-bill",
  templateUrl: "./pay-bill.component.html",
  styleUrls: ["./pay-bill.component.css"]
})
export class PayBillComponent implements OnInit {
  displayUserInfo = "";
  accountNumber = "";
  dispString = "";
  
  constructor(
    private AuthService: AuthService,
    private helpers: HelpersService,
    private translateService: TranslationService
  ) {
    console.log("test");
  }
  translate(string: string): string {
    return this.translateService.translate(string);
  }
  ngOnInit() {
    if (this.isLoggedIn()) {
      // if user is logged in
      if (this.helpers.getLocalStoragData("accountToken") != null) {
        let accountToken = atob(
          this.helpers.getLocalStoragData("accountToken")
        ); // fetch account number.
        let accountTokenInfo = accountToken.split(":");
        this.accountNumber = accountTokenInfo[1]; //account Number
        this.dispString =
          this.translate("accountnumber") + " ( " + this.accountNumber + " ) ";
      } else {
        this.AuthService.getCurrentUser();
        this.dispString =
          "User Name ( " + this.AuthService.getCurrentUser().username + " ) ";
      }
    } else {
        console.log("Test");
    }
  }
  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }
}
