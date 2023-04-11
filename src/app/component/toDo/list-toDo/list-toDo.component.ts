import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToDo } from 'src/app/entity/ToDo';
import { ToDoService } from 'src/app/service/to-do.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditToDoComponent } from '../add-edit-toDo/add-edit-toDo.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-toDo',
  templateUrl: './list-toDo.component.html',
  styleUrls: ['./list-toDo.component.scss']
})
export class ListToDoComponent {

  toDos: ToDo[] = [];
  categoryId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns: string[] = [
    "id",
    "name",
    "priority",
    "maxTime",
    "categoryName",
    "action"
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private router: Router, private route: ActivatedRoute, private _dialog: MatDialog, private toDoService: ToDoService) { } 

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['categoryId']){
        this.categoryId = +params['categoryId'];
        this.getToDoListByCategory(+params['categoryId']);
      } else{
        this.getToDoList();
      }
    });
  }

  getToDoList(){
    this.toDoService.getToDos().subscribe((toDos) => {
      this.toDos = toDos;
      this.dataSource = new MatTableDataSource(toDos);
      this.dataSource.paginator = this.paginator;
    });
  }

  getToDoListByCategory(categoryId: number){
    this.toDoService.getToDosByCategory(categoryId).subscribe((toDos) => {
      this.toDos = toDos;
      this.dataSource = new MatTableDataSource(toDos);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteToDo(toDo: ToDo){
    this.toDoService.deleteToDo(toDo.id).subscribe(() => {
      this.toDos = this.toDos.filter(t => t.id !== toDo.id);
      this.dataSource = new MatTableDataSource(this.toDos);
      this.dataSource.paginator = this.paginator;
    });
  }

  addToDo(toDo: ToDo){
    this.toDoService.addToDo(toDo).subscribe((toDo) => {
      this.toDos.push(toDo)
      this.dataSource = new MatTableDataSource(this.toDos);
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddEditToDoComponent, {data: {
      categoryId: this.categoryId
    }});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getToDoList();
        }
      },
    });
  }


  openEditForm(data: any) {
    console.log(data);
    const dialogRef = this._dialog.open(AddEditToDoComponent, {
      data:{
        data: data,
        categoryId: this.categoryId
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getToDoList();
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
}
