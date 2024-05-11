import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editeditem: Ingredient;
  ingredients;
  constructor(
    private slService: ShoppingListService,
    private dataStorageService: DataStorageService
  ) {}
  ngOnInit(): void {
    this.dataStorageService.fetchShoppingList().subscribe((ingredients) => {
      if (ingredients?.length > 0) {
        this.ingredients = ingredients;
      }
      console.log(this.ingredients);
    });
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editeditem = this.ingredients[index];
        this.slForm?.setValue({
          name: this.editeditem.name,
          amount: this.editeditem.amount,
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    let flag = false;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      let ing: Ingredient = {};
      if (this.ingredients.length > 0) {
        this.ingredients.forEach((ingredientsaved) => {
          console.log(ingredientsaved);
          if (newIngredient.name == ingredientsaved.name) {
            // console.log(ingredient);
            // ing.name = ingredient.name;
            ingredientsaved.amount = newIngredient.amount;
            flag = true;
          }
        });
        this.dataStorageService.storeShoppingListIngredients(this.ingredients);
      }
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.ingredients.splice(this.editedItemIndex, 1);
    this.dataStorageService.deleteShoppingListIngredients(this.ingredients);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
