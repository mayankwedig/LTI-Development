import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TranslationSet {
  public languange: string;
  public values: { [key: string]: string } = {};
}

export class TranslationService {
  public languages = ["hi", "eng"];
  
  public language = localStorage.getItem("selected_lag");
  
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
        signup:"साइन अप करें"
        
        
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
        signup:"Signup"
      }
    }
  };

  constructor() {}

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
