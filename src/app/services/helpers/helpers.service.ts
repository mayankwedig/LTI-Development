import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

@Injectable()
export class HelpersService {
  constructor() {}
// Marking form fileds as touched.
  markAsTouched(fg: FormGroup) {
    var resultArray = Object.keys(fg.controls).map(function(keys) {
      let person = keys;
      return person;
    });
    if (resultArray.length > 0) {
      resultArray.forEach(element => {
        fg.controls[element].markAsTouched();
      });
    }
    return fg;
  }
  // Some helper Functions
  setHeaderData(contentType = "application/json") {
    let headerData = new HttpHeaders();
    headerData = headerData.append("Content-Type", contentType);
    headerData = headerData.append("Access-Control-Allow-Origin", "token");
    headerData = headerData.append("token", this.getLocalStoragData("token"));
    return headerData;
  }
  getArray(length, callBack) {
    let value = [];
    for (let i = 0; i < length; i++) {
      value.push((i + 1).toString());
    }
    callBack(value);
  }

  daysInMonth(month, year) {
    let response = {};
    return new Promise((resolve, reject) => {
      var days = new Date(year, month, 0).getDate();
      this.getArray(days, (result: any) => {
        resolve(result);
      });
    });
  }
  getMonth(month) {
    let mon;
    return new Promise((resolve, reject) => {
      if (month == "JAN") mon = "01";
      if (month == "FEB") mon = "02";
      if (month == "MAR") mon = "03";
      if (month == "APR") mon = "04";
      if (month == "MAY") mon = "05";
      if (month == "JUN") mon = "06";
      if (month == "JUL") mon = "07";
      if (month == "AUG") mon = "08";
      if (month == "SEP") mon = "09";
      if (month == "OCT") mon = "10";
      if (month == "NOV") mon = "11";
      if (month == "DEC") mon = "12";

      resolve(mon);
    });
  }
  getLocalStoragData(value: string) {
    var val = value || "";
    return val != "" ? localStorage.getItem(val) : val;
  }
  setLocalStoragData(name: string, value: string) {
    localStorage.setItem(name, value);
    /*   var val=value||"";
    return val != "" ? localStorage.getItem(val):val; */
  }
  clearLocalStorateData(sessionName: string) {
    localStorage.removeItem(sessionName);
  }
}
