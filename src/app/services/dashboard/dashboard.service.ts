import { DataService } from "../data.service";
import { Injectable } from "@angular/core";
import { HelpersService} from "../helpers/helpers.service";
import { AuthService } from '../authService/auth.service';

@Injectable()
export class DashboardService {
  
  getYTDDataApi = "users/YTDGetData";
  ODRGetDataApi="users/ODRGetData";
  getAccountDetailsApi="users/accountDetails";
  dailyGetDataAPI="users/dailyGetData";
  hourlyGetDataAPI="users/hourlyGetData";
  weeklyGetDataAPI="users/weeklyGetData";
  
  getallYearGetDataAPI="users/allYearGetData";
  

  monthlyGetDataAPI = "users/monthlyGetData";
  getCommanDasboardDataScalarApi = "users/commanDasboardDataScalar";
  energyTipsAPI="users/contentData";
  consumptionDataApi = "users/getConsumptionDataReading";
  dailyDataApi = "users/dailyData";
  SOAbilling="users/SOAbilling";
  billingGraphMonthlyAPI="users/billingGraphMonthly";
  
  billingGraphDailyAPI="users/billingGraphMonthly";
  
  excelYearlyDataAPI="users/excelYearlyData";
  excelBillingYearlyDataAPI="users/excelBillingYearlyData";

  complaintListAPI="users/complaintList";
  serviceRequestListAPI="users/serviceRequestList";

  ac_number=this.helpers.getLocalStoragData("account_number");//getting account number
  
  constructor(private DataService: DataService,private helpers:HelpersService,private auth:AuthService) {}
  getYtdData(accountNumber,callback) {
    var currentUser=this.auth.getCurrentUser();
   var body={"account_number": accountNumber,"userId":currentUser.userId};
    this.DataService.getAll(this.getYTDDataApi, body,this.helpers.setHeaderData()).subscribe(result => {
      callback(result);
    });
  }
  getOnDemandRead(accountNumber,callback){
    var currentUser=this.auth.getCurrentUser();
    var body={"account_number": accountNumber,"userId":currentUser.userId};
     this.DataService.getAll(this.ODRGetDataApi, body,this.helpers.setHeaderData()).subscribe(result => {
       callback(result);
     });
  }
  getAccountDetails(accountNumber,callback){
    var currentUser=this.auth.getCurrentUser();
    var body={"profileToken":btoa(currentUser.userId),"accountToken": btoa(accountNumber)}
     this.DataService.getAll(this.getAccountDetailsApi, body,this.helpers.setHeaderData()).subscribe(result => {
       callback(result);
     });
  }
  getEnergyTips(accountNumber,callback){
    var currentUser=this.auth.getCurrentUser();
    var accountData={"accountToken": btoa(accountNumber),"profileToken":btoa(currentUser.userId)};
     this.DataService.getAll(this.energyTipsAPI, accountData,this.helpers.setHeaderData()).subscribe(result => {
       callback(result);
     });
  }
  getcomplaints(accountNumber,callback){
    var currentUser=this.auth.getCurrentUser();
    var accountData={"accountToken": btoa(accountNumber),"profileToken":btoa(currentUser.userId)};
     this.DataService.getAll(this.complaintListAPI, accountData,this.helpers.setHeaderData()).subscribe(result => {
       callback(result);
     });
  }
  getServiceRequest(accountNumber,callback){
    var currentUser=this.auth.getCurrentUser();
    var accountData={"accountToken": btoa(accountNumber),"profileToken":btoa(currentUser.userId)};
     this.DataService.getAll(this.serviceRequestListAPI, accountData,this.helpers.setHeaderData()).subscribe(result => {
       callback(result);
     });
  }
  getBillingData(accountNumber){
    var currentUser=this.auth.getCurrentUser();
    var body={"accountNumber":accountNumber,"userId":currentUser.userId}
    return this.DataService.getAll(this.SOAbilling, body,this.helpers.setHeaderData());
  }

  getMonthlyGraphData(body, callback) { //monthly graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.monthlyGetDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getMonthlyGraphDataBilling(body, callback) { //monthly graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.billingGraphMonthlyAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getDailyBillingGraph(body, callback) { //monthly graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.billingGraphDailyAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getDailyGraphData(body, callback) { //dail graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.dailyGetDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getWeeklyGraphData(body, callback) { //dail graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.weeklyGetDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getHourlyGraphData(body, callback) { //dail graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.hourlyGetDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  getYearlyConsumptionGetData(body, callback) { //dail graph data
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.getallYearGetDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  
  downloadGraphExcel(body,callback){
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.excelYearlyDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }
  downloadGraphExcelBilling(body,callback){
    var currentUser=this.auth.getCurrentUser();
    body["userId"]=currentUser.userId;
    this.DataService.getAll(this.excelBillingYearlyDataAPI, body,this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callback(result);
      }
    );
  }


  commanDasboardDataScalar(callBack) {
    this.DataService.getAll(this.getCommanDasboardDataScalarApi, null,this.helpers.setHeaderData()).subscribe(
      result => {
        callBack(result);
      }
    );
  }
 
  getConsumptionDataReading(requestBody, callBack) {
    this.DataService.getAll(this.consumptionDataApi, this.setBody(requestBody),this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callBack(result);
      }
    );
  }
  getDailyData(requestBody, callBack) {
    this.DataService.getAll(this.dailyDataApi, this.setBody(requestBody),this.helpers.setHeaderData()).subscribe(
      (result: any) => {
        callBack(result);
      }
    );
  }
 
  setBody(body) {
    var bodyData = {};
    if (body != null && body.reqtype == 1) {
      bodyData = {
        account_number: this.ac_number,
        reqType: body.reqtype
      };
    } else if (body != null && body.reqtype == 2) {
      bodyData = {
        account_number: this.ac_number,
        reqType: body.reqtype,
        months: body.months
      };
    } else if (body != null && body.reqtype == 3) {
      bodyData = {
        account_number: this.ac_number,
        reqType: body.reqtype,
        months: body.months,
        dates: body.day
      };
    } else {
      bodyData = { account_number: this.ac_number };
    }
    return bodyData;
  }
  
}
