import { NetMeteringService } from './../services/net-metering/net-metering.service';
import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "./../services/window-ref/window-ref.service";


import { ToastrService } from "ngx-toastr";

import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
require("../../../node_modules/moment/min/moment.min.js");
declare var moment: any;
declare var $: any;
@Component({
  selector: 'app-net-metering',
  templateUrl: './net-metering.component.html',
  styleUrls: ['./net-metering.component.css']
})
export class NetMeteringComponent implements OnInit {
  constructor(
    private dataservice: DataService,
    private activateRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private NetMetering: NetMeteringService,
    private toastr: ToastrService,
    private DashboardService: DashboardService,
    private WindowRef: WindowRefService
  ) { }
  currentYear: any = "";
  currentMonth: any = "";

  //chart optoins
  netMeteringChartOptions: any = "";
  netMeteringlabels: any = [];
  netMeteringcolors: any = "";
  netMeteringmonthchartOptions: any = "";
  netMeteringChartData: any = "";
  netMeteringdaychartOptions: any = "";
  netMeteringdaylabels: any = "";
  netMeteringdaychartData: any = "";
  netMeteringdaycolors: any = "";

  accountNumber: any = "";
  month_name: any = "";
  loder: any = false;
  isDataFound = false;
  chartType = "line";
  chartToShow = "hourly";
  dispString = "";
  selectedDate = "";
  selectedDay: any = "";
  selected_year: any = "";
  selected_month: any = "";
  selectedDateCalc: any = "";
  myOptions: INgxMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableSince: { year: parseInt(moment().format("YYYY")), month: parseInt(moment().format("MM")), day: parseInt(moment().format("DD")) },
    showTodayBtn: false
  };
  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";

    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMMM");
    this.selectedDate = moment(moment().subtract(1, 'days').toString()).format("YYYY-MM-DD")
    this.selectedDay = moment(moment().subtract(1, 'days').toString()).format("DD");
    this.selected_year = this.currentYear;
    this.setCalanderData();

    // Initialized to specific date (09.10.2018)
    /* selectedData: any = { date: { year: parseInt(this.selected_year), month: , day: 9 } }; date: {year: 2018, month: "12", day: "26"}__proto__: Object
 */
    this.initChartConfig();
    this.genrateGraph();
  }

  setCalanderData() {
    this.selectedDateCalc = {
      date: {
        year: parseInt(this.selected_year),
        month: moment().format("MM"),
        day: moment().subtract(1, 'days').format("DD")
      }
      /* disableDates: [{begin: {year: parseInt(this.selected_year), month: parseInt(moment().format("MM")), day: parseInt(moment().format("DD"))}, end: {year: 3000, month: 11, day: 20} */
    }
    this.selectedDate = this.selectedDateCalc.date.year + "/" + this.selectedDateCalc.date.month + "/" + this.selectedDateCalc.date.day;
  }
  onDateChanged($event) {
    console.log($event);
    if ($event.jsdate != null) {
      this.selectedDate = moment($event.jsdate).format("YYYY/MM/DD");
      this.genrateGraph();
    } else {
      this.toastr.error("Please Select appropriate date!", "failed!");
    }
  }
  dispSelectedYear = "";
  dispSelectedMonth = "";
  dispSelectedDay = "";
  genrateGraph() {
    var SelectedDate = this.selectedDate.split("/");
    this.dispSelectedYear = SelectedDate[0];
    this.dispSelectedMonth = moment(SelectedDate[1]).format("MMMM");
    this.dispSelectedDay = SelectedDate[2];
    this.netMeteringChartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.loder = true;
    let data = [];
    this.netMeteringlabels = [];
    let body = {};
    let gData = [];
    let generationData = [];
    if (this.chartToShow == "hourly") {
      var reference_dateTime=this.dispSelectedYear+'-'+SelectedDate[1]+'-'+this.dispSelectedDay;
      body = { "account_number": this.accountNumber, "reference_dateTime": reference_dateTime, "displayMode": "NMBH" }
      this.NetMetering.getNetMeteringGraphData(body, (result: any) => {
        this.loder = false;

        if (result != null) {
          data = result.data_params;
          this.isDataFound = true;
          if (data.length > 0) {
            var dataSort = data.slice(0);
            dataSort.sort(function (a, b) {
              return a._id - b._id;
            });
            
            dataSort.map(function (item) {
              gData.push(item.consumption);
              generationData.push(item.generation);
            });
            this.netMeteringlabels.push(
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
            this.netMeteringChartData = [
              {
                label:
                  "Consumption",
                data: gData,
                fill: false,
                borderWidth: 2
              },
              {
                label:
                  "Generation",
                data: generationData,
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
    }
  }


  downloadGraphExcelNetmetering() {
    var SelectedDate = this.selectedDate.split("/");
    var excelNetmeteringHourlyData = "users/excelHourlyDataNetMetering";
    var data = {
      account_number: this.accountNumber,
      year: parseInt(SelectedDate[0]),
      month: parseInt(SelectedDate[1]),
      day: parseInt(SelectedDate[2]),

    };

    this.DashboardService.downloadGraphExcel(excelNetmeteringHourlyData, data, (response: any) => {
      if (response.authCode == "200") {
        this.WindowRef.nativeWindow.open(response.data_params, "popup");

        //this.toastr.success("Excel downloaded successfully", "Success!");
      } else {
        //this.toastr.error("Something went wrong!", "failed!");
      }
    });
  }





  initChartConfig() {
    this.netMeteringChartOptions = {
      responsive: true
    };
    this.netMeteringlabels = [];
    this.netMeteringChartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.netMeteringcolors = [
      {
        backgroundColor: "#3482cc",
        borderColor: "#0571d7",
      },
      { // dark grey
        backgroundColor: '#3cbaaa',
        borderColor: "#3cba9f",
      }
    ];
    this.netMeteringChartData = [
      {
        label: "Consumption",
        data: []
      }
    ];
    this.netMeteringlabels = [];

  }
}
