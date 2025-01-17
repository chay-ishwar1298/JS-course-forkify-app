import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      // console.log(gotoPage);
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPages);

    //page 1 and there are other pages
    if (curPage === 1 && numPages > 1)
      return `<button class="btn--inline pagination__btn--next" data-goto="${
        curPage + 1
      }">
    <span>${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;

    // last page
    if (curPage === numPages && numPages > 1)
      return `
    <button class="btn--inline pagination__btn--prev" data-goto="${
      curPage - 1
    }">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>${curPage - 1}</span>
  </button>`;
    // other page
    if (curPage < numPages && curPage > 1)
      return `<button class="btn--inline pagination__btn--prev" data-goto="${
        curPage - 1
      }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>
    <button class="btn--inline pagination__btn--next" data-goto="${
      curPage + 1
    }">
  <span>${curPage + 1}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;
    // page 1 and there are no other pages
    return '';
  }
}
export default new PaginationView();
