import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { LoginComponent } from './pages/auth/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TraineeDashboardComponent } from './pages/trainee-dashboard/trainee-dashboard.component';
import { TrainerListComponent } from './pages/trainer-list/trainer-list.component';
import { TraineeListComponent } from './pages/trainee-list/trainee-list.component';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { ViewCourseComponent } from './components/course/view-course/view-course.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AddCourseComponent } from './components/course/add-course/add-course.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ScheduleListComponent } from './components/schedule/scheduleList/schedule-list/schedule-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { VerifyComponent } from './pages/auth/verify/verify/verify.component';
import { ProfileEditComponent } from './components/user/profile-edit/profile-edit.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { CenterFrontComponent } from './pages/center-front/center-front.component';
import { PreInscriptionListComponent } from './pages/pre-inscription-list/pre-inscription-list.component';

const routes: Routes = [
  // { path: 'verify', component: VerifyComponent },
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'auth', component: AuthComponent},
  { path: 'verify', component: VerifyComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: CenterFrontComponent},
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
      { path: 'courses/add', component: AddCourseComponent },
      { path: 'courses/edit/:id', component: EditCourseComponent },
      { path: 'courses/details/:id', component: ViewCourseComponent },
      { path: 'courses/details/:courseId/schedule/:scheduleId', component: ScheduleListComponent },
      { path: 'preinscriptions', component: PreInscriptionListComponent}
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
      { path: 'profile', component: UserProfileComponent },
      { path: 'profile/edit', component: ProfileEditComponent }
    ]
  },
   { path: '**', component:NotFoundComponent }  // Wildcard route for handling 404 errors
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
