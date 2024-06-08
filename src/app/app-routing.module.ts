import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { LoginComponent } from './pages/auth/login.component';
import { MenubarComponent } from './pages/menubar/menubar.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TraineeDashboardComponent } from './pages/trainee-dashboard/trainee-dashboard.component';
import { TrainerListComponent } from './pages/trainer-list/trainer-list.component';
import { TraineeListComponent } from './pages/trainee-list/trainee-list.component';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { ViewCourseComponent } from './components/course/view-course/view-course.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AddCourseComponent } from './components/course/add-course/add-course.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { VerifyComponent } from './pages/auth/verify/verify/verify.component';
import { ScheduleListComponent } from './components/schedule/scheduleList/schedule-list/schedule-list.component';
// import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';

const routes: Routes = [
  { path: 'verify', component: VerifyComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthenticationGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'category', component: CategoryListComponent },
      { path: 'trainers', component: TrainerListComponent },
      { path: 'trainees', component: TraineeListComponent },
      { path: 'courses', component: CoursesListComponent },
      { path: 'courses/details/:id', component: ViewCourseComponent },
      { path: 'courses/details/:id/schedule/:id', component: ScheduleListComponent},
      { path: 'courses', component: ViewCourseComponent },
      { path: 'courses/add', component: AddCourseComponent },
      { path: 'courses/edit/:id', component: EditCourseComponent }
    ]
  },
  {
    path: 'trainer',
    component: AdminDashboardComponent,
    canActivate: [AuthenticationGuard],
    data: { role: 'TRAINER' },
    children: [
      { path: 'category', component: CategoryListComponent },
      { path: 'trainees', component: TraineeListComponent }
    ]
  },
  {
    path: 'user',
    component: TraineeDashboardComponent,
    canActivate: [AuthenticationGuard],
    data: { role: 'USER' },
    children: [
      { path: 'profile', component: UserProfileComponent }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
