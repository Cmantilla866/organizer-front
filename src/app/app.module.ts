import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './component/general/body/body.component';
import { SidenavComponent } from './component/general/sidenav/sidenav.component';
import { DashboardComponent } from './component/general/dashboard/dashboard.component';
import { ListToDoComponent } from './component/toDo/list-toDo/list-toDo.component';
import { AddEditToDoComponent } from './component/toDo/add-edit-toDo/add-edit-toDo.component';
import { ButtonComponent } from './component/general/button/button.component';
import { ListCategoryComponent } from './component/category/list-category/list-category.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddEditCategoryComponent } from './component/category/add-edit-category/add-edit-category.component';
import { AlertBoxComponent } from './component/general/alert-box/alert-box.component';
import { ListTimeSpaceComponent } from './component/timeSpace/list-timeSpace/list-timeSpace.component';
import { AddEditTimeSpaceComponent } from './component/timeSpace/add-edit-timeSpace/add-edit-timeSpace.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { HomeComponent } from './component/home/home/home.component';
import { AddEditTaskComponent } from './component/task/add-edit-task/add-edit-task.component';
import { ListTaskComponent } from './component/task/list-task/list-task.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SpinningWheelComponent } from './component/wheel/spinning-wheel/spinning-wheel.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ButtonComponent,
    ListCategoryComponent,
    AddEditCategoryComponent,
    ListToDoComponent,
    AddEditToDoComponent,
    AlertBoxComponent,
    ListTimeSpaceComponent,
    AddEditTimeSpaceComponent,
    HomeComponent,
    AddEditTaskComponent,
    ListTaskComponent,
    SpinningWheelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true, strict: true}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
