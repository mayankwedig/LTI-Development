import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/authService/auth.service";
import { HelpersService } from "../services/helpers/helpers.service";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { ChartsModule } from "ng2-charts";
import { THIS_EXPR, IfStmt } from "@angular/compiler/src/output/output_ast";
import { iterateListLike } from "@angular/core/src/change_detection/change_detection_util";
import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { promise } from "protractor";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

require("../../../node_modules/moment/min/moment.min.js");
declare var $: any;
declare var moment: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})

// @Pipe({
//   name: 'dateFormat'
// })
export class DashboardComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private DashboardService: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private WindowRef: WindowRefService,
    private toastr: ToastrService
  ) {}
  // static readonly DATE_FMT = 'dd/MMM/yyyy';
  private dateVal: Date = new Date();
  // year
  consumptionchartOptions: any = {};
  consumptionlabels: any;
  consumptionchartData: any = [];
  consumptioncolors: any = {};

  // year
  billingchartOptions: any = {};
  billinglabels: any = [];
  billingchartData: any = [];
  billingcolors: any = {};

  account_no: any;
  userName: any;
  yesterdayReading: any;
  yetToDateReading: any;
  consgraphFilter: any;
  billgraphFilter: any;
  onDemandReadData: any = "";
  currentTime = "";
  graphMonth: any;
  containerMonth = false;
  conatinerDay = false;
  currentYear = "";
  currentDate: any;
  currentMonth: any;
  loader = false;
  currentMonthDisp: any;
  accountNumber: any;
  yesterDayConsumptionLoder: boolean = false;
  onDemandReadLoder: boolean = false;
  AccountDetailsFound = false;
  accountDetailsLoder = false;
  accountData: any = "";
  button_text = "Get Read";
  energyTips = "";
  energyTipsFound = false;
  billingDataLoder: boolean = false;
  isbillingDataFound: boolean = false;
  billingData: any = "";
  dispString = "";
  complaintsLoder: boolean = false;
  complaints: any = [];
  complaintsFound: boolean = false;

  serviceRequestLoder: boolean = false;
  ServiceRequests: any = [];
  ServiceRequestFound: boolean = false;

  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";

    this.currentDate = moment().format("Do MMM YY");
    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMM");
    this.currentMonthDisp = moment().format("MMMM");

    this.consgraphFilter = [{ key: 2, value: "Monthly" }];
    this.billgraphFilter = [{ key: 2, value: "Monthly" }]; // ,{key:3,value:"Weekly"}
    this.getDashboardData();
    this.consumptionchartOptions = {
      responsive: true // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    };
    this.consumptionlabels = [];
    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    this.consumptionchartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    // CHART COLOR.
    this.consumptioncolors = [
      // { // 1st Year.
      //   backgroundColor: 'rgba(77,83,96,0.2)'
      // },
      {
        // 2nd Year.
        backgroundColor: "rgba(81, 164, 242, 1)"
      }
    ];

    //billing year chart
    this.billingchartOptions = {
      responsive: true // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    };
    this.billinglabels = [];
    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    this.billingchartData = [
      {
        label: "Billing",
        data: []
      }
    ];
    // CHART COLOR.
    this.billingcolors = [
      // { // 1st Year.
      //   backgroundColor: 'rgba(77,83,96,0.2)'
      // },
      {
        // 2nd Year.
        backgroundColor: "rgba(81, 164, 242, 1)"
      }
    ];
  }
  //changes by Rajesh nair
  getOnDemandRead() {
    this.button_text = "Get Read";
    this.currentTime = moment().format("Do MMM, YYYY hh:mm A	");
    this.onDemandReadLoder = true;
    this.DashboardService.getOnDemandRead(this.accountNumber, (result: any) => {
      this.onDemandReadLoder = false;
      if (result.authCode == "200") {
        var data = result.data_params;

        var latestConsumption = data.latestConsumption;
        //this.onDemandReadData=latestConsumption; // Yesterday's Consumption.
        /* var myNumber = Math.floor(Math.random()*7); */
        this.onDemandReadData = 20 * 5 + 30 + Math.floor(Math.random() * 7);
      } else {
        this.onDemandReadData = "";
      }
    });
  }
  getEnergyTips() {
    this.DashboardService.getEnergyTips(this.accountNumber, (result: any) => {
      this.onDemandReadLoder = false;
      if (result.authCode == "200") {
        this.energyTips = result.data_params;
        this.energyTipsFound = true;
      } else {
        this.energyTips = "";
        this.energyTipsFound = false;
      }
    });
  }

  getcomplaints() {
    this.complaintsLoder = true;
    this.DashboardService.getcomplaints(this.accountNumber, (result: any) => {
      this.complaintsLoder = false;
      if (result.authCode == "200" && result.data_params.length > 0) {
        this.complaints = result.data_params;
        this.complaintsFound = true;
      } else {
        this.complaints = "";
        this.complaintsFound = false;
      }
    });
  }

  getServiceRequest() {
    this.serviceRequestLoder = true;
    this.DashboardService.getServiceRequest(
      this.accountNumber,
      (result: any) => {
        this.serviceRequestLoder = false;
        if (result.authCode == "200" && result.data_params.length > 0) {
          this.ServiceRequests = result.data_params;
          this.ServiceRequestFound = true;
        } else {
          this.ServiceRequests = "";
          this.ServiceRequestFound = false;
        }
      }
    );
  }
  getBillingData() {
    this.billingDataLoder = true;
    this.DashboardService.getBillingData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.billingDataLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.billingData = res.data_params;
            this.isbillingDataFound = true;
          } else {
            this.isbillingDataFound = false;
            this.billingData = "";
          }
        }
      },
      (error: AppError) => {
        this.isbillingDataFound = false;
        this.billingDataLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  downloadGraphExcelBilling() {
    var data = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };

    this.DashboardService.downloadGraphExcelBilling(data, (response: any) => {
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }
  downloadGraphExcelConsumption() {
    var data = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };

    this.DashboardService.downloadGraphExcel(data, (response: any) => {
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }
  getDashboardData() {
    this.showYtdData();
    this.showAccountDetails();
    this.showMonthlyConsumptionGraphData();
    this.getEnergyTips();
    this.getBillingData();
    this.showMonthlyBillingGraphData();
    this.getcomplaints();
    this.getServiceRequest();
  }
  showYtdData() {
    this.yesterDayConsumptionLoder = true;
    this.DashboardService.getYtdData(this.accountNumber, (result: any) => {
      this.yesterDayConsumptionLoder = false;
      if (result.authCode == "200") {
        var data = result.data_params;
        var YesterdayConsumption = data.YesterdayConsumption;
        var yeartodateconsumtion = data.yeartodateconsumtion;
        this.yesterdayReading = YesterdayConsumption; // Yesterday's Consumption.
        this.yetToDateReading = yeartodateconsumtion; // Yesterday's Consumption.
      } else {
        this.yesterdayReading = "-";
        this.yetToDateReading = "-";
      }
    });
  }
  showAccountDetails() {
    this.DashboardService.getAccountDetails(
      this.accountNumber,
      (result: any) => {
        this.accountDetailsLoder = false;
        /* var dsfdsf={"data_params":{"profileId":6,"mobile":"7877129295","first_name":"","last_name":"","username":"amans11s11","email":"amancooljpr222@gmail.com","area":"","id":1,"user_id":6,"account_number":"699991234","account_name":"amans11s11","billing_address":"Bhagwant Das Rd, Opposite Secretariat, Rambagh, Jaipur, Rajasthan 302005","billing_amount":20.36,"billing_due_date":"2018-11-15T07:22:15.000Z","ebill":2,"mobilebill":1,"account_type":1,"status":1,"premise_address":"","sanctioned_load":0,"supply_type":1,"division":null,"subdivision":null,"bill_route":null}}; */
        if (result.authCode == "200") {
          this.AccountDetailsFound = true;
          this.accountData = result.data_params;
        } else {
          this.AccountDetailsFound = false;
        }
      }
    );
  }
  showMonthlyConsumptionGraphData() {
    let data = [];
    let gData = [];
    let body = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };
    this.DashboardService.getMonthlyGraphData(body, (result: any) => {
      // Get Yearly Data
      if (result != null && result.authCode != "100") {
        data = result.data_params;
        var dataSort = data.slice(0);
        dataSort.sort(function(a, b) {
          return a._id - b._id;
        });
        dataSort.map(function(item) {
          gData.push(item.consumption);
        });
        this.consumptionlabels.push(
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        );
        this.consumptionchartData = [
          {
            label: "Consumption",
            data: gData
          }
        ];
      }
    });
  }
  showMonthlyBillingGraphData() {
    let data = [];
    let gData = [];
    let body = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };
    this.DashboardService.getMonthlyGraphDataBilling(body, (result: any) => {
      // Get Yearly Data
      if (result != null && result.authCode != "100") {
        data = result.data_params;
        var dataSort = data.slice(0);
        dataSort.sort(function(a, b) {
          return a._id - b._id;
        });
        dataSort.map(function(item) {
          gData.push(item.billingAmount);
        });
        this.billinglabels.push(
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        );
        this.billingchartData = [
          {
            label: "Billing",
            data: gData
          }
        ];
      }
    });
  }
  goToConsoumption(event, reqType) {
    let data = [];
    data = event.active;
    data.forEach(item => {
      this.helpers.getMonth(item._model.label).then(result => {
        var month = result;
        this.router.navigate(["/consumption"], {
          queryParams: { consumption: btoa(month + ":" + item._model.label) }
        });
      });
    });
  }
  goToBilling(event, reqType) {
    let data = [];
    data = event.active;
    data.forEach(item => {
      this.helpers.getMonth(item._model.label).then(result => {
        var month = result;
        this.router.navigate(["/billing"], {
          queryParams: {
            billing: btoa(
              month + ":" + this.accountNumber + ":" + item._model.label
            )
          }
        });
      });
    });
  }
}
