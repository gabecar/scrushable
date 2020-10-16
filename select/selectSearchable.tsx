import React, { useState, useRef, useEffect } from "react";

import "./index.css";
import SearchableList, {
  WithItemBaseType,
  OptionItemType
} from "./searchableList";
// import { removeAccents } from "../lib/removeAccents";

export type SelectSearchableCSSType = {
  input?: string;
  list?: string;
  scroll?: string;
  item?: string;
  container?: string;
  notFound?: string;
};

type PropsType<I> = {
  items: Array<WithItemBaseType<I>>;
  placeholder?: string;
  css?: SelectSearchableCSSType;
  noOptionsMessage?: string;
  option?: (props: OptionItemType<I>) => JSX.Element;
  async?: (value: string) => Promise<any>;
  onSelectedItem: (item: WithItemBaseType<I>) => void;
  disable?: (item: WithItemBaseType<I>) => boolean;
  itemToSelect?: (
    items: Array<WithItemBaseType<I>>,
    value: WithItemBaseType<I>
  ) => number;
  hasSearch?: boolean;
  inputValue?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

const debouncingTime = 100;

export default function SelectSearchable<SearchItemsType>({
  items,
  placeholder,
  css,
  noOptionsMessage,
  option,
  async,
  onSelectedItem,
  disable,
  itemToSelect,
  rightIcon,
  leftIcon,
  hasSearch,
  inputValue
}: PropsType<SearchItemsType>) {
  const [filteredItems, setFilteredItems] = useState<
    Array<WithItemBaseType<SearchItemsType>>
  >(items);
  const [value, setValue] = useState<string>(inputValue || "");

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  let timer = useRef(0);

  useEffect(() => {
    if (inputValue) {
      setValue(inputValue);
    }
  }, [inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (!value || (inputValue && inputValue === value)) {
      setFilteredItems(items);
      return;
    }

    if (async && value) {
      clearTimeout(timer.current);

      timer.current = window.setTimeout(() => {
        async &&
          async(value)
            .then((items: Array<WithItemBaseType<SearchItemsType>>) =>
              items.length > 0
                ? setFilteredItems(
                    items.map((item: WithItemBaseType<SearchItemsType>) => ({
                      ...item
                    }))
                  )
                : setFilteredItems([])
            )
            .catch(() => {});
      }, debouncingTime);

      return;
    }

    const filteredItems = items.filter(
      (item: WithItemBaseType<SearchItemsType>) =>
        item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filteredItems);

    return () => clearTimeout(timer.current);
  }, [value, async, items, inputValue]);

  return (
    <div ref={selectRef} className={css ? css.container : ""}>
      {hasSearch && (
        <div
          className={`u-flex-alignCenter u-flex-alignCenter selectSearchable-inputContainer ${
            css ? css.input : ""
          }`}
        >
          {leftIcon}
          <input
            ref={inputRef}
            autoComplete="off"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder || ""}
            className={"selectSearchable-input"}
          />
          {rightIcon}
        </div>
      )}
      <SearchableList<SearchItemsType>
        items={filteredItems}
        option={option}
        onSelectedItem={onSelectedItem}
        css={{
          list: css ? css.list : "",
          scroll: `${hasSearch ? "searchableList-scroll--withInput" : ""} ${
            css ? css.scroll : ""
          }`,
          item: css ? css.item : "",
          notFound: css ? css.notFound : ""
        }}
        disable={disable}
        noOptionsMessage={noOptionsMessage}
        itemToSelect={itemToSelect}
      />
    </div>
  );
}
