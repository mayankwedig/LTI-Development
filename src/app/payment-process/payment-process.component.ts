import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {

  constructor(private route:ActivatedRoute) { 
    
  }

  ngOnInit() {
    console.log(this.route.snapshot.queryParamMap);
  }

}
