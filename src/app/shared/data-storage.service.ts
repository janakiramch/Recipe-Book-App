import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { Observable, exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private shoppinglistservice: ShoppingListService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-book-b8d1b-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  storeShoppingListIngredients(ingredients: Ingredient[]) {
    console.log('123', ingredients);
    this.http
      .put(
        'https://recipe-book-b8d1b-default-rtdb.firebaseio.com/ingredients.json',
        ingredients
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
  deleteShoppingListIngredients(ingredients: Ingredient[]) {
    // const ingredientId = ingredient.name;
    console.log(ingredients);
    const nullIngredient: Ingredient = { name: null, amount: null }; // Placeholder ingredient

    return this.http
      .put<any>(
        `https://recipe-book-b8d1b-default-rtdb.firebaseio.com/ingredients.json`,
        ingredients
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipe-book-b8d1b-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
  fetchShoppingList(): Observable<Ingredient[]> {
    return this.http
      .get<Ingredient[]>(
        'https://recipe-book-b8d1b-default-rtdb.firebaseio.com/ingredients.json'
      )
      .pipe(
        map((recipes) => {
          return recipes?.map((ingredient) => {
            return {
              ...ingredient,
            };
          });
        })
      );
  }
}
