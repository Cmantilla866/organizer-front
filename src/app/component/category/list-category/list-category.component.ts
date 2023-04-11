import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category } from 'src/app/entity/Category';
import { CategoryService } from 'src/app/service/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {

  categorys: Category[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns: string[] = [
    'id',
    'name',
    'type',
    'isImportant',
    'action'
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private router: Router, private _dialog: MatDialog, private categoryService: CategoryService) { } 

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList(){
    this.categoryService.getCategorys().subscribe((categorys) => {
      this.categorys = categorys;
      this.dataSource = new MatTableDataSource(categorys);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteCategory(category: Category){
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      this.categorys = this.categorys.filter(t => t.id !== category.id);
      this.dataSource = new MatTableDataSource(this.categorys);
      this.dataSource.paginator = this.paginator;
    });
  }

  addCategory(category: Category){
    this.categoryService.addCategory(category).subscribe((category) => {
      this.categorys.push(category)
      this.dataSource = new MatTableDataSource(this.categorys);
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddEditCategoryComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCategoryList();
        }
      },
    });
  }


  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditCategoryComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCategoryList();
        }
      },
    });
  }

  openToDoList(category: Category) {
    this.router.navigate(['/toDo', category.id])
  }
}
