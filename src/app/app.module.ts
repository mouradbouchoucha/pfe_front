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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
