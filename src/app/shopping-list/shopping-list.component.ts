import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subject, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { DataStorageService } from '../shared/data-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  ingredients: Ingredient[] = [];
  private igChangedSub: Subscription;
  subscription: Subscription;
  ingredientsChanged = new Subject<Ingredient[]>();

  editMode = false;
  editedItemIndex: number;
  editeditem: Ingredient;
  constructor(
    private slService: ShoppingListService,
    private loggingService: LoggingService,
    private dataService: DataStorageService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.dataService.fetchShoppingList().subscribe((ingredients) => {
      this.ingredients = ingredients;
      console.log(this.ingredients);
    });
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editeditem = this.ingredients[index];
        setTimeout(() => {
          this.slForm.setValue({
            name: this.editeditem.name,
            amount: this.editeditem.amount,
          });
        });
      }
    );
    this.igChangedSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );

    this.loggingService.printLog('Hello from Shopping List Component NgonInit');
  }

  ngOnDestroy(): void {
    this.igChangedSub.unsubscribe();
    this.subscription.unsubscribe();
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    let flag = false;
    if (this.editMode) {
      let ing: Ingredient = {};
      if (this.ingredients.length > 0) {
        this.ingredients.forEach((ingredientsaved) => {
          console.log(ingredientsaved);
          if (newIngredient.name == ingredientsaved.name) {
            // console.log(ingredient);
            // ing.name = ingredient.name;
            ingredientsaved.amount = newIngredient.amount;
          }
        });
        this.dataStorageService.storeShoppingListIngredients(this.ingredients);
      }
      // this.dataService.storeShoppingListIngredients(this.editedItemIndex);
    } else {
      if (this.ingredients?.length > 0) {
        this.ingredients.forEach((ingredientsaved) => {
          // console.log(ingredientsaved, ingredient);
          if (newIngredient.name == ingredientsaved.name) {
            // console.log(ingredient);
            // ing.name = ingredient.name;
            ingredientsaved.amount =
              newIngredient.amount + ingredientsaved.amount;
            flag = true;
          }
        });
        if (!flag) {
          this.ingredients.push(newIngredient);
        }
        this.dataStorageService.storeShoppingListIngredients(this.ingredients);
      } else {
        this.ingredients.push(newIngredient);
        this.dataStorageService.storeShoppingListIngredients([newIngredient]);
      }
    }
    this.editMode = false;
    form.reset();
  }
  onDelete() {
    this.ingredients.splice(this.editedItemIndex, 1);

    this.dataStorageService.deleteShoppingListIngredients(this.ingredients);
    this.ingredients = [...this.ingredients];
    this.onClear();

    // this.ngOnInit();
  }
  public trackItem(index: number, item: Ingredient) {
    return item.name;
  }
  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }
  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
}
