import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeSpace } from 'src/app/entity/TimeSpace';
import { TimeSpaceService } from 'src/app/service/time-space.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditTimeSpaceComponent } from '../add-edit-timeSpace/add-edit-timeSpace.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SatisfactionLevelService } from 'src/app/service/satisfaction-level.service';


@Component({
  selector: 'app-list-timeSpace',
  templateUrl: './list-timeSpace.component.html',
  styleUrls: ['./list-timeSpace.component.scss']
})
export class ListTimeSpaceComponent {

  timeSpaces: TimeSpace[] = [];
  toDoId: number;
  taskId: number;
  date: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  time: string = "";
  level: string = "";
  
  displayedColumns: string[] = [
    "id",
    "toDoName",
    "taskName",
    "date",
    "time",
    "action"
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private satisfactionLevelService: SatisfactionLevelService
    ,private route: ActivatedRoute,
    private _dialog: MatDialog, 
    private timeSpaceService: TimeSpaceService, ) { } 

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['taskId']){
        this.taskId = +params['taskId'];
        this.toDoId = +params['toDoId'];
        this.getTimeSpaceListByTask(+params['taskId']);
      }
      else if (params['toDoId']){
        this.toDoId = +params['toDoId'];
        this.getTimeSpaceListByToDo(+params['toDoId']);
      } 
      else if (params['date']) {
        this.date = params['date'];
        this.getTimeSpaceListByDate(params['date']);
        this.getTime(params['date']);
        this.getLevel(params['date']);
      } 
      else{
        this.getTimeSpaceList();
      }
    });
  }

  getTimeSpaceList(){
    this.timeSpaceService.getTimeSpaces().subscribe((timeSpaces) => {
      this.timeSpaces = timeSpaces;
      this.dataSource = new MatTableDataSource(timeSpaces);
      this.dataSource.paginator = this.paginator;
    });
  }

  getTime(date?: string){
    this.timeSpaceService.getTimeByDate(date).subscribe(value => {
      let hour: number = +value.split(":")[0];
      let minute: number = +value.split(":")[1];
      let hours: string = hour != 1 ? "s" : "";
      let minutes: string = minute != 1 ? "s" : "";
      if (hour != 0 && minute != 0){
        this.time = ": " + hour + " Hour"+hours+" and " + minute + " Minute"+minutes;
      } else if (hour != 0){
        this.time = ": " + hour + " Hour"+hours;
      } else if (minute != 0){
        this.time = ": " + minute + " Minute"+minutes;
      } else{
        this.time = "";
      }
    });
  }

  getLevel(date?: string){
    this.satisfactionLevelService.getSatisfactionLevelByDate(date).subscribe(value => {
      this.level = "Satisfaction Level: " + value.level;
    });
  }

  getTimeSpaceListByDate(date?: string){
    this.timeSpaceService.getTimeSpacesByDate(date).subscribe((timeSpaces) => {
      this.timeSpaces = timeSpaces;
      this.dataSource = new MatTableDataSource(timeSpaces);
      this.dataSource.paginator = this.paginator;
    });
  }

  getTimeSpaceListByToDo(toDoId?: number){
    this.timeSpaceService.getTimeSpacesByToDo(toDoId).subscribe((timeSpaces) => {
      this.timeSpaces = timeSpaces;
      this.dataSource = new MatTableDataSource(timeSpaces);
      this.dataSource.paginator = this.paginator;
    });
  }

  getTimeSpaceListByTask(taskId?: number){
    this.timeSpaceService.getTimeSpacesByTask(taskId).subscribe((timeSpaces) => {
      this.timeSpaces = timeSpaces;
      this.dataSource = new MatTableDataSource(timeSpaces);
      this.dataSource.paginator = this.paginator;
    });
  }


  deleteTimeSpace(timeSpace: TimeSpace){
    this.timeSpaceService.deleteTimeSpace(timeSpace.id).subscribe(() => {
      this.timeSpaces = this.timeSpaces.filter(t => t.id !== timeSpace.id);
      this.dataSource = new MatTableDataSource(this.timeSpaces);
      this.dataSource.paginator = this.paginator;

      if (this.date){
        this.getTime(this.date);
        this.getLevel(this.date);
      }
    });
  }

  addTimeSpace(timeSpace: TimeSpace){
    this.timeSpaceService.addTimeSpace(timeSpace).subscribe((timeSpace) => {
      this.timeSpaces.push(timeSpace)
      this.dataSource = new MatTableDataSource(this.timeSpaces);
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddEditTimeSpaceComponent, {
      data:{
        toDoId: this.toDoId,
        taskId: this.taskId,
        date: this.date
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTimeSpaceList();
        }
      },
    });
  }


  openEditForm(data: any) {
    console.log(data);
    const dialogRef = this._dialog.open(AddEditTimeSpaceComponent, {
      data:{
        data: data,
        toDoId: this.toDoId,
        taskId: this.taskId,
        date: this.date
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTimeSpaceList();
        }
      },
    });
  }
}
