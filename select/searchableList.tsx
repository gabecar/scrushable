import React, { PropsWithChildren, useState, useRef, useEffect } from "react";

import "./index.css";
import { KEY } from "./constants";

export type ItemBaseType = { label: string; value: string };

export type OptionItemType<I> = PropsWithChildren<WithItemBaseType<I>>;

export type WithItemBaseType<T> = T & ItemBaseType;

type PropsType<I> = {
  items: Array<WithItemBaseType<I>>;
  className?: string;
  noOptionsMessage?: string;
  option?: (props: OptionItemType<I>) => React.ReactNode;
  onSelectedItem: (item: WithItemBaseType<I>) => void;
  disable?: (item: WithItemBaseType<I>) => boolean;
};

export default function SearchableList<SearchItemsType>({
  items,
  className,
  noOptionsMessage,
  option,
  onSelectedItem,
  disable
}: PropsType<SearchItemsType>) {
  const [focus, setFocus] = useState<number>(0);
  const [itemHover, setItemHover] = useState<boolean>(true);

  const refList = useRef<HTMLDivElement>(null);
  const refItemList = useRef<HTMLLIElement>(null);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [focus, itemHover]);

  const setItemFocus = (focus: number) => {
    const itemToScroll = 4;

    if (!refItemList.current) return;

    setFocus(focus);
    setItemHover(false);

    if (refItemList.current && refList.current)
      refList.current.scrollTop =
        (focus - itemToScroll) * refItemList.current.offsetHeight;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();

    if (e.keyCode === KEY.Up) {
      e.preventDefault();
      const prevFocus = focus === 0 ? items.length - 1 : focus - 1;
      setItemFocus(prevFocus);
    } else if (e.keyCode === KEY.Down) {
      e.preventDefault();
      const nextFocus = focus === items.length - 1 ? 0 : focus + 1;
      setItemFocus(nextFocus);
    } else if (e.keyCode === KEY.Enter) {
      onSelectedItem(items[focus]);
    }
  };

  const onMouseMove = () => {
    setItemHover(true);
  };

  const classesName = (value: string) => {
    return `searchableList-item ${
      focus === items.map((item: ItemBaseType) => item.value).indexOf(value)
        ? "searchableList-item--selected"
        : ""
    } ${itemHover ? "searchableList-item--focus" : ""}`;
  };

  const Option: any = option;

  return (
    <div ref={refList} className={className || "searchableList"}>
      <ul>
        {items.length > 0 ? (
          items.map(
            (item: WithItemBaseType<SearchItemsType>, index: number) => {
              const disabled = disable && disable(item);
              return (
                <li
                  ref={refItemList}
                  className={classesName(item.value)}
                  key={index}
                  onClick={() => {
                    !disabled && onSelectedItem(item);
                  }}
                >
                  {option ? <Option {...item} /> : <div>{item.label}</div>}
                </li>
              );
            }
          )
        ) : (
          <span className="searchableList-notFound">
            {noOptionsMessage || "Nenhuma opção encontrada"}
          </span>
        )}
      </ul>
    </div>
  );
}
