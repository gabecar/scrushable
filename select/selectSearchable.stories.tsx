import React from "react";

import SelectSearchable from "./selectSearchable";

import { items } from "../test/mocks/items";

const LeftIcon = () => (
  <svg viewBox="0 0 42 42" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 36.044l-8.018 4.475a3.785 3.785 0 01-5.154-1.468 3.802 3.802 0 01-.43-2.454l1.587-9.82-6.918-7.16a3.801 3.801 0 01.086-5.368 3.786 3.786 0 012.059-1.024l9.362-1.445 3.991-8.586a3.785 3.785 0 016.869 0l3.991 8.586 9.363 1.445a3.795 3.795 0 013.167 4.33 3.799 3.799 0 01-1.022 2.062l-6.918 7.16 1.586 9.82a3.795 3.795 0 01-3.134 4.354 3.782 3.782 0 01-2.45-.432L21 36.044z"
      stroke="#BDBDBD"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

const RightIcon = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.707 12.293l2 2a1 1 0 01-1.414 1.414l-2-2a1 1 0 011.414-1.414zM7 0a7 7 0 110 14A7 7 0 017 0zm0 1.867a5.133 5.133 0 100 10.266A5.133 5.133 0 007 1.867z"
      fill="#757575"
      fillRule="nonzero"
    />
  </svg>
);

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

export const SearchableWithIcon = Template.bind({});
SearchableWithIcon.args = {
  items,
  onSelectedItem: () => {},
  hasSearch: true,
  noOptionsMessage: "Nenhuma opção encontrada",
  leftIcon: LeftIcon(),
  rightIcon: RightIcon(),
};
