import { DataService } from "../data.service";
import { Injectable } from "@angular/core";
import { HelpersService} from "../helpers/helpers.service";
import { AuthService } from '../authService/auth.service';

@Injectable()
export class NetMeteringService {
  
 
  SOAnetmeterfromurlsAPI="users/SOAnetmeterfromurls";
  constructor(private DataService: DataService,private helpers:HelpersService,private auth:AuthService) {}
  
  getNetMeteringGraphData(body, callback) { //dail graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.SOAnetmeterfromurlsAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }

  
}
