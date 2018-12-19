import { HelpersService } from './../services/helpers/helpers.service';

import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../services/authService/auth.service";
import { SignupService } from "../services/signup/signup.service"; //for later purpose
import { ToastrService } from "ngx-toastr";
import { CustomValidationsService } from './../services/custom-validations/custom-validations.service';

import { Router } from "@angular/router";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  signupFrm: FormGroup;

  questionsList1 = [];
  questionsList2 = [];

  loder: boolean = false;
  questionsList1Loader = false;
  questionsList2Loader = false;

  verifiedAccountNumber={};
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private SignupService: SignupService,
    private router: Router,
    private toastr: ToastrService,
    private CustomValidations: CustomValidationsService,
    private helpers :HelpersService
  ) {
    this.initRegistrationFrm();
  }
  
  //Initialize registration form
  initRegistrationFrm() {
    this.signupFrm = this.fb.group(
      {
        username: ["", Validators.required],
        email: ["", [Validators.required, this.CustomValidations.isEmailValid("email")]],
        mobile: ["", Validators.required],
        password: ["", Validators.compose([Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)])],
        cpassword: ["", Validators.required],
        questionsList1: ["", Validators.required],
        questionsList2: ["", Validators.required],
        ansques1: ["", Validators.required],
        ansques2: ["", Validators.required]
      },
      { validator: this.CustomValidations.checkPasswords }
    );
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signupFrm.controls;
  }

  ngOnInit() {
    this.verifiedAccountNumber=this.helpers.getLocalStoragData("verifiedAccountNumber");
    this.auth.ClearIsVerifiedAccountNumber();
    this.fechQuestionList("1");
    this.fechQuestionList("2");
  }

  fechQuestionList(quesType) {
    if (quesType == "1") {
      this.questionsList1Loader = true;
    } else {
      this.questionsList2Loader = true;
    }

    this.SignupService.getQuestionList("users/questionList", {
      types: quesType
    }).subscribe((response: any) => {
      if (quesType == "1") {
        this.questionsList1Loader = false;
      } else {
        this.questionsList2Loader = false;
      }
      var res = response;
      if (res.authCode == "200") {
        if (quesType == "1") {
          this.questionsList1 = res.data_params;
        } else {
          this.questionsList2 = res.data_params;
        }
      } else {
        this.toastr.error(res.msg, "Faild!");
      }
    });
  }
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

  signUp() {
    // register user
    this.loder = true;
    const apiData = this.signupFrm.value;
    console.log(this.verifiedAccountNumber);
    apiData["accountNumber"]=this.verifiedAccountNumber;
    this.SignupService.registerUser("users/register", apiData).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(res.msg, "Success!");
            this.router.navigate(["/login"]);
          } else {
            this.toastr.error(res.msg, "Faild!");
          }
        }
      },
      (error: AppError) => {
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
