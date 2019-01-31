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
import { resolve } from "url";
import { reject } from "q";
import { TranslationService } from "../services/translation/translation.service";


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
  /* scrollConfig={
    suppressScrollY:false,
    suppressScrollX:true 
  } */
  constructor(
    private auth: AuthService,
    private DashboardService: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private WindowRef: WindowRefService,
    private toastr: ToastrService,
    private translationServices: TranslationService
  ) {}

  /*******************Dropdown Configs**********************************/
  serviceReqDropDownconfig = {
    displayKey: "label", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: "200px", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: "Select Service Request Tracking ID", // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    /*  limitTo: options.length,  */ moreText: "more", // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: "No results found!", // text to be displayed when no items are found while searching
    searchPlaceholder: "Search Serivce Request Tracking ID" // label thats displayed in search input
  };

  complaintReqDropDownconfig = {
    displayKey: "label", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: "200px", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: "Select Complaint Tracking ID", // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    /*  limitTo: options.length,  */ moreText: "more", // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: "No results found!", // text to be displayed when no items are found while searching
    searchPlaceholder: "Search Complaint Tracking ID" // label thats displayed in search input
  };

  selectedComplaintNo: any = "";
  selectedServiceReqNo: any = "";
  showComplaintError = false;
  redirectoComplaintDetails() {
    if (
      this.selectedComplaintNo != "" &&
      this.selectedComplaintNo != null &&
      this.selectedComplaintNo.length != 0
    ) {
      var serviceRequestId = btoa(this.selectedComplaintNo[0].value);
      this.router.navigate(["/complaint-request-details"], {
        queryParams: { complaintReq: serviceRequestId }
      });
    } else {
      this.toastr.error("Please Select Complaint ID!", "failed!");
    }
  }
  redirectoRequestDetails() {
    if (
      this.selectedServiceReqNo != "" &&
      this.selectedServiceReqNo != null &&
      this.selectedServiceReqNo.length != 0
    ) {
      var serviceRequestId = btoa(this.selectedServiceReqNo[0].value);
      this.router.navigate(["/service-request-details"], {
        queryParams: { serviceReq: serviceRequestId }
      });
    } else {
      this.toastr.error("Please Select Service Request ID!", "failed!");
    }
  }

  /***********************End Dropdown Configs**********************************/

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
  showGetReadButton: boolean = true;
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

  alertData = [];
  alertDataLoader: boolean = false;
  isAlertDataFound: boolean = false;

  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
   
    this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";

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
    this.showGetReadButton = false;
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
        /*  this.complaints = result.data_params; */
        result.data_params.forEach(eleme => {
          this.complaints.push({
            label: eleme.tracking_number,
            value: eleme.id
          });
        });
        this.complaintsFound = true;
      } else {
        this.complaints = [];
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
          result.data_params.forEach(eleme => {
            this.ServiceRequests.push({
              label: eleme.tracking_number,
              value: eleme.id
            });
          });
          /*  this.ServiceRequests = result.data_params; */
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
    var excelBillingYearlyDataAPI = "users/excelYearlyData";
    var data = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };

    this.DashboardService.downloadGraphExcel(
      excelBillingYearlyDataAPI,
      data,
      (response: any) => {
        if (response.authCode == "200") {
          this.WindowRef.nativeWindow.open(response.data_params, "popup");

          //this.toastr.success("Excel downloaded successfully", "Success!");
        } else {
          //this.toastr.error("Something went wrong!", "failed!");
        }
      }
    );
  }

  downloadPDFfile(PDFURL) {
    this.WindowRef.nativeWindow.open(PDFURL, "popup");

    // this.toastr.success("PDF downloaded successfully", "Success!");
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
    this.getAlertData();
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
        this.helpers.lat12Monts().then(
          response => {
            // getting last 12 months from current date.
            this.consumptionlabels = response;
            this.consumptionchartData = [
              {
                label: "Consumption",
                data: gData
              }
            ];
          },
          error => {
            console.log("Error occured...!");
          }
        );
       /*  console.log(this.consumptionlabels); */
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
        console.log(month);
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

  getAlertData() {
    this.alertDataLoader = true;
    this.DashboardService.getAlertData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.alertDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.alertData = res.data_params;
            this.isAlertDataFound = true;
          } else {
            this.isAlertDataFound = false;
            this.alertData = [];
          }
        }
      },
      (error: AppError) => {
        this.isAlertDataFound = false;
        this.alertDataLoader = false;
        this.alertData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
