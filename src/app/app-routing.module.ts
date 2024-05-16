import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ModelsComponent } from './pages/models/models.component';
import { AuthGuard } from './services/auth-guard.service';
import { ModelDetailsComponent } from './pages/model-details/model-details.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/slidebar/users/users.component';
import { ModelosComponent } from './pages/slidebar/modelos/modelos.component';
import { DashboardmainComponent } from './pages/slidebar/dashboardmain/dashboardmain.component';

const availableModels = ['Eco-80', 'Eco-81'];

const routes: Routes = [
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  { 
    path: 'models/:modelName', 
    component: ModelDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'models',
    component: ModelsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'main', component: DashboardmainComponent },
      { path: 'users', component: UsersComponent },
      { path: 'modelos', component: ModelosComponent },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

availableModels.forEach(model => {
  routes.push({
    path: `models/${model}`,
    component: ModelDetailsComponent,
    canActivate: [AuthGuard]
  });
});

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
