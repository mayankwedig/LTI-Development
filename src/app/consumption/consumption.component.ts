import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "./../services/window-ref/window-ref.service";
require("../../../node_modules/moment/min/moment.min.js");
declare var moment: any;
declare var $: any;
@Component({
  selector: "app-consumption",
  templateUrl: "./consumption.component.html",
  styleUrls: ["./consumption.component.css"]
})
export class ConsumptionComponent implements OnInit {
  constructor(
    private dataservice: DataService,
    private activateRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private helpers: HelpersService,
    private WindowRef: WindowRefService,
    private router: Router
  ) {}
  selected_month: any = "";
  isMonthSelected: any = false;
  currentYear: any = "";
  currentMonth: any = "";
  getselectedGraphData: any = "";
  //chart optoins
  consumptionchartOptions: any = "";
  consumptionlabels: any = [];
  consumptioncolors: any = "";
  consumptionmonthchartOptions: any = "";
  consumptionchartData: any = "";
  consumptionmonthcolors: any = "";
  consumptiondaychartOptions: any = "";
  consumptiondaylabels: any = "";
  consumptiondaychartData: any = "";
  consumptiondaycolors: any = "";
  selectedDay: any = "";

  accountNumber: any = "";
  month_name: any = "";
  loder: any = false;
  isDataFound = false;
  chartType = "bar";
  chartToShow = "daily";
  dispString = "";
  selected_year:any="";
  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";

    if (this.activateRoute.snapshot.queryParamMap.get("consumption") != null) {
      this.getselectedGraphData = atob(
        this.activateRoute.snapshot.queryParamMap.get("consumption")
      );
      this.getselectedGraphData = this.getselectedGraphData.split(":");
      this.selected_month = this.getselectedGraphData[0]; // month
      this.month_name = this.getselectedGraphData[1]; //  Month Name
      this.isMonthSelected = this.selected_month != "" ? true : false;
    } else {
      this.isMonthSelected = false;
    }
    
    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMM");
    this.initChartConfig();
    console.log(this.isMonthSelected);
    if (this.isMonthSelected) {
      this.showchart(this.chartToShow);
    } else {
      this.showchart("yearly");
    }
  }

  // new changes By chandni  22/12/2018
  downloadGraphExcelConsumption() {
    var excelBillingYearlyDataAPI="users/excelYearlyData"; 
    var requestParams = {
      account_number: this.accountNumber,
      year: parseInt(this.selected_year)
    };

    this.dashboard.downloadGraphExcel(excelBillingYearlyDataAPI,requestParams, (response: any) => { //Monthly Consumption
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        // this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        // this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }


  downloadAllYesrExcelConsumption() {
    var excelAllYearConsumption="users/excelAllYearConsumption";
    var requestParams = {
      account_number: this.accountNumber
    };

    this.dashboard.downloadGraphExcel(excelAllYearConsumption,requestParams, (response: any) => { //Yearly Consumption
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        // this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        // this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }

  


  downloadAllDailyExcelConsumption() {
    var excelDailyData="users/excelDailyData";
    var requestParams = {
      account_number: this.accountNumber,
      year: parseInt(this.selected_year),
      month : parseInt(this.selected_month)
    };
    this.dashboard.downloadGraphExcel(excelDailyData,requestParams, (response: any) => { //Daily Consumption
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        // this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        // this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }

  downloadAllWeeklyExcelConsumption() {
    var excelWeeklyData="users/excelWeeklyData";
    var requestParams = {
      account_number: this.accountNumber,
      year: parseInt(this.selected_year),
      month : parseInt(this.selected_month)
    };
    this.dashboard.downloadGraphExcel(excelWeeklyData,requestParams, (response: any) => { //Weekly Consumption
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        // this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        // this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }
  
   
  downloadAllHourlyExcelConsumption() {
    var excelHourlyData="users/excelHourlyData";
    var requestParams = {
      account_number: this.accountNumber,
      year: parseInt(this.selected_year),
      month : parseInt(this.selected_month),
      day: parseInt(this.selectedDay)
    };
    this.dashboard.downloadGraphExcel(excelHourlyData,requestParams, (response: any) => { //Hourly Consumption
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        // this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        // this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }



  backToDashBoard() {
    this.router.navigate(["/dashboard"]);
  }
  showchart(chartToShow) {
    this.chartToShow = chartToShow;
    if (chartToShow == "hourly") {
      this.chartType = "line";
    } else {
      this.chartType = "bar";
    }
    this.genrateGraph();
  }
  genrateGraph() {
    this.consumptionchartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.loder = true;
    let data = [];
    this.consumptionlabels = [];
    let body = {};
    let gData = [];
    this.selected_year = this.selected_year == "" ? this.currentYear: this.selected_year;
    if (this.chartToShow == "daily") {
      body = {
        account_number: this.accountNumber,
        month: parseInt(this.selected_month),
        year: parseInt(this.selected_year)
      };
      this.dashboard.getDailyGraphData(body, (result: any) => {
        this.loder = false;
        if (result != null && result.authCode != "100") {
          data = result.data_params;
          this.isDataFound = true;
          data.forEach(item => {
            gData.push(item.consumption); //modified by Mayank for demo
            /*  var consup = 0;
            if (item.month == 12) {
              // if December
              if (item.day <= 4) {
                // less then 4th day
                consup = item.consumption;
              } else {
                consup = 0;
              }
            } else {
              consup = item.consumption;
            }
            console.log(consup);
            gData.push(consup); */
          });
          /*  console.log(gData); */
          this.helpers
            .daysInMonth(this.selected_month, this.selected_year)
            .then((dValue: any) => {
              this.consumptionlabels = dValue;
              this.consumptionchartData = [
                {
                  label:
                    "Consumption for " +
                    this.month_name +
                    ", " +
                    this.selected_year,
                  data: gData
                }
              ];
            });
        } else {
          this.isDataFound = false;
        }
      });
    } else if (this.chartToShow == "hourly") {
      body = {
        account_number: this.accountNumber,
        month: parseInt(this.selected_month),
        year: parseInt(this.selected_year),
        day: parseInt(this.selectedDay)
      };
      this.dashboard.getHourlyGraphData(body, (result: any) => {
        this.loder = false;

        if (result != null) {
          data = result.data_params;
          this.isDataFound = true;
          if (data.length > 0) {
            var dataSort = data.slice(0);
            dataSort.sort(function(a, b) {
              return a._id - b._id;
            });

            dataSort.map(function(item) {
              gData.push(item.consumption);
            });
            this.consumptionlabels.push(
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24"
            );
            this.consumptionchartData = [
              {
                label:
                  "Consumption as on " +
                  this.month_name +
                  " " +
                  this.selectedDay +
                  ", " +
                  this.selected_year,
                data: gData,
                fill: false,
                borderWidth: 2
              }
            ];
          } else {
            this.isDataFound = false;
          }
        } else {
          this.isDataFound = false;
        }
      });
    } else if (this.chartToShow == "yearly") {
      var consumptionLbl=[];
      body = {
        account_number: this.accountNumber
      };
      this.dashboard.getYearlyConsumptionGetData(body, (result: any) => {
        this.loder = false;

        if (result != null && result.authCode != "100") {
          data = result.data_params;
          this.isDataFound = true;
          if (data.length > 0) {
            var dataSort = data.reverse();
            dataSort.map(function(item) {
              gData.push(item.consumption);
              consumptionLbl.push(item.year);
            });
            this.consumptionlabels=consumptionLbl;
            this.consumptionchartData = [
              {
                label:
                  " Yearly Consumption",
                data: gData,
                fill: false,
                borderWidth: 2
              }
            ];
          } else {
            this.isDataFound = false;
          }
        } else {
          this.isDataFound = false;
        }
      });
    } else if (this.chartToShow == "monthly") {
      
      let data = [];
      let gData = [];
      let body = {
        account_number: this.accountNumber,
        year: parseInt(this.selected_year)
      };
      this.dashboard.getMonthlyGraphData(body, (result: any) => {
        this.loder = false;
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
              label: "Consumption for "+this.selected_year,
              data: gData
            }
          ];
        }
      });
    }else {
      body = {
        account_number: this.accountNumber,
        month: parseInt(this.selected_month),
        year: parseInt(this.selected_year)
      };

      this.dashboard.getWeeklyGraphData(body, (result: any) => {
        this.loder = false;
        if (result != null && result.authCode != "100") {
          data = result.data_params;
          this.isDataFound = true;
          data.forEach(item => {
            gData.push(item.consumption);
          });
          this.consumptionlabels.push("1", "2", "3", "4");
          this.consumptionchartData = [
            {
              label:
                "Consumption for " +
                this.month_name +
                ", " +
                this.selected_year,
              data: gData
            }
          ];
        } else {
          this.isDataFound = false;
        }
      });
    }
  }
 
  openChartOnClick(event, reqType) {
    if (reqType === "hourly") {
      var data = event.active;
      data.forEach(item => {
        this.selectedDay = item._model.label;
      });
      this.showchart(reqType);
    }else if (reqType === "monthly") {
      var data = event.active;
      data.forEach(item => {
        this.selected_year=item._model.label;
      });
      this.showchart(reqType);
    }else if (reqType === "daily") {
      data = event.active;
      data.forEach(item => {
        this.helpers.getMonth(item._model.label).then(result => {
          var month=result;
          this.selected_month=month;
          this.month_name=item._model.label;
          this.showchart(reqType);
        });
      });
        
    } else {
      return false;
    }
  }
  initChartConfig() {
    this.consumptionchartOptions = {
      responsive: true
    };
    //consumption chart year options
    this.consumptionlabels = [];
    this.consumptionchartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.consumptioncolors = [
      {
        backgroundColor: "rgba(81, 164, 242, 1)"
      }
    ];

    //consumption chart month options
    this.consumptionmonthchartOptions = {
      responsive: true // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    };

    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    this.consumptionchartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.consumptionlabels = [];
    // CHART COLOR.
    this.consumptionmonthcolors = [
      {
        backgroundColor: "rgba(81, 164, 242, 1)",
        borderColor: "#0571d7"
      }
    ];

    //consumption chart days options
    this.consumptiondaychartOptions = {
      responsive: true,
      spanGaps: true
    };
    this.consumptiondaylabels = [];
    this.consumptiondaychartData = [
      {
        label: "Consumption",
        data: [],
        fill: false,
        borderWidth: 2
      }
    ];
    this.consumptiondaycolors = [
      {
        backgroundColor: "rgba(81, 164, 242, 1)"
      }
    ];
  }

}
