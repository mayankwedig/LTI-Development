import { HelpersService } from './../services/helpers/helpers.service';
import { Component} from '@angular/core';
import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app-error';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import  {Router, ActivatedRoute} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {LoginService} from '../services/login/login.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
   sliderContent=[{
      "image":"../assets/images/main-slide1.jpg",
      "desc":"Changing The Power<br> That Changes<br> The World"
  },{
    "image":"../assets/images/main-slide2.jpg",
    "desc":"Changing The Power<br> That Changes<br> The World"
},{
  "image":"../assets/images/main-slide3.jpg",
  "desc":"Changing The Power<br> That Changes<br> The World"
}];
showForgotPass(){
  $("#loginFr").fadeOut(350);
  $("#forgotPass").fadeIn(350);
}
showLogin(){
  $("#forgotPass").fadeOut(300);
  $("#loginFr").fadeIn(300);
}
  loder:boolean=false;
  loginFrm: FormGroup;
  forgotPassFrm: FormGroup;
  get f() { return this.loginFrm.controls; }
  get forgotPassFields() { return this.forgotPassFrm.controls; }
  
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private router:Router,
    private loginService:LoginService,private route:ActivatedRoute) { 
      this.initLoginFrm();
      this.initForgotFormFrm();
  }
  initLoginFrm(){
    this.loginFrm=this.fb.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  initForgotFormFrm(){
    this.forgotPassFrm=this.fb.group({
      email: ['', Validators.required]
    });
  }
  forgotPassFunction(){
    this.loder=true;
    const forgotPassData=this.forgotPassFrm.value;
    this.loginService.forgotPassService('users/forgotPassword',forgotPassData).subscribe((response:any)=>{
      this.loder=false;
      var res=response;
      if(res.authCode){
        if(res.authCode == "200" && res.status == true){
          this.loginService.setOtpVerificationSession(res.data_params.id);
          var OtpVerificationToken=this.loginService.getOtpVerificationSession();
         
          if(OtpVerificationToken != null){
          /*   console.log("Test"); */
            this.toastr.success(res.msg, 'Verification is successful!');
            this.router.navigate(['/otp-verification']);
          }
            
        }else{
          this.toastr.error(res.msg, 'Faild!');
        }
      }
    });
  }
  login(){// login funtion goes here
    const loginData=this.loginFrm.value;
    this.loder=true;
    this.loginService.loginUser('users/login',loginData)
    .subscribe((response:any)=>{
      var res=response;
      this.loder=false;
      if(res.authCode){
        if(res.authCode == "200" && res.status == true && res.token){
          
          this.loginService.setLoginData(res.token);

          this.toastr.success(res.msg, 'Success!');
          
            let returnUrl =this.route.snapshot.queryParamMap.get('returnUrl');
            var UserData=this.loginService.getUserData();
            this.router.navigate([returnUrl||'/manageaccount']);
            /* console.log(UserData); */
            /* if(UserData.numberOfAccounts == 1){ 
              this.router.navigate([returnUrl||'/dashboard']);
            }else{
              this.router.navigate([returnUrl||'/manageaccount']); 
            } */
        }else{
          this.toastr.error(res.msg, 'Faild!');
        }
      }
    },(error: AppError)=>{
      this.loder=false;
      if(error instanceof BadInput){
      }else{
        throw error;
      }
    });
  }
}
