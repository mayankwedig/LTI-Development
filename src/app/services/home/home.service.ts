import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";
import { HelpersService } from "./../helpers/helpers.service";
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private data:DataService,private helper: HelpersService) { }
  masterDropDownAPI = "users/masterDropDown";
  
  getMasterData(header) {
   /*console.log(header);*/
    return this.data.getAll(
      this.masterDropDownAPI,
      header,
      '',
      "POST"
    );
  }
}
