import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../services/profile/profile.service";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { AuthService } from "../services/authService/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {

  accountNumber:any="";
  loder: any = false;
  profileData: any = "";
  currentUserData = "";
  viewProfileBlock: boolean = true;
  updateProfileBlock: boolean = false;
  updateProfileFrm: FormGroup;
  profileUpdateLoder: boolean = false;
  profile_image: any = "";
  fileTarget: any;
  selectedFiles: File = null;
  ProfileImageLoader: boolean = false;
  invalidImageIssue:boolean=false;
  dispString:any="";
  constructor(
    private profile: ProfileService,
    private toastr: ToastrService,
    private auth: AuthService,
    private fb: FormBuilder,
    private CustomValidations: CustomValidationsService,
    private  helpers:HelpersService
  ) {}
 
  onFileChanged($event) {
    var reader = new FileReader();
    this.fileTarget = event.target;
    var imageFile = this.fileTarget.files[0];
    var ext= imageFile.name.substring(imageFile.name.lastIndexOf(".") + 1)
    .toLowerCase();
    if (ext == "png" || ext == "jpeg" || ext == "jpg") {
      if(imageFile.size <= 2000000 ){
        this.invalidImageIssue=false;
        this.selectedFiles = <File>imageFile;
        reader.readAsDataURL(this.fileTarget.files[0]);
        reader.onload = event => {
        this.profile_image = reader.result;
        };
      }else{
        this.invalidImageIssue=true;
        this.toastr.error("Image file size must not exceed 2 mb", "Failed!");
      }
      
    }else{
      this.invalidImageIssue=true;
      this.toastr.error("Please upload image with valid file extension ex: png,jpeg and jpg", "Failed!");
    }
  }
  
  /* viewFlag=true; */
  showProfileUpdateFrm(flag) {
    this.viewProfileBlock = !this.viewProfileBlock;
    if (!this.viewProfileBlock) {
      this.initRegistrationFrm(this.profileData);
    }
    /*  if (flag == "show") {
      this.viewProfileBlock = true;
      this.updateProfileBlock = false;
    } else {
      this.viewProfileBlock = false;
      this.updateProfileBlock = true;
    } */
  }
  ngOnInit() {
    this.currentUserData = this.auth.getCurrentUser();
    let accountToken=atob(this.helpers.getLocalStoragData("accountToken"));// fetch account number.
    let accountTokenInfo=accountToken.split(":");
    this.accountNumber=accountTokenInfo[1]//account Number
    this.getProfile();
    this.initRegistrationFrm(this.profileData);
    
  }
  
  getProfile() {
    this.loder = true;
    console.log(this.accountNumber);
    this.dispString="Account No. ( "+this.accountNumber+" )";
    this.profile.getProfile(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;

        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.profileData = res.data_params;
            this.profile_image = this.profileData.profile_image;
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
  get f() {
    return this.updateProfileFrm.controls;
  }
  initRegistrationFrm(data) {
    var name = data.account_name;
      var email = data.email;
      var mobile = data.mobile;
      var area = data.premise_address;
      this.updateProfileFrm = this.fb.group({
        name: [name, Validators.required],
        email: [
          email,
          [Validators.required, this.CustomValidations.isEmailValid("email")]
        ],
        mobile: [mobile, Validators.required],
        area: [area, Validators.required]
      });
  }
  UpdateProfileFunction() {
    this.profileUpdateLoder = true;
    var frmData = this.updateProfileFrm.value;
    var profile_image = "";
    if (this.selectedFiles != null) {
      profile_image = this.profile_image;
    }
    var profileSveDAta = {
      profileToken: "",
      first_name: frmData.first_name,
      last_name: this.profileData.last_name,
      email: frmData.email,
      mobile: frmData.mobile,
      area: frmData.area,
      imgBlob: profile_image
    };
    this.profile.saveProfile(profileSveDAta).subscribe(
      (res: any) => {
        this.profileUpdateLoder = false;
        console.log(this.profile_image);
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(res.msg, "Details updated successfully!");
            this.showProfileUpdateFrm(false);
            this.getProfile();
          } else {
            this.toastr.error(res.msg, "Faild!");
          }
        }
      },
      (error: AppError) => {
        this.profileUpdateLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
