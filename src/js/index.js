import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';

/*Global State of the app which contains 
* Search Object
* Current Recipe Object
* Shopping List Object
* Liked Recipes
*/

/*
**Search Controller
*/
const state = {};
let res;

//Function to control search
const controlSearch = async () => {

    //Get query from view
    const query = searchView.getInput(); 

    if (query){
        
        //New Search object and add it to state
        state.search = new Search(query);

        //prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);
        try{
            //Search for recipes
            res = await state.search.getResults();

            //render results on UI
            searchView.renderResults(res);
            clearLoader();
        }
        catch(error){
            console.log(error);
            alert('Something went wrong with the search...');
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if(button){
        const gotToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(res, gotToPage);
    } 

});

/*
**Recipe Controller
*/

const controlRecipe = async () => {
    //Getting ID from URL
    const id = window.location.hash.replace('#', '');
    if (id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight Selector
        if (state.search){
            searchView.highlightSelected(id);
        }

        //Create New Recipe Object
        state.recipe = new Recipe(id);

        try{
            //Get Recipe Data and parse ingredients
            await state.recipe.getRecipe(); 
            state.recipe.parseIngredients();

            //Calculate Servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render Recipe to the UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }
        catch(error){
            console.log(error);
            alert('Error Processing Recipe!');
        }

    }
}

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

//handling recipe button clicks
elements.recipe.addEventListener('click', event => {
    if ( event.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease is clicked
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if ( event.target.matches('.btn-increase, .btn-increase *')){
        // decrease is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
})

window.l = new List();