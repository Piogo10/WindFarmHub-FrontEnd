import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ModelsComponent } from './pages/models/models.component';
import { AuthGuard } from './services/auth-guard.service';
import { ModelDetailsComponent } from './pages/model-details/model-details.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/slidebar/users/users.component';
import { ModelosComponent } from './pages/slidebar/modelos/modelos.component';
import { DashboardmainComponent } from './pages/slidebar/dashboardmain/dashboardmain.component';
import { ProductsComponent } from './pages/slidebar/items/items.component';
import { ModelClosetDetailsComponent } from './pages/model-closet-details/model-closet-details.component';
import { UserService } from './services/user.service';
import { ModelService } from './services/model.service';


const availableClosetsByModel = {
  'Eco-80': ['conversor-de-potencia'],
  'Eco-81': ['Closet3', 'Closet4']
};

@Injectable({
  providedIn: 'root'
})
export class VerifyModelsGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService, private modelService: ModelService) {}

  model: any = {};
  modelName = '';
  availableModels: string[] = [];

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const modelName = route.paramMap.get('modelName');
    const closetName = route.paramMap.get('closetName');

    const response = await this.userService.getUserInfo();
    if (response) {
      const { id } = response;
      const models = await this.modelService.getModelsByUserId(id);
      this.model = models.find((model: { name: string }) => model.name === this.modelName);
      this.availableModels = models.map((model: { name: string }) => model.name); // Assign the value here
    }

    if (modelName && this.availableModels.includes(modelName)) { // Use this.availableModels
      if (!closetName || (availableClosetsByModel[modelName as keyof typeof availableClosetsByModel] && availableClosetsByModel[modelName as keyof typeof availableClosetsByModel].includes(closetName))) {
        return true;
      }
    }

    this.router.navigate(['/home']);
    return false;
  }
}


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'models/:modelName', 
    component: ModelDetailsComponent,
    canActivate: [AuthGuard, VerifyModelsGuard]
  },
  {
    path: 'models/:modelName/:closetName',
    component: ModelClosetDetailsComponent,
    canActivate: [AuthGuard, VerifyModelsGuard]
  },
  { path: 'models', component: ModelsComponent, canActivate: [AuthGuard] },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'main', component: DashboardmainComponent },
      { path: 'users', component: UsersComponent },
      { path: 'modelos', component: ModelosComponent },
      { path: 'produtos', component: ProductsComponent}
    ],
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
