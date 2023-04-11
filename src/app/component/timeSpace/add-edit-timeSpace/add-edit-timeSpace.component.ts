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

@Component({
  selector: 'app-add-edit-timeSpace',
  templateUrl: './add-edit-timeSpace.component.html',
  styleUrls: ['./add-edit-timeSpace.component.scss']
})
export class AddEditTimeSpaceComponent implements OnInit{
  empForm: FormGroup;
  toDos: ToDo[] = [];  
  tasks: Task[] = [];

  constructor(private _dialog: MatDialog, 
    private _fb: FormBuilder,
    private timeSpaceService: TimeSpaceService,
    private toDoService: ToDoService,
    private _dialogRef: MatDialogRef<AddEditTimeSpaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private taskService: TaskService
  ) {
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
      time: 0
    };

    this.empForm = this._fb.group(newTimeSpace);
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data.data);
    this.getToDoList();
    this._dialogRef.updateSize('40%', '42%');
    if (this.data.date){
      let date = new Date(this.data.date);
      date.setMinutes( date.getMinutes() + date.getTimezoneOffset());
      this.empForm.get('date')?.setValue(date);
      console.log(date);
    }
  }

  getToDoList(){
    console.log(this.data);
    this.toDoService.getToDos().subscribe((toDos) => {
      this.toDos = toDos;
      if (this.data.data) {
        this.empForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == this.data.data.toDoDTO.id));
        this.getTaskList(this.data.data.toDoDTO.id);
      } else if (this.data.toDoId) {
        console.log(this.data.toDoId);
        this.empForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == this.data.toDoId));
        this.getTaskList(this.data.toDoId);
      }
    });
  }

  getTaskList(toDoId?: number){
    this.taskService.getTasksByToDo(toDoId).subscribe((tasks) => {
      this.tasks = tasks;
      if (this.data.data) {
        this.empForm.get('taskDTO')?.setValue(this.tasks.find(a => a.id == this.data.data.taskDTO?.id));
      } else if (this.data.taskId) {
        console.log(this.data.taskId);
        this.empForm.get('taskDTO')?.setValue(this.tasks.find(a => a.id == this.data.taskId));
      }
    });
  }

  onToDoSelected(event: any) {
    this.getTaskList(event.value.id);
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data.data) {
        this.timeSpaceService
          .updateTimeSpace(this.empForm.value, this.data.data.id)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('TimeSpace detail updated!');
              this._dialogRef.close(true);
              location.reload();
            },
            error: (err: any) => {
              console.error(err);
              this._coreService.openSnackBar(err.error, 'error');
            },
          });
      } else {
        this.timeSpaceService.addTimeSpace(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('TimeSpace added successfully');
            this._dialogRef.close(true);
            location.reload();
          },
          error: (err: any) => {
            console.error(err);
            this._coreService.openSnackBar(err.error, 'error');
          },
        });
      }
    }
  }
}
