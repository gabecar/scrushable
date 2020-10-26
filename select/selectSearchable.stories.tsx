import React from "react";

import SelectSearchable from "./selectSearchable";

import { items } from "../test/mocks/items";

export default {
  title: "SelectSearchable",
  component: SelectSearchable,
};

const Template = (args) => <SelectSearchable {...args} />;

export const Searchable = Template.bind({});
Searchable.args = {
  items,
  onSelectedItem: () => {},
};

export const SearchableWithSearch = Template.bind({});
SearchableWithSearch.args = {
  items,
  onSelectedItem: () => {},
  hasSearch: true,
};

export const SearchableWithPlaceholder = Template.bind({});
SearchableWithPlaceholder.args = {
  items,
  onSelectedItem: () => {},
  hasSearch: true,
  placeholder: "Valor esperado",
  noOptionsMessage: "Nenhuma opção encontrada",
};
