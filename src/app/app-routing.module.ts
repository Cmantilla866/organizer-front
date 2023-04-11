import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoryComponent } from './component/category/list-category/list-category.component';
import { ListTimeSpaceComponent } from './component/timeSpace/list-timeSpace/list-timeSpace.component';
import { ListToDoComponent } from './component/toDo/list-toDo/list-toDo.component';
import { HomeComponent } from './component/home/home/home.component';
import { ListTaskComponent } from './component/task/list-task/list-task.component';
import { SpinningWheelComponent } from './component/wheel/spinning-wheel/spinning-wheel.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'category', component: ListCategoryComponent},
  {path: 'timeSpace', component: ListTimeSpaceComponent},
  {path: 'timeSpace/date/:date', component: ListTimeSpaceComponent},
  {path: 'timeSpace/:toDoId', component: ListTimeSpaceComponent},
  {path: 'timeSpace/:toDoId/:taskId', component: ListTimeSpaceComponent},
  {path: 'toDo', component: ListToDoComponent},
  {path: 'toDo/:categoryId', component: ListToDoComponent},
  {path: 'task', component: ListTaskComponent},
  {path: 'task/:toDoId', component: ListTaskComponent},
  {path: 'wheel', component: SpinningWheelComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
