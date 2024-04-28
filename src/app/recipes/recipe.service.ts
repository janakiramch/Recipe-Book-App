import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A test Recipe',
      'This is simply a test',
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.onceuponachef.com%2Frecipes%2Fbest-pancake-recipe.html&psig=AOvVaw1f_kRiK1Q_giuZ9223GoLV&ust=1708114682566000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKDwoZuVroQDFQAAAAAdAAAAABAJ',
      [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }
}
