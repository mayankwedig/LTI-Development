import { AuthService } from './../services/authService/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private auth:AuthService) { }
  isLoggedIn(){
    return this.auth.isLoggedIn();
  }
  ngOnInit() {
  }

}
