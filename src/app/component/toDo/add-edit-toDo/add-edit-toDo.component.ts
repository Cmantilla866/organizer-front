import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { ToDoService } from 'src/app/service/to-do.service';
import { ToDo } from 'src/app/entity/ToDo';
import { Category } from 'src/app/entity/Category';
import { CategoryService } from 'src/app/service/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-toDo',
  templateUrl: './add-edit-toDo.component.html',
  styleUrls: ['./add-edit-toDo.component.scss']
})
export class AddEditToDoComponent implements OnInit{
  empForm: FormGroup;
  categories: Category[] = [];  
  showDeadline: boolean = false;

  constructor(private route: ActivatedRoute, private _dialog: MatDialog, 
    private _fb: FormBuilder,
    private toDoService: ToDoService,
    private categoryService: CategoryService,
    private _dialogRef: MatDialogRef<AddEditToDoComponent>,
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

    this.empForm = this._fb.group(newToDo);
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data.data);
    this.getCategoryList();
    this._dialogRef.updateSize('40%', '60%');
    if (this.data.data &&  this.data.data.deadline){
      this.showDeadline = true;
    }
    console.log(this.data)
  }

  getCategoryList(){
    this.categoryService.getCategorys().subscribe((categorys) => {
      this.categories = categorys;
      if (this.data.categoryId){
        this.empForm.get('categoryDTO')?.setValue(this.categories.find(a => a.id == this.data.categoryId));
      }
      if (this.data.data) {
        this.empForm.get('categoryDTO')?.setValue(this.categories.find(a => a.id == this.data.data.categoryDTO?.id));
      }
    });
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (!this.showDeadline){
        this.empForm.get('deadline')?.setValue(null);
      }
      if (this.data.data) {
        console.log("Kappa1");
        this.toDoService
          .updateToDo(this.empForm.value, this.data.data.id)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('ToDo detail updated!');
              this._dialogRef.close(true);
              location.reload();
            },
            error: (err: any) => {
              console.error(err);
              this._coreService.openSnackBar(err.error, 'error');
            },
          });
      } else {
        console.log("Kappa2");
        this.toDoService.addToDo(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('ToDo added successfully');
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

  onDeadlineChange() {
    this.showDeadline = !this.showDeadline;
  }
}
