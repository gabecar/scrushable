import React, { useState, useRef, useEffect } from "react";

import "./index.css";
import SearchableList, {
  WithItemBaseType,
  OptionItemType
} from "./searchableList";
import { removeAccents } from "../lib/removeAccents";

type cssType = {
  input?: string;
  list?: string;
};

type PropsType<I> = {
  items: Array<WithItemBaseType<I>>;
  placeholder?: string;
  css?: cssType;
  noOptionsMessage?: string;
  option?: (props: OptionItemType<I>) => React.ReactNode;
  async?: (value: string) => Promise<any>;
  onSelectedItem: (item: WithItemBaseType<I>) => void;
  disable?: (item: WithItemBaseType<I>) => boolean;
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
  disable
}: PropsType<SearchItemsType>) {
  const [filteredItems, setFilteredItems] = useState<
    Array<WithItemBaseType<SearchItemsType>>
  >(items);
  const [value, setValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, debouncingTime);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let timer: number = 0;

    setValue(e.target.value);
    if (!value) {
      setFilteredItems(items);
      return;
    }

    if (async && value) {
      clearTimeout(timer);

      timer = window.setTimeout(() => {
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

    if (value) {
      const filteredItems = items.filter(
        (item: WithItemBaseType<SearchItemsType>) =>
          removeAccents(item.label)
            .toLowerCase()
            .match(removeAccents(value).toLowerCase())
      );
      filteredItems.length > 0
        ? setFilteredItems(filteredItems)
        : setFilteredItems([]);
      return;
    }
  };

  return (
    <React.Fragment>
      <input
        ref={inputRef}
        autoComplete={"off"}
        type={"text"}
        name={"captcha"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Pesquisar..."}
        className={`input ${(css && css.input) || ""}`}
      />

      <SearchableList<SearchItemsType | {}>
        items={filteredItems}
        option={option}
        onSelectedItem={onSelectedItem}
        className={(css && css.list) || ""}
        disable={disable}
        noOptionsMessage={noOptionsMessage}
      />
    </React.Fragment>
  );
}
