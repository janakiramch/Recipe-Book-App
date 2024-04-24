import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      'A test Recipe',
      'This is simply a test',
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.onceuponachef.com%2Frecipes%2Fbest-pancake-recipe.html&psig=AOvVaw1f_kRiK1Q_giuZ9223GoLV&ust=1708114682566000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKDwoZuVroQDFQAAAAAdAAAAABAJ'
    ),
  ];

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
