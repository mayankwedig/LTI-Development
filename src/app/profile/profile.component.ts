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

  advertiseDataLoader:boolean =false;
  isAdvertiseDataFound: boolean = false;
  advertisementproData:any=[];
  adimagurl=environment.adimageUrl;


  public OtpVerificationFrm: FormGroup;
  get OtpVerificationFields() {
    return this.OtpVerificationFrm.controls;
  }
  initOtpVerificationForm() {
    this.OtpVerificationFrm = this.fb.group({
      verifyOtp: ["", Validators.required]
    });
  }
  constructor(
    private profile: ProfileService,
    private toastr: ToastrService,
    private auth: AuthService,
    private DashboardService: DashboardService,
    private fb: FormBuilder,
    private CustomValidations: CustomValidationsService,
    private helpers: HelpersService
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
        this.toastr.error("Image file size must not exceed 2 mb", "Failed!");
      }
    } else {
      this.invalidImageIssue = true;
      this.toastr.error(
        "Please upload image with valid file extension ex: png,jpeg and jpg",
        "Failed!"
      );
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
            this.profile_image = this.profileData.profile_image;
          } else {
            this.toastr.error(res.msg, "Failed!");
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
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.getProfile();
    this.initRegistrationFrm(this.profileData);
    this.initOtpVerificationForm();
    this.getadvertisementprofileData();


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
    var oldMobileNo = this.oldMobileNo;
    var newMobileNo = frmData.mobile;
    // console.log("Old Mobile Number"+this.oldMobileNo,"Update Mobile Number"+frmData.mobile);
    var verifyMobileNo = false;
    if (oldMobileNo != newMobileNo) {
      // If Old and update mobile no is not same then verify New mobile no.
      verifyMobileNo = true;
    }
    if (!verifyMobileNo) {
      // If same then no need to verify mobile no.
      this.profile.saveProfile(profileSveDAta).subscribe(
        (res: any) => {
          this.profileUpdateLoder = false;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              this.toastr.success(res.msg, "Details updated successfully!");
              this.showProfileUpdateFrm(false);
              this.getProfile();
            } else {
              this.toastr.error(res.msg, "Failed!");
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
            this.toastr.success(result.msg, "Success!");
            this.showModalPopup();
            this.initOtpVerificationForm();
          }else{
            this.toastr.error(result.msg, "failed!");
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
  showModalPopup(){
    $(".topVerification-modal").modal("show");
    $(".topVerification-modal").addClass("in");
    $(".topVerification-modal").css("display", "block");
  }
  Otoploder:boolean=false;
  verifyOtp(){
    
  }
  /* verifyOtp() {
    const verifyOtpData = this.OtpVerificationFrm.value;
    var verifiedAccountNumber = this.helper.getLocalStoragData(
      "verifiedAccountNumber"
    );
    this.helper.clearLocalStorateData("verifiedAccountNumber"); //Clear account number session

    this.Otoploder = true;

    if (verifiedAccountNumber != null) {
      verifyOtpData["otpAccountNumber"] = verifiedAccountNumber;
      this.OtpVeriyService.verifyOtp(
        "users/otpVerifyRegistration",
        verifyOtpData
      ).subscribe(
        (response: any) => {
          var res = response;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              var accountData = { account_number: verifiedAccountNumber };
              this.accountServices.addAccount(accountData).subscribe(
                (response: any) => {
                  var res = response;
                  this.Otoploder = false;
                  if (res.authCode) {
                    if (res.authCode == "200" && res.status == true) {
                      this.toastr.success(res.msg, "Success!");
                      $("#add-account-modal").hide();
                      $(".modal-backdrop").remove();
                      $("body").removeClass("modal-open");
                      this.getAccount(this.searchKeyWord);
                      this.initAddaccFrm();
                    } else {
                      this.initAddaccFrm();
                      this.toastr.error(res.msg, "Faild!");
                    }
                  }
                },
                (error: AppError) => {
                  this.Otoploder = false;
                  this.initAddaccFrm();
                  if (error instanceof BadInput) {
                  } else {
                    throw error;
                  }
                }
              );
            } else {
              this.Otoploder = false;
              this.initAddaccFrm();
              this.toastr.error(res.msg, "Failed!");
            }
          }
        },
        (error: AppError) => {
          this.Otoploder = false;
          this.initAddaccFrm();
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
    } else {
      this.Otoploder = false;
      this.initAddaccFrm();
    }
  } */




  getadvertisementprofileData() {
    this.advertiseDataLoader = true;
    this.DashboardService.getAdvertisementproData().subscribe(
      (response: any) => {
        var res = response;
        this.advertiseDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
           
            this.advertisementproData = res.data_params;
            console.log(this.advertisementproData[0].type);
            console.log(this.advertisementproData);
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
