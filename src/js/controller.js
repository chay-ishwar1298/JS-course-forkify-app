import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpinner();
    resultView.update(model.searchResultsPage());
    bookmarksView.update(model.state.bookMarks);
    //step1 : loadData
    await model.loadRecipe(id);
    // test
    // controlServings();
    // const { recipe } = model.state;
    //step2: render data
    RecipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);
    resultView.render(model.searchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    alert(err);
  }
};

const controlPagination = async function (gotoPage) {
  // console.log(gotoPage);
  resultView.render(model.searchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = async function (newServings) {
  // console.log(newServings);
  model.updateServings(newServings);
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = async function () {
  // add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  // update recipe view
  RecipeView.update(model.state.recipe);
  // render bookmarks
  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = async function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // renderspinner
    addRecipeView.renderSpinner();

    // upload recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //render recipe
    RecipeView.render(model.state.recipe);

    // success message
    addRecipeView.rendersuccessMessage();

    // render bookmarkview
    bookmarksView.render(model.state.bookMarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error(err);
    addRecipeView.renderError(err);
  }
};
function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();
// window.addEventListener('hashchange', getRecipe);
// window.addEventListener('load', getRecipe);
