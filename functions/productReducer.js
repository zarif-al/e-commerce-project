export const defaultState = {
  lowerLimit: 0,
  showLimit: 21,
  sortOption: "Default",
  itemOption: "All",
  searchValue: "",
};

export const productViewReducer = (productViewState, action) => {
  if (action.type === "setLowerLimit") {
    return { ...productViewState, lowerLimit: action.payload };
  }

  if (action.type === "setSearchValue") {
    return { ...productViewState, searchValue: action.payload };
  }
};
