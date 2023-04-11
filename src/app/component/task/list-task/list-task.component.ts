import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/entity/Task';
import { TaskService } from 'src/app/service/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent {

  tasks: Task[] = [];
  toDoId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns: string[] = [
    "id",
    "toDoName",
    "name",
    "description",
    "jumpStart",
    "action"
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private router: Router, private route: ActivatedRoute, private _dialog: MatDialog, private taskService: TaskService) { } 

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['toDoId']){
        this.toDoId = +params['toDoId'];
        this.getTaskListByToDo(+params['toDoId']);
      } else{
        this.getTaskList();
      }
    });
  }

  getTaskList(){
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.paginator = this.paginator;
    });
  }

  getTaskListByToDo(toDoId: number){
    this.taskService.getTasksByToDo(toDoId).subscribe((tasks) => {
      this.tasks = tasks;
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteTask(task: Task){
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.dataSource = new MatTableDataSource(this.tasks);
      this.dataSource.paginator = this.paginator;
    });
  }

  addTask(task: Task){
    this.taskService.addTask(task).subscribe((task) => {
      this.tasks.push(task)
      this.dataSource = new MatTableDataSource(this.tasks);
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddEditTaskComponent, {data: {
      toDoId: this.toDoId
    }});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
    });
  }


  openEditForm(data: any) {
    console.log(data);
    const dialogRef = this._dialog.open(AddEditTaskComponent, {
      data: {
        data: data,
        toDoId: this.toDoId
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
    });
  }

  openTimeSpaceList(task: Task) {
    this.router.navigate(['/timeSpace', task.toDoDTO?.id, task.id])
  }
}
