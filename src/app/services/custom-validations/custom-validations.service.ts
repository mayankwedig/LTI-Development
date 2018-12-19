import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Injectable({
  providedIn: 'root'
})
export class CustomValidationsService {

  constructor() { }
   
  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.cpassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }
  
  isEmailValid(control) {
    // Email Validation
    return control => {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(control.value) ? null : { invalidEmail: true };
    };
  }
}
