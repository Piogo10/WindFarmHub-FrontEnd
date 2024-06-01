import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { ModelsComponent } from './pages/models/models.component';
import { ModelDetailsComponent } from './pages/model-details/model-details.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/slidebar/users/users.component';
import { ModelosComponent } from './pages/slidebar/modelos/modelos.component';
import { DashboardmainComponent } from './pages/slidebar/dashboardmain/dashboardmain.component';
import { ProductsComponent } from './pages/slidebar/items/items.component';
import { AlertComponent } from './alert/alert.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ModelClosetDetailsComponent } from './pages/model-closet-details/model-closet-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ModelsComponent,
    ModelDetailsComponent,
    DashboardComponent,
    UsersComponent,
    ModelosComponent,
    DashboardmainComponent,
    ProductsComponent,
    AlertComponent,
    NavbarComponent,
    ModelClosetDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }