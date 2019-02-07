import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { ResetPasswordService } from "../services/reset-password/reset-password.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  accountNumber: any = "";
  dispString = "";
  
  ChangePasswordFrm: FormGroup;
  changePassFuncLoader: boolean = false;

  constructor(
    private helpers: HelpersService,
    private toastr: ToastrService,
    private changePassword: ResetPasswordService,
    private CustomValidation: CustomValidationsService,
    private fb: FormBuilder
  ) {}

  get changePassFields() {
    return this.ChangePasswordFrm.controls;
  }
  
  initChangePasswordFrm() {
    this.ChangePasswordFrm = this.fb.group(
      {
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)
          ])
        ],
        cpassword: ["", Validators.required],
        oldPassword: ["", Validators.required]
      },
      { validator: this.CustomValidation.checkPasswords }
    );
  }
  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";
    this.initChangePasswordFrm();
  }
  
  changePassFunc() {
    this.changePassFuncLoader = true;
    const changePassData = this.ChangePasswordFrm.value;

    this.changePassword
      .resetPassword(changePassData)
      .subscribe((response: any) => {
        this.changePassFuncLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(res.msg, "Password updated!");
          } else {
            this.toastr.error(res.msg, "Failed!");
          }
        }
      });
  }
}
