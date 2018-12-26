import { SignupOtpVerificationService } from './services/signup-otp-verification/signup-otp-verification.service';
import { NetMeteringService } from './services/net-metering/net-metering.service';
import { SerivceRequestService } from './services/service-request/serivce-request.service';
import { ComplaintsService } from './services/complaints/complaints.service';
import { ProfileService } from './services/profile/profile.service';
import { AppErrorHandler } from './common/app-error-handler';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, ErrorHandler } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageInfoComponent } from './home-page-info/home-page-info.component';
import { HomePageSliderComponent } from './home-page-slider/home-page-slider.component';
import {WindowRefService} from './services/window-ref/window-ref.service';
import { LoginComponent } from './login/login.component';
import { ValidateAccountNumber } from './validate-account-number/validate-account-number.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {SignupService} from './services/signup/signup.service';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { DataService } from './services/data.service';
import { LoginService } from './services/login/login.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/authService/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { FaqComponent } from './faq/faq.component';
import { CustomersServiceComponent } from './customers-service/customers-service.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { ConsumptionComponent } from './consumption/consumption.component';
import { SettingsComponent } from './settings/settings.component';
import { NewConnectionComponent } from './new-connection/new-connection.component';
import { UsageComponent } from './usage/usage.component';
import { NewsMediaComponent } from './news-media/news-media.component';
import { TipsComponent } from './tips/tips.component';
import { ChartsModule } from 'ng2-charts';
import { ImportantLinksComponent } from './important-links/important-links.component';
import { ProfileComponent } from './profile/profile.component';
import { ManageaccountComponent } from './manageaccount/manageaccount.component';
import { DownloadComponent } from './download/download.component';
import { RequesttrackComponent } from './requesttrack/requesttrack.component';
import { BillingComponent } from './billing/billing.component';
import { HomeImpLinkSliderComponent } from './home-imp-link-slider/home-imp-link-slider.component';
import {MatTabsModule} from '@angular/material';
import { DisclamiderComponent } from './disclamider/disclamider.component';
import { RegistrationComponent } from './registration/registration.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import {HelpersService} from './services/helpers/helpers.service';
import { OtpVerificationService } from './services/otp-varification/otp-verification.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import {AddaccountComponent} from './addaccount/addaccount.component';
import {DataTableModule} from "angular-6-datatable";
import { ComplaintsComponent } from './complaints/complaints.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { NetMeteringComponent } from './net-metering/net-metering.component';
import { NgxLoadingModule } from 'ngx-loading';
import { SingupOtpVarificationComponent } from './singup-otp-varification/singup-otp-varification.component';
import { ViewAllServiceRequestsComponent } from './view-all-service-requests/view-all-service-requests.component';
import { ServiceRequestDetailsComponent } from './service-request-details/service-request-details.component';
import { ViewAllComplaintsComponent } from './view-all-complaints/view-all-complaints.component';

import { DashboarRedirectComponent } from './dashboar-redirect/dashboar-redirect.component';

import { ComplaintRequestDetailsComponent } from './complaint-request-details/complaint-request-details.component';

import { NgxMyDatePickerModule } from 'ngx-mydatepicker';



/* import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX:true 
}; */
@NgModule({
  declarations: [
    
    AppComponent,
    HomeComponent,
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    HomePageInfoComponent,
    HomePageSliderComponent,
    LoginComponent,
    ValidateAccountNumber,
    PageNotFoundComponent,
    DashboardComponent,
    ContactUsComponent,
    AboutComponent,
    HelpComponent,
    FaqComponent,
    CustomersServiceComponent,
    SitemapComponent,
    ConsumptionComponent,
    SettingsComponent,
    NewConnectionComponent,
    UsageComponent,
    NewsMediaComponent,
    TipsComponent,
    ImportantLinksComponent,
    ProfileComponent,
    ManageaccountComponent,
    DownloadComponent,
    RequesttrackComponent,
    BillingComponent,
    HomeImpLinkSliderComponent,
    DisclamiderComponent,
    RegistrationComponent,
    OtpVerificationComponent,
    UpdateProfileComponent,
    AddaccountComponent,
    ComplaintsComponent,
    ServiceRequestComponent,
    NetMeteringComponent,
    SingupOtpVarificationComponent,
    ViewAllServiceRequestsComponent,
    ServiceRequestDetailsComponent,
    ViewAllComplaintsComponent,
    DashboarRedirectComponent,
    ComplaintRequestDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    DataTableModule,
    MatTabsModule,
    LoadingBarRouterModule,
    FormsModule,ReactiveFormsModule, 
    ChartsModule,
    RouterModule.forRoot([
      {path:'',component: HomeComponent},
      {path:'about',component: AboutComponent}, 
      {path:'contact-us',component: ContactUsComponent},  
      {path:'login',component: LoginComponent},
      {path:'account-verification',component: ValidateAccountNumber},
      {path:'dashboard',component: DashboardComponent,canActivate:[AuthGuard]},
      {path:'help',component: HelpComponent},
      {path:'faqs',component: FaqComponent},   
      {path:'customers-service',component: CustomersServiceComponent}, 
      {path:'sitemap',component: SitemapComponent},    
      {path:'consumption',component: ConsumptionComponent,canActivate:[AuthGuard]},
      {path:'settings',component: SettingsComponent},
      {path:'new-connection',component: NewConnectionComponent},
      {path:'usage',component: UsageComponent},
      {path:'news-media',component: NewsMediaComponent},
      {path:'tips',component: TipsComponent}, 
      {path:'important-links',component: ImportantLinksComponent},
      {path:'profile',component: ProfileComponent,canActivate:[AuthGuard]},
      {path:'manageaccount',component: ManageaccountComponent,canActivate:[AuthGuard]},
      {path:'download',component: DownloadComponent},
      {path:'request-track',component: RequesttrackComponent},
      {path:'billing',component: BillingComponent,canActivate:[AuthGuard]},
      {path:'otp-verification',component: OtpVerificationComponent,canActivate:[AuthGuard]}, 
      {path:'registration',component: RegistrationComponent,canActivate:[AuthGuard]}, 
      {path:'update-profile',component: UpdateProfileComponent,canActivate:[AuthGuard]},
      {path:'complaints',component: ComplaintsComponent,canActivate:[AuthGuard]},
      {path:'service-request',component:ServiceRequestComponent,canActivate:[AuthGuard]},
      {path:'net-metering',component:NetMeteringComponent,canActivate:[AuthGuard]},
      {path:'singup-otp-varification',component:SingupOtpVarificationComponent}, 
      {path:'view-all-service-request',component:ViewAllServiceRequestsComponent,canActivate:[AuthGuard]},
      {path:'service-request-details',component:ServiceRequestDetailsComponent,canActivate:[AuthGuard]},
      {path:'view-all-complaints',component:ViewAllComplaintsComponent,canActivate:[AuthGuard]},

      {path:'redirect-dashboard',component:DashboarRedirectComponent,canActivate:[AuthGuard]},
      {path:'complaint-request-details',component:ComplaintRequestDetailsComponent,canActivate:[AuthGuard]},

      {path:'**',component: PageNotFoundComponent},
      
      
    ]),ToastrModule.forRoot({
      maxOpened:1,
      
      autoDismiss:true,
      preventDuplicates:true
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({}),
    /* PerfectScrollbarModule */
    NgxMyDatePickerModule.forRoot()
  ],
  providers: [
    WindowRefService,
    HelpersService,
    DataService,
    SignupService,
    {provide:ErrorHandler,useClass:AppErrorHandler},
    LoginService,
    AuthService,
    OtpVerificationService,
    DashboardService,
    ProfileService,
    ComplaintsService,
    SerivceRequestService,
    NetMeteringService,
    SignupOtpVerificationService/* ,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
  
