import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader} from './views/base';

/*Global State of the app which contains 
* Search Object
* Current Recipe Object
* Shopping List Object
* Liked Recipes
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

        //Search for recipes
        res = await state.search.getResults();

        //render results on UI
        clearLoader();
        searchView.renderResults(res);
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