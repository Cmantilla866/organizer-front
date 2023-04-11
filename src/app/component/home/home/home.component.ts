import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { TimeSpaceService } from 'src/app/service/time-space.service';
import { TimeSpace } from 'src/app/entity/TimeSpace';
import { Category } from 'src/app/entity/Category';
import { CategoryService } from 'src/app/service/category.service';
import { ToDo } from 'src/app/entity/ToDo';
import { ToDoService } from 'src/app/service/to-do.service';
import { Task } from 'src/app/entity/Task';
import { TaskService } from 'src/app/service/task.service';
import { DarkModeService } from 'src/app/service/dark-mode.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditToDoComponent } from '../../toDo/add-edit-toDo/add-edit-toDo.component';
import { Router } from '@angular/router';
import { SatisfactionLevel } from 'src/app/entity/SatisfactionLevel';
import { SatisfactionLevelService } from 'src/app/service/satisfaction-level.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  empForm: FormGroup;
  taskForm: FormGroup;
  includeForm: FormGroup;
  excludeForm: FormGroup;
  satisfactionLevelForm: FormGroup;
  toDos: ToDo[] = [];  
  tasks: Task[] = [];
  categories: string[] = []; 
  selected: ToDo;
  darkMode: boolean;
  subscription: Subscription;
  todayTime: string;

  importantToDos: ToDo[] = [];
  
  displayedColumns: string[] = [
    "categoryName",
    "name",
    "priority",
    "jumpStart",
    "action"
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private satisfactionLevelService: SatisfactionLevelService ,private router: Router, 
    private _dialog: MatDialog, 
    private darkModeService: DarkModeService, 
    private _fb: FormBuilder,
    private timeSpaceService: TimeSpaceService,
    private toDoService: ToDoService,
    private taskService: TaskService,
    private _coreService: CoreService,
    private categoryService: CategoryService
  ) {
    this.subscription = this.darkModeService.onToggle().subscribe((value) => this.darkMode = value);
    const newCategory: Category = {
      name: '',
      type: '',
      isImportant: false
    };

    const newToDo: ToDo = {
      name: "",
      description: "",
      jumpStart: "",
      priority: 0,
      deadline: new Date(),
      maxTime: 0,
      categoryDTO: newCategory
    };

    const newTask: Task = {
      name: "",
      description: "",
      jumpStart: "",
      toDoDTO: newToDo
    };

    const newTimeSpace: TimeSpace = {
      toDoDTO: newToDo,
      taskDTO: newTask,
      date: new Date(),
      time: 15
    };

    const newSatisfactionLevel: SatisfactionLevel = {
      date: new Date(),
      level: 6
    }

    const newIncludeRandom = {
      categories: [],
      important: false
    }

    const newExcludeRandom = {
      categories: [],
      important: false
    }

    this.empForm = this._fb.group(newTimeSpace);
    this.taskForm = this._fb.group(newTask);
    this.satisfactionLevelForm = this._fb.group(newSatisfactionLevel);
    this.includeForm = this._fb.group(newIncludeRandom);
    this.excludeForm = this._fb.group(newExcludeRandom);
  }

  ngOnInit(): void {
    this.getToDoList(true);
    this.getImportantToDoList();
    this.getSatisfactionLevel();
    this.getTodayTime();
    this.getCategoryList();
  }

  getTodayTime(){
    this.timeSpaceService.getTimeByDate(this.fromDateToString(new Date)).subscribe(value => {
      this.todayTime = "Today: " + value.split(":")[0] + " Hours and " + value.split(":")[1] + " Minutes";
    });
  }

  fromDateToString(date: Date):string{
    const yyyy = date.getFullYear();
    let m = date.getMonth() + 1; // Months start at 0!
    let d = date.getDate();
    let dd = (d < 10) ? '0' + d : d;
    let mm = (m < 10) ? '0' + m : m;

    const formattedDate = yyyy + '-' + mm + '-' + dd;

    return formattedDate;
  }


  getSatisfactionLevel(){
    console.log("wenas");
    let date: Date = this.satisfactionLevelForm.get('date')?.value;

    this.satisfactionLevelService.getSatisfactionLevelByDate(this.fromDateToString(date)).subscribe(value => {
      if (value) {
        this.satisfactionLevelForm.get('level')?.setValue(value.level);
      }
      else{
        this.satisfactionLevelForm.get('level')?.setValue(6);
      }
    });
  }

  getImportantToDoList(){
    this.toDoService.getImportantToDos().subscribe((importantToDos) => {
      this.importantToDos = importantToDos;
      this.dataSource = new MatTableDataSource(importantToDos);
    });
  }

  onToDoSelected(event: any) {
    this.getTaskList(false, event.value.id);
  }

  getToDoList(init: boolean){
    this.toDoService.getToDos().subscribe((toDos) => {
      this.toDos = toDos;
      this.setLastToDo(init, toDos);
    });
  }

  getCategoryList(){
    this.categoryService.getCurrentTypes().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getTaskList(init: boolean, toDoId?: number, ){
    this.taskService.getTasksByToDo(toDoId).subscribe((tasks) => {
      this.tasks = tasks;
      if (init){
        this.setLastTask(tasks);
      }
      if (tasks.length === 0){
        this.empForm.get('taskDTO')?.setValue(null);
      }
      //tasks.unshift({});
    });
  }

  setLastToDo(init: boolean, toDos: ToDo[]){
    this.timeSpaceService.getLastTimeSpace()?.subscribe((timeSpace) => {
      this.empForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == timeSpace.toDoDTO.id));
      this.taskForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == timeSpace.toDoDTO.id));
      if (this.empForm.get('toDoDTO')?.value.id){
        this.getTaskList(init, this.empForm.get('toDoDTO')?.value.id);
      }
    });
  }

  setLastTask(tasks: Task[]){
    this.timeSpaceService.getLastTimeSpace()?.subscribe((timeSpace) => (this.empForm.get('taskDTO')?.setValue(this.tasks.find(a => (timeSpace.taskDTO) && (a.id == timeSpace.taskDTO.id)))));
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      this.timeSpaceService.addTimeSpace(this.empForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('TimeSpace added successfully');
          location.reload();
        },
        error: (err: any) => {
          console.error(err);
          this._coreService.openSnackBar(err.error, 'error');
        },
      });
    }
  }

  onTaskFormSubmit() {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Task added successfully');
          location.reload();
        },
        error: (err: any) => {
          console.error(err);
          this._coreService.openSnackBar(err.error, 'error');
        },
      });
    }
  }

  deleteToDo(toDo: ToDo){
    this.toDoService.deleteToDo(toDo.id).subscribe(() => {
      this.importantToDos = this.importantToDos.filter(t => t.id !== toDo.id);
      this.dataSource = new MatTableDataSource(this.importantToDos);
    });
  }

  addToDo(toDo: ToDo){
    this.toDoService.addToDo(toDo).subscribe((toDo) => {
      this.importantToDos.push(toDo)
      this.dataSource = new MatTableDataSource(this.importantToDos);
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddEditToDoComponent, {
      data:{
        data: null
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getImportantToDoList();
        }
      },
    });
  }


  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditToDoComponent, {
      data:{
        data: data
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getImportantToDoList();
        }
      },
    });
  }

  openTaskList(toDo: ToDo) {
    this.router.navigate(['/task', toDo.id])
  }

  openTimeSpaceList(toDo: ToDo) {
    this.router.navigate(['/timeSpace', toDo.id])
  }

  openTimeSpaceListByDate() {
    this.router.navigate(['/timeSpace/date', this.fromDateToString(this.satisfactionLevelForm.get('date')?.value)])
  }

  onSatisfactionLevelFormSubmit(){
    if (this.satisfactionLevelForm.valid){
      this.satisfactionLevelService.addSatisfactionLevel(this.satisfactionLevelForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Satisfaction Level added successfully');
          location.reload();
        },
        error: (err: any) => {
          console.error(err);
          this._coreService.openSnackBar(err.error, 'error');
        },
      });
    }
  }

  onIncludeFormSubmit(){
    if (this.includeForm.valid){
      this.toDoService.getRandomToDo(this.includeForm.get("categories")?.value, true, this.includeForm.get("important")?.value).subscribe((randomDTO) => {
        this.dataSource = new MatTableDataSource([randomDTO]);
        this.empForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == randomDTO.id));
        this.taskForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == randomDTO.id));
        this.getTaskList(false, this.empForm.get('toDoDTO')?.value.id);
      });
    }
  }

  onExcludeFormSubmit(){
    if (this.excludeForm.valid){
      this.toDoService.getRandomToDo(this.excludeForm.get("categories")?.value, false, this.excludeForm.get("important")?.value).subscribe((randomDTO) => {
        this.dataSource = new MatTableDataSource([randomDTO]);
        this.empForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == randomDTO.id));
        this.taskForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == randomDTO.id));
        this.getTaskList(false, this.empForm.get('toDoDTO')?.value.id);
      });
    }
  }
}
