const PageParams = {
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY_MS: 500,
  getPageIndex: (currentPage: number) => currentPage - 1
};

export default PageParams;