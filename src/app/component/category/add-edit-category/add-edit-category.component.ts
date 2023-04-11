import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/entity/Category';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit{
  catForm: FormGroup;
  types: string[] = [];

  constructor(
    private _fb: FormBuilder,
    private categoryService: CategoryService,
    private _dialogRef: MatDialogRef<AddEditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private _coreService: CoreService
  ) {
    const newTask: Category = {
      name: '',
      type: '',
      isImportant: false
    };

    this.catForm = this._fb.group(newTask);
  }

  ngOnInit(): void {
    this.catForm.patchValue(this.data);
    this.categoryService.getCurrentTypes().subscribe((types) => {
      this.types = types;
    });
  }

  onFormSubmit() {
    if (this.catForm.valid) {
      if (this.data) {
        console.log(this.data);
        this.categoryService
          .updateCategory(this.catForm.value, this.data.id)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Category detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this.categoryService.addCategory(this.catForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Category added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
