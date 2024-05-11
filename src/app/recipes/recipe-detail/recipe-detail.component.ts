import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import * as _ from 'lodash';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}
  ingredients = [];
  recipeCopied;
  ngOnInit(): void {
    //const id = this.route.snapshot.params['id'];
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });
    if (this.recipe == undefined) {
      this.router.navigate(['/recipes']);
    }
    console.log(this.recipe);

    console.log('hi');
    this.dataStorageService.fetchShoppingList().subscribe((ingredients) => {
      if (ingredients?.length > 0) {
        this.ingredients = ingredients;
      }
      console.log(this.ingredients);
    });
  }

  onAddToShoppingList(ingredient, mode) {
    this.recipeCopied = _.cloneDeep(this.recipe);
    let flag = false;
    if (mode == 'single') {
      let ing: Ingredient = {};
      console.log(this.ingredients, ingredient);
      if (this.ingredients.length > 0) {
        this.ingredients.forEach((ingredientsaved) => {
          console.log(ingredientsaved, ingredient);
          if (ingredient.name == ingredientsaved.name) {
            console.log(ingredient);
            // ing.name = ingredient.name;
            ingredientsaved.amount = ingredient.amount + ingredientsaved.amount;
            flag = true;
          }
        });
        if (!flag) {
          this.ingredients.push(ingredient);
        }

        this.dataStorageService.storeShoppingListIngredients(this.ingredients);
      } else {
        this.dataStorageService.storeShoppingListIngredients([ingredient]);
      }
    } else {
      console.log(this.recipe.ingredients);
      this.recipe.ingredients.forEach((ingredient1) => {
        let ing: Ingredient = {};
        // console.log(this.ingredients, ingredient);
        if (this.ingredients.length > 0) {
          this.ingredients.forEach((ingredientsaved) => {
            console.log(ingredientsaved, ingredient1);
            if (ingredient1.name == ingredientsaved.name) {
              console.log(ingredient);
              // ing.name = ingredient.name;
              ingredientsaved.amount =
                ingredient1.amount + ingredientsaved.amount;
              flag = true;
            }
          });
          if (!flag) {
            this.ingredients.push(ingredient1);
          }
          this.dataStorageService.storeShoppingListIngredients(
            this.ingredients
          );
        } else {
          this.dataStorageService.storeShoppingListIngredients([ingredient1]);
        }
      });
    }

    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    //this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
