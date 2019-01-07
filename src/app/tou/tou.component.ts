import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { NetMeteringService } from "./../services/net-metering/net-metering.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { INgxMyDpOptions, IMyDateModel } from "ngx-mydatepicker";
import { ErrorHandler, Inject, NgZone } from "@angular/core";
require("../../../node_modules/moment/min/moment.min.js");

/* Chart Lib Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

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
    private ngZone: NgZone
  ) {}

  currentYear: any = "";
  currentMonth: any = "";
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
  ngAfterViewInit() {
    setTimeout(() => {
    this.loder  = true;
    this.genrateGraph();
  })
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
    };
    this.selectedDate =
      this.selectedDateCalc.date.year +
      "/" +
      this.selectedDateCalc.date.month +
      "/" +
      this.selectedDateCalc.date.day;
  }
  onDateChanged($event) {
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
    $(".showChart").css("display", "none");
    var SelectedDate = this.selectedDate.split("/");
    this.dispSelectedYear = SelectedDate[0];
    this.dispSelectedMonth = moment(SelectedDate[1]).format("MMMM");
    this.dispSelectedDay = SelectedDate[2];
    this.loder = true;
    let data = [];
    let body = {};
    let gData = [];
    let generationData = [];
    if (this.chartToShow == "hourly") {
      body = {
        account_number: this.accountNumber,
        month: parseInt(SelectedDate[1]),
        year: parseInt(SelectedDate[0]),
        day: parseInt(SelectedDate[2])
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
            var i = 1;
            dataSort.map(function(item) {
              var Data = {
                hour: i,
                consumption: item.consumption
              };
              if (item.tou == 'TOD1') {
                Data["lineColor"] = "#09b4aa";
              }
              if (item.tou == 'TOD2') {
                Data["lineColor"] = "#febe00";
              }
              if (item.tou == 'TOD3') {
                Data["lineColor"] = "#493ba5";
              }
              if (item.tou == 'TOD4') {
                Data["lineColor"] = "#ff1db1";
              }
              gData.push(Data);
              i++;
            });
            $(".showChart").css("display", "block");
            this.ngZone.runOutsideAngular(() => {
              /* Chart code */
              let chart = am4core.create("chartdiv", am4charts.XYChart);
              let data = [];
              chart.data = gData;

              let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
              categoryAxis.renderer.grid.template.location = 0;
              categoryAxis.renderer.ticks.template.disabled = true;
              categoryAxis.renderer.line.opacity = 0;
              categoryAxis.renderer.grid.template.disabled = true;
              categoryAxis.renderer.minGridDistance = 40;
              categoryAxis.dataFields.category = "hour";
              categoryAxis.startLocation = 0.4;
              categoryAxis.endLocation = 0.6;

              let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
              valueAxis.tooltip.disabled = true;
              valueAxis.renderer.line.opacity = 0;
              valueAxis.renderer.ticks.template.disabled = true;
              valueAxis.min = 0;

              let lineSeries = chart.series.push(new am4charts.LineSeries());
              lineSeries.dataFields.categoryX = "hour";
              lineSeries.dataFields.valueY = "consumption";
              lineSeries.tooltipText = "consumption: {valueY.value}";
              lineSeries.fillOpacity = 0.5;
              lineSeries.strokeWidth = 3;
              lineSeries.propertyFields.stroke = "lineColor";
              lineSeries.propertyFields.fill = "lineColor";

              let bullet = lineSeries.bullets.push(
                new am4charts.CircleBullet()
              );
              bullet.circle.radius = 6;
              bullet.circle.fill = am4core.color("#fff");
              bullet.circle.strokeWidth = 3;

              chart.cursor = new am4charts.XYCursor();
              chart.cursor.behavior = "panX";
              chart.cursor.lineX.opacity = 0;
              chart.cursor.lineY.opacity = 0;
              $("[aria-labelledby]").css("display","none");
              chart.scrollbarX = new am4core.Scrollbar(); // uncomment if Bottom scroll bar is needed.
    chart.scrollbarX.parent = chart.bottomAxesContainer;
            });
          } else {
            this.isDataFound = false;
          }
        } else {
          this.isDataFound = false;
        }
      });
    }
  }
}
