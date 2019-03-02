import { SearchService } from "./../services/search/search.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchKeyWord = sessionStorage.getItem("search");
  resultFound: any = false;
  searchLoader: boolean = false;
  searchResponse = [];

  constructor(private _searchService: SearchService) {}

  ngOnInit() {
    if (this.searchKeyWord != "") {
      this.getSearch(this.searchKeyWord);
    }
  }

  getSearch(searchKeyWord) {
    this.searchLoader = true;
    this._searchService.search(searchKeyWord).subscribe(
      (response: any) => {
        var res = response;
        this.searchLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.searchResponse = res.data_params;
            this.resultFound = true;
          } else {
            this.searchResponse = [];
            this.resultFound = false;
          }
        }
      },
      (error: AppError) => {
        this.searchLoader = false;
        this.searchResponse = [];
        this.resultFound = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
