import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { MaterialModule } from './material.module';
import { MenubarComponent } from './pages/menubar/menubar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/auth/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TraineeDashboardComponent } from './pages/trainee-dashboard/trainee-dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { EditCategoryMadalComponent } from './components/edit-category-madal/edit-category-madal.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { TrainerListComponent } from './pages/trainer-list/trainer-list.component';
import { NewTrainerComponent } from './components/trainer/new-trainer/new-trainer.component';
import { ViewTrainerComponent } from './components/trainer/view-trainer/view-trainer.component';
import { EditTrainerComponent } from './components/trainer/edit-trainer/edit-trainer.component';
import { TraineeListComponent } from './pages/trainee-list/trainee-list.component';
import { NewTraineeComponent } from './components/trainee/new-trainee/new-trainee.component';
import { EditTraineeComponent } from './components/trainee/edit-trainee/edit-trainee.component';
import { ViewTraineeComponent } from './components/trainee/view-trainee/view-trainee.component';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { EditCourseComponent } from './components/course/edit-course/edit-course.component';
import { AddCourseComponent } from './components/course/add-course/add-course.component';
import { ViewCourseComponent } from './components/course/view-course/view-course.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { ScheduleListComponent } from './components/schedule/scheduleList/schedule-list/schedule-list.component';
import { AddScheduleModalComponent } from './components/schedule/add-schedule-modal/add-schedule-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EditScheduleModalComponent } from './components/schedule/edit-schedule-modal/edit-schedule-modal/edit-schedule-modal.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileEditComponent } from './components/user/profile-edit/profile-edit.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { CenterFrontComponent } from './pages/center-front/center-front.component';
import { CoursesComponent } from './pages/center-front/courses/courses.component';
import { CenterComponent } from './pages/center-front/center/center.component';
import { TrainerDashboardComponent } from './pages/trainer-dashboard/trainer-dashboard.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PreInscriptionListComponent } from './pages/pre-inscription-list/pre-inscription-list.component';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Enregistrez les données de la locale française
registerLocaleData(localeFr, 'fr');

const plugins = [timeGridPlugin];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewCategoryComponent,
    CategoryCardComponent,
    CategoryListComponent,
    MenubarComponent,
    AdminDashboardComponent,
    TraineeDashboardComponent,
    UserListComponent,
    EditCategoryMadalComponent,
    DialogConfirmComponent,
    TrainerListComponent,
    NewTrainerComponent,
    ViewTrainerComponent,
    EditTrainerComponent,
    TraineeListComponent,
    NewTraineeComponent,
    EditTraineeComponent,
    ViewTraineeComponent,
    CoursesListComponent,
    EditCourseComponent,
    AddCourseComponent,
    ViewCourseComponent,
    UserProfileComponent,
    ScheduleListComponent,
    AddScheduleModalComponent,
    EditScheduleModalComponent,
    NotFoundComponent,
    ProfileEditComponent,
    SignInComponent,
    SignUpComponent,
    AuthComponent,
    CenterFrontComponent,
    CoursesComponent,
    TrainerDashboardComponent,
    CenterComponent,
    PreInscriptionListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    // NgxSpinnerModule
  ],
  providers: [
     [{ provide: LOCALE_ID, useValue: 'fr-FR' }]

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent],
  entryComponents: [AddScheduleModalComponent]
})
export class AppModule { }
