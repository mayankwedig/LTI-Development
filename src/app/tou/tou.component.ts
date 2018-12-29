import { WindowRefService } from './../services/window-ref/window-ref.service';
import { NetMeteringService } from "./../services/net-metering/net-metering.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { INgxMyDpOptions, IMyDateModel } from "ngx-mydatepicker";
import { ErrorHandler, Inject, NgZone } from '@angular/core';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
require("../../../node_modules/moment/min/moment.min.js");
declare var moment: any;
declare var $: any;

@Component({
  selector: "app-tou",
  templateUrl: "./tou.component.html",
  styleUrls: ["./tou.component.css"]
})
export class TouComponent implements OnInit {
  
  constructor(
    private dataservice: DataService,
    private activateRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private NetMetering: NetMeteringService,
    private toastr: ToastrService,
    private winRef: WindowRefService,
    private ngZone: NgZone,
  ) {}

 
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
  selectedDay = "";
  selected_year = "";
  selectedDateCalc: any = "";
  myOptions: INgxMyDpOptions = {
    dateFormat: "dd/mm/yyyy",
    disableSince: {
      year: parseInt(moment().format("YYYY")),
      month: parseInt(moment().format("MM")),
      day: parseInt(moment().format("DD"))
    },
    showTodayBtn: false
  };
  ngAfterViewInit(){
    this.genrateNewGraph();
  }
  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";

    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMMM");
    this.selectedDate = moment(
      moment()
        .subtract(1, "days")
        .toString()
    ).format("YYYY-MM-DD");
    this.selectedDay = moment(
      moment()
        .subtract(1, "days")
        .toString()
    ).format("DD");
    this.selected_year = this.currentYear;
    this.setCalanderData();

    // Initialized to specific date (09.10.2018)
    /* selectedData: any = { date: { year: parseInt(this.selected_year), month: , day: 9 } }; date: {year: 2018, month: "12", day: "26"}__proto__: Object
     */
 /*    this.initChartConfig();
    this.genrateGraph(); */
    
  }
  
  genrateNewGraph() {
    this.loder=false;
    this.isDataFound=true;
    $(".showChart").css('display', 'none');
    this.ngZone.runOutsideAngular(() => {
    
      /* Chart code */
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    let data = [];
    chart.data = [
      {
        year: "1",
        income: 23.5,
        expenses: 21.1,
        lineColor: "#B4DBED"
      },
      {
        year: "2",
        income: 26.2,
        expenses: 30.5
      },
      {
        year: "3",
        income: 30.1,
        expenses: 34.9
      },
      {
        year: "4",
        income: 20.5,
        expenses: 23.1
      },
      {
        year: "5",
        income: 30.6,
        expenses: 28.2
      },
      {
        year: "6",
        income: 34.1,
        expenses: 31.9,
        lineColor: "#0000FF"
      },
      {
        year: "7",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "8",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "9",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "10",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "11",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "12",
        income: 34.1,
        expenses: 31.9,
        lineColor: "#FF0000"
      },
      {
        year: "13",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "14",
        income: 23.5,
        expenses: 21.1
      },
      {
        year: "15",
        income: 26.2,
        expenses: 30.5
      },
      {
        year: "16",
        income: 30.1,
        expenses: 34.9
      },
      {
        year: "17",
        income: 20.5,
        expenses: 23.1
      },
      {
        year: "18",
        income: 30.6,
        expenses: 28.2,
        lineColor: "#00FF00"
      },
      {
        year: "19",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "20",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "21",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "22",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "23",
        income: 34.1,
        expenses: 31.9
      },
      {
        year: "24",
        income: 34.1,
        expenses: 31.9
      }
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.dataFields.category = "year";
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "year";
    lineSeries.dataFields.valueY = "income";
    lineSeries.tooltipText = "income: {valueY.value}";
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.stroke = "lineColor";
    lineSeries.propertyFields.fill = "lineColor";

    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
  });
  }
  setCalanderData() {
    this.selectedDateCalc = {
      date: {
        year: parseInt(this.selected_year),
        month: moment().format("MM"),
        day: moment()
          .subtract(1, "days")
          .format("DD")
      }
      /* disableDates: [{begin: {year: parseInt(this.selected_year), month: parseInt(moment().format("MM")), day: parseInt(moment().format("DD"))}, end: {year: 3000, month: 11, day: 20} */
    };
    this.selectedDate =
      this.selectedDateCalc.date.year +
      "/" +
      this.selectedDateCalc.date.month +
      "/" +
      this.selectedDateCalc.date.day;
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
    /* console.log(this.selectedDateCalc); */
    console.log(this.selectedDate.split("/"));
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
      body = {
        account_number: this.accountNumber,
        reference_dateTime: this.selectedDate,
        displayMode: "NMBH"
      };
      this.NetMetering.getNetMeteringGraphData(body, (result: any) => {
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
                label: "Consumption",
                data: gData,
                fill: false,
                borderWidth: 2
              },
              {
                label: "Generation",
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
        borderColor: "#0571d7"
      },
      {
        // dark grey
        backgroundColor: "#3cbaaa",
        borderColor: "#3cba9f"
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

