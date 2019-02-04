import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../services/profile/profile.service";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { AuthService } from "../services/authService/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";
import {environment} from "./../../environments/environment";
import { TranslationService } from "../services/translation/translation.service";


declare var $: any;
declare var _googCsa:any;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  accountNumber: any = "";
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
  invalidImageIssue: boolean = false;
  dispString: any = "";
  oldMobileNo: any = "";
  oldEmailid:any="";

  advertiseDataLoader:boolean =false;
  isAdvertiseDataFound: boolean = false;
  advertisementproData:any=[];
  adimagurl=environment.adimageUrl;


  public OtpVerificationFrm: FormGroup;
  public passwordVerificationFrm:FormGroup;
  get OtpVerificationFields() {
    return this.OtpVerificationFrm.controls;
  }
  initOtpVerificationForm() {
    this.OtpVerificationFrm = this.fb.group({
      verifyOtp: ["", Validators.required]
    });
  }
  initPwVerificationForm() {
    this.passwordVerificationFrm = this.fb.group({
      password: ["", Validators.required]
    });
  }
  constructor(
    private profile: ProfileService,
    private toastr: ToastrService,
    private auth: AuthService,
    private DashboardService: DashboardService,
    private fb: FormBuilder,
    private CustomValidations: CustomValidationsService,
    private helpers: HelpersService,
    private translationServices: TranslationService

  ) {}

  onFileChanged($event) {
    var reader = new FileReader();
    this.fileTarget = event.target;
    var imageFile = this.fileTarget.files[0];
    var ext = imageFile.name
      .substring(imageFile.name.lastIndexOf(".") + 1)
      .toLowerCase();
    if (ext == "png" || ext == "jpeg" || ext == "jpg") {
      if (imageFile.size <= 2000000) {
        this.invalidImageIssue = false;
        this.selectedFiles = <File>imageFile;
        reader.readAsDataURL(this.fileTarget.files[0]);
        reader.onload = event => {
          this.profile_image = reader.result;
        };
      } else {
        this.invalidImageIssue = true;
        this.toastr.error(this.translationServices.translate("Image file size must not exceed 2 mb"), this.translationServices.translate("Failed!"));
      }
    } else {
      this.invalidImageIssue = true;
      this.toastr.error(this.translationServices.translate
        ("Please upload image with valid file extension ex: png,jpeg and jpg"),
        this.translationServices.translate("Failed!"));

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
  getProfile() {
    this.loder = true;
    console.log(this.accountNumber);
    this.dispString = "Account No. ( " + this.accountNumber + " )";
    this.profile.getProfile(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;

        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.profileData = res.data_params;
            this.oldMobileNo = this.profileData.mobile;
            this.oldEmailid=this.profileData.email;
            this.profile_image = this.profileData.profile_image;
          } else {
            this.toastr.error(this.translationServices.translate(res.msg), "Failed!");
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
  ngOnInit() {
    this.currentUserData = this.auth.getCurrentUser();
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.getProfile();
    this.initRegistrationFrm(this.profileData);
    this.initOtpVerificationForm();
    this.getadvertisementprofileData();
    this.initPwVerificationForm();
    var pageOptions = {
      "pubId": "pub-9616389000213823", // Make sure this the correct client ID!
      "query": "hotels",
      "adPage": 1
    };
  
    var adblock1 = {
      "container": "afscontainer1",
      "width": "100%",
      "number": 2
    };
  
    _googCsa('ads', pageOptions, adblock1);
    if(localStorage.getItem("isOtpVerified") != null){
        localStorage.removeItem("isOtpVerified");
    }

  }

  get f() {
    return this.updateProfileFrm.controls;
  }
  get otpf() {
    return this.passwordVerificationFrm.controls;
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
  saveFomrData(){
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
     // If same then no need to verify mobile no.
     this.profile.saveProfile(profileSveDAta).subscribe(
      (res: any) => {
        this.profileUpdateLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(this.translationServices.translate(res.msg), this.translationServices.translate("Details updated successfully!"));
            this.showProfileUpdateFrm(false);
            this.getProfile();
          } else {
            this.toastr.error(this.translationServices.translate(res.msg));
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
  newChangesType={mobileNo:false,email:false};
  UpdateProfileFunction() {
    this.newChangesType={mobileNo:false,email:false};
    this.profileUpdateLoder = true;
    var frmData = this.updateProfileFrm.value;
    var oldMobileNo = this.oldMobileNo;
    var newMobileNo = frmData.mobile;
    var newEmailId = frmData.email;
    // console.log("Old Mobile Number"+this.oldMobileNo,"Update Mobile Number"+frmData.mobile);
    var verifyMobileNo = false;
    if (oldMobileNo != newMobileNo ||  this.oldEmailid != newEmailId) {
      // If Old and update mobile no is not same then verify New mobile no.
        if(oldMobileNo != newMobileNo){ // mobileNo
          this.newChangesType.mobileNo=true
        }
        if(this.oldEmailid != newEmailId){ // emailId
          this.newChangesType.email=true
        }
      verifyMobileNo = true;
    }
    if (!verifyMobileNo) {
      // If same then no need to verify mobile no.
      var profileSveDAta;
      this.profile.saveProfile(profileSveDAta).subscribe(
        (res: any) => {
          this.profileUpdateLoder = false;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              this.toastr.success(this.translationServices.translate(res.msg), "Details updated successfully!");
              this.showProfileUpdateFrm(false);
              this.getProfile();
            } else {
              this.toastr.error(this.translationServices.translate(res.msg), "Failed!");
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
      this.saveFomrData();
    } else {
     
      // If not same then verify otp then update futher user info.
      var header = {
        accountNumber: this.accountNumber,
        mobileNumber: frmData.mobile
      };
     
      this.profile.verifyMobileNumber(header).subscribe(
        (result: any) => {
          this.profileUpdateLoder = false;
          if (result.authCode == 200 && result.status == true) {
            //OTP msg sent Successfully

            this.toastr.success(this.translationServices.translate(result.msg),this.translationServices.translate("Success"));
            this.showModalPopup("topVerification-modal");
            this.initOtpVerificationForm();
          }else{
            this.toastr.error(this.translationServices.translate(result.msg));
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
  showModalPopup(toOpen){
      $("."+toOpen).modal("show");
      $("."+toOpen).addClass("in");
      $("."+toOpen).css("display", "block");
  }
  closePopup(toClose){
    $("#"+toClose).hide();
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
  }
  
  Otoploder:boolean=false;
  formData:any="";
  pwVerifLoader:boolean=false;
  verifyOtpFun(){
    localStorage.removeItem("isOtpVerified");
    this.Otoploder=true;
    this.formData=this.OtpVerificationFrm.value
    const verifyOtpData = this.formData.verifyOtp
    
    var header ={"otpAccountNumber":this.accountNumber,"verifyOtp":verifyOtpData};
    
    this.profile.verifyOtp(header).subscribe(
      (response: any) => {
        this.Otoploder=false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {// if account verfied then open password Screen
            
            this.initOtpVerificationForm();
            this.closePopup("topVerification-frm");
            this.toastr.success(this.translationServices.translate(response.msg));
            
            if(this.newChangesType.mobileNo == true){
              
              this.showModalPopup("passwordVeri-modal");
              this.initPwVerificationForm();
              localStorage.setItem("isOtpVerified","true");

            }else{
              
              this.saveFomrData();
            }
          
          }else{
            this.initOtpVerificationForm();
            this.closePopup("topVerification-frm");
            this.toastr.error(this.translationServices.translate(response.msg));
          }
        }
      },(error: AppError) => {
        this.initOtpVerificationForm();
        this.closePopup("topVerification-frm");
        this.Otoploder = false;
        /* this.initAddaccFrm(); */
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }
  VerifyPasswordLoder:boolean=false

  verifyPassword(){
    var password=this.passwordVerificationFrm.value.password

    var header ={"password":password};

    this.VerifyPasswordLoder=true;
    
    this.profile.verifyPassword(header).subscribe(
      (response: any) => {
        this.VerifyPasswordLoder=false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {// if account verfied then open password Screen
            this.initPwVerificationForm();
            this.closePopup("passwordVerification-frm");
            this.toastr.success(this.translationServices.translate(response.msg));
            this.saveFomrData();
          }else{
            this.initPwVerificationForm();
            this.closePopup("passwordVerification-frm");
            this.toastr.error(this.translationServices.translate(response.msg));
          }
        }
      },(error: AppError) => {
        this.initPwVerificationForm();
        this.closePopup("passwordVerification-frm");
        this.toastr.error(this.translationServices.translate("Somthing went wrong"));
        this.VerifyPasswordLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }
 




  getadvertisementprofileData() {
    this.advertiseDataLoader = true;
    this.DashboardService.getAdvertisementproData().subscribe(
      (response: any) => {
        var res = response;
        this.advertiseDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.advertisementproData = res.data_params;
           /*  console.log(this.advertisementproData[0].type);
            console.log(this.advertisementproData); */
            this.isAdvertiseDataFound = true;
          } else {
            this.isAdvertiseDataFound = false;
            this.advertisementproData = [];
          }
        }
      },
      (error: AppError) => {
        this.isAdvertiseDataFound = false;
        this.advertiseDataLoader = false;
        this.advertisementproData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }



}
