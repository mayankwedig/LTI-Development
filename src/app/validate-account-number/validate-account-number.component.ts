import { ValidateAccountNumberService } from './../services/validate-account-number/validate-account-number.service';
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./validate-account-number.component.html",
  styleUrls: ["./validateAccountNumber.component.css"]
})
export class ValidateAccountNumber {
  
  sliderContent = [
    {
      image: "../assets/images/main-slide1.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide2.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide3.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    }
  ];
  
  accountVerificationFrm: FormGroup;
  loder: boolean = false;
  isAccountNumberValid: string = "false";

  // convenience getter for easy access to form fields
  get f() {
    return this.accountVerificationFrm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ValidateAccountNumber:ValidateAccountNumberService
  ) {
    this.accountVerificationFrm = fb.group({
      account_number: ["", Validators.required]
    });
  }
  
  validateAccountNumber() {
    this.loder = true;
    this.ValidateAccountNumber.verifyAccountNumber(this.accountVerificationFrm.value.account_number)
    .subscribe((res:any)=>{
      this.loder = false;
      if(res.authCode){
        if(res.authCode == "200" && res.status){
          this.isAccountNumberValid="true";
          localStorage.setItem("isAccountNumberValid", this.isAccountNumberValid);
          localStorage.setItem("verifiedAccountNumber", this.accountVerificationFrm.value.account_number);
          this.toastr.success(res.msg, 'Success!');
          this.router.navigate(["/registration"]);
        
        }else{
          this.toastr.error(res.msg, 'Failed!');
        }
      }
    },(error)=>{
      this.loder=false;
      this.toastr.error(error, 'Failed!');
    });
    
  }
}
