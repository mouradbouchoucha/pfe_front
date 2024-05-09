import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { LoginComponent } from './pages/auth/login.component';
import { MenubarComponent } from './pages/menubar/menubar.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TraineeDashboardComponent } from './pages/trainee-dashboard/trainee-dashboard.component';
// import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';

const routes: Routes = [
  {path: '', redirectTo:'login',pathMatch: 'full'},
  { path: 'login', component:LoginComponent, },
  {path: 'admin',
   component: AdminDashboardComponent,
   canActivate:[AuthenticationGuard],
   data:{role:'ADMIN'},
   children: [  
      { path: 'category', component: CategoryListComponent },
      
    ]
  },
  {path: 'user', component: TraineeDashboardComponent,canActivate:[AuthenticationGuard],data:{role:'USER'}},
  // {path: 'category', component: CategoryListComponent,canActivate:[AuthenticationGuard]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
