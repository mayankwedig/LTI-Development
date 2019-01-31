import { DataService } from './../data.service';
import { Injectable } from "@angular/core";

@Injectable()
export class TranslationSet {
  public languange: string;
  public values: { [key: string]: string } = {};
} 

export class TranslationService {
  public languages = ["hi", "eng"];
  
  public language = localStorage.getItem("selected_lag");
  /* constructor(private DataService:DataService) {
    this.DataService.getAll("users/langJSON","","","GET").subscribe((result:any)=>{
      console.log(result);
    },(error)=>{

    });
  } */
  /* constructor(private DataService:DataService) {} */
  private dictionary: { [key: string]: TranslationSet } = {
    hi: {
      languange: "hi",
      values: {
        Home: "होम",
        aboutus:"हमारे बारे में",
        contactus:"हमसे संपर्क करें",
        latestupdates:"नवीनतम अपडेट",
        chiefministermessage :"मुख्य मंत्री संदेश",
        dashboard:"डैशबोर्ड",
        notifications:"सूचनाएं",
        viewall : "सभी को देखें",
        hidemenu:"मेनू छुपाएं",
        tollfreenumbers:"टोल फ्री नंबर",
        new:"नया",
        profile:"प्रोफाइल",
        account:"खाता",
        logout:"लोग आउट",
        login:"लॉग इन करें",
        signup:"साइन अप",
        ourmission:"हमारा लक्ष्य",
        knowmore:"और जानिए",
        ourvision:"हमारी दृष्टि",
        energytips:"ऊर्जा बचत सुझाव",
        importantlinks:"महत्वपूर्ण लिंक",
        payonline: "ऑनलाइन भुगतान करें",
        complaints:"शिकायतें",
        register:"पंजीकरण",
        track:"ट्रेक करें",
        servicerequests:"सेवा अनुरोध",
        connection:"कनेक्शन",
        navigation:"नेविगेशन",
        links:"लिंक",
        sitemap:"साइटमैप",
        consumption:"उपभोग",
        settings:"सेटिंग्स",
        usage:"प्रयोग",
        news:"समाचार",
        media:"मीडिया",
        contact:"संपर्क",
        helpandsupport:"सहायता",
        and:"एवं",
        support:"",
        faqs:"पूछे जाने वाले प्रश्न",
        needhelp:"मदद चाहिए",
        uppcl:"उत्तर प्रदेश पावर कारपोरेशन लिमिटेड",
        visionandmission:"दूरदर्शिता और मिशन",
        boardofdirectors: "निदेशक मंडल",
        organisationstructure:"संगठन की संरचना",
        vision:"दृष्टि",
        mission:"मिशन",
        name:"नाम",
        contactno:"संपर्क नंबर",
        disclaimer:"अस्वीकरण",
        datanotfound:"वर्तमान में, इस अनुभाग में कोई डेटा नहीं मिला है!",
        downloads:"डाउनलोड",
        frequentlyaskedquestion:"अक्सर पूछे जाने वाले प्रश्न",
        documenttype:"दस्तावेज़ का प्रकार",
        userIdReq:"उपयोगकर्ता आईडी आवश्यक है",
        userId:"उपयोगकर्ता आईडी",
        password:"पासवर्ड",
        passwordReq:"पासवर्ड आवश्यक है",
        forgotpassword:"पासवर्ड भूल गए?",
        donthaveaccount:"खाता नहीं है?",
        doregisteration:"पंजीकरण करें",
        required:"आवश्यक है",
        email:"ईमेल",
        mobilenumber:"मोबाइल नंबर",
        or:"अथवा",
        selectsecurityquestions:"सुरक्षा प्रश्नों का चयन करें",
        securityquestion:"सुरक्षा प्रश्न",
        answer:"उत्तर",
        submit:"जमा करें",
        backtologin:"लॉगिन पर वापस जाएं",
        otpverificationmsg:"एक बार इस्तेमाल किये जाने वाला पासवर्ड आपके पंजीकृत मोबाइल नंबर और ईमेल पर भेजा गया है। कृपया सत्यापित करने के लिए इसे नीचे दर्ज करें।",
        otp:"एक बार इस्तेमाल किये जाने वाला पासवर्ड",
        alreadyhaveaccount:"पहले से ही एक खाता है?",
        resetpassword:"पासवर्ड रीसेट",
        note:"ध्यान दें",
        passwordpolicy:"हमारी मजबूत पासवर्ड नीति के अनुरूप, आपको एक पर्याप्त रूप से मजबूत पासवर्ड का उपयोग करना आवश्यक है। पासवर्ड में 8 से अधिक वर्ण, 1 ऊपरी केस अक्षर और 1 विशेष वर्ण होना चाहिए।",
        invalid:"अमान्य",
        confirmpassword:"पासवर्ड की पुष्टि कीजिये",
        passwordconfirmpasswordnotmatch:"पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं",
        pleaseenteryouraccountno:"कृपया अपना खाता संख्या अथवा बिल संख्या दर्ज करें",
        accountnumber:"खाता संख्या",
        billnumber:"बिल संख्या",
        next:"आगे",
      }
    },
    eng: {
      languange: "eng",
      values: {
        Home: "Home",
        aboutus:"About Us",
        contactus:"Contact Us",
        latestupdates:"Latest Updates",
        chiefministermessage: "Chief Minister message",
        dashboard:"Dashboard",
        notifications:"Notifications",
        viewall : "View all",
        hidemenu:"HIDE MENU",
        tollfreenumbers:"Toll Free Numbers",
        new:"New",
        profile:"Profile",
        account:"Account",
        logout:"Log Out",
        login:"Login",
        signup:"Signup",
        ourmission:"Our Mission",
        knowmore:"Know More",
        ourvision:"Our Vision",
        energytips:"Energy Tips",
        importantlinks:"IMPORTANT LINKS",
        payonline: "Pay Online",
        complaints:"Complaints",
        register:"Register",
        track:"Track",
        servicerequests:"Service Requests",
        connection:"Connection",
        navigation:"Navigation",
        links:"Lniks",
        sitemap:"Site Map",
        consumption:"Consumption",
        settings:"Settings",
        usage:"Usage",
        news:"News",
        media:"Media",
        contact:"Contact",
        helpandsupport:"Help & Support",
        and:"&",
        support:"Support",
        faqs:"FAQs",
        needhelp:"Need Help",
        uppcl:"UPPCL",
        visionandmission:"Vision & Mission",
        boardofdirectors:"Board Of Directors",
        organisationstructure:"Organisation Structure",
        vision:"Vision",
        mission:"Mission",
        name:"Name",
        contactno:"Contact No.",
        disclaimer:"Disclaimer",
        datanotfound:"Currently, no data found in this section",
        downloads:"Downloads",
        frequentlyaskedquestion:"Frequently asked questions",
        documenttype :"document type",
        userIdReq:"User Id is required",
        userId:"User ID",
        password:"Password",
        passwordReq:"Password is required",
        forgotpassword:"Forgot Password",
        donthaveaccount:"Don't have account?",
        doregisteration:"Sign-Up",
        required:"is required",
        email:"E-mail",
        mobilenumber:"Mobile Number",
        or:"OR",
        selectsecurityquestions:"Select security questions",
        securityquestion:"Security question",
        answer:"Answer",
        submit:"Submit",
        backtologin:"Back to login",
        otpverificationmsg:"OTP has been sent to your registered mobile number and email. please enter it below to verify.",
        otp:"OTP",
        alreadyhaveaccount:"Already have an account?",
        resetpassword:"Reset password",
        note:"Note",
        passwordpolicy:"Conform with our Strong Password policy, you are required to use a sufficiently strong password. Password must contain more than 8 characters, 1 upper case letter, and 1 special character.",
        invalid:"Invalid",
        confirmpassword:"Confirm password",
        passwordconfirmpasswordnotmatch:"Password and confirm password do not match.",
        pleaseenteryouraccountno:"Please enter your Account Number.",
        accountnumber:"Account Number",
        billnumber:"Bill Number",
        next:"Next"
      }
    }
  };

  

  translate(key: string): string {
    if (this.dictionary[this.language] != null) {
      if (this.dictionary[this.language].values[key] !== undefined) {
        return this.dictionary[this.language].values[key];
      } else {
        return key;
      }
    } else {
      return key;
    }
  }
}
