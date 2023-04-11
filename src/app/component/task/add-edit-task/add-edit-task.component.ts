import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { TaskService } from 'src/app/service/task.service';
import { Task } from 'src/app/entity/Task';
import { ToDo } from 'src/app/entity/ToDo';
import { Category } from 'src/app/entity/Category';
import { CategoryService } from 'src/app/service/category.service';
import { ToDoService } from 'src/app/service/to-do.service';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.scss']
})
export class AddEditTaskComponent implements OnInit {
  taskForm: FormGroup;
  toDos: ToDo[] = [];  

  constructor(private _dialog: MatDialog, 
    private _fb: FormBuilder,
    private taskService: TaskService,
    private toDoService: ToDoService,
    private _dialogRef: MatDialogRef<AddEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
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
    }

    this.taskForm = this._fb.group(newTask);
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data.data);
    this.getToDoList();
    this._dialogRef.updateSize('40%', '65%');
    console.log(this.data)
  }

  getToDoList(){
    this.toDoService.getToDos().subscribe((toDos) => {
      this.toDos = toDos;
      if (this.data.toDoId) {
        this.taskForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == this.data.toDoId));
      }
      if (this.data.data) {
        this.taskForm.get('toDoDTO')?.setValue(this.toDos.find(a => a.id == this.data.data.toDoDTO?.id));
      }
    });
  }

  onFormSubmit() {
    if (this.taskForm.valid) {
      if (this.data.data) {
        this.taskService
          .updateTask(this.taskForm.value, this.data.data.id)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Task detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              this._coreService.openSnackBar(err.error, 'error');
            },
          });
      } else {
        this.taskService.addTask(this.taskForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Task added successfully');
            this._dialogRef.close(true);
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
