import React from "react";

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

type StateType<I> = {
  filteredItems: Array<WithItemBaseType<I>>;
  value: string;
};

const debouncingTime = 100;

export class SelectSearchable<SearchItemsType> extends React.Component<
  PropsType<SearchItemsType>,
  StateType<SearchItemsType>
> {
  timer: number = 0;
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: PropsType<SearchItemsType>) {
    super(props);
    this.inputRef = React.createRef();

    this.state = {
      filteredItems: this.props.items,
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.inputRef.current && this.inputRef.current.focus();
    }, debouncingTime);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: e.target.value }, () => {
      if (!this.state.value) {
        this.setState({ filteredItems: this.props.items });
        return;
      }

      if (this.props.async && this.state.value) {
        clearTimeout(this.timer);

        this.timer = window.setTimeout(() => {
          this.props.async &&
            this.props
              .async(this.state.value)
              .then((items: Array<WithItemBaseType<SearchItemsType>>) =>
                items.length > 0
                  ? this.setState({
                      filteredItems: items.map(
                        (item: WithItemBaseType<SearchItemsType>) => ({
                          ...item
                        })
                      )
                    })
                  : this.setState({ filteredItems: [] })
              )
              .catch(() => {});
        }, debouncingTime);
        return;
      }

      if (this.state.value) {
        const filteredItems = this.props.items.filter(
          (item: WithItemBaseType<SearchItemsType>) =>
            removeAccents(item.label)
              .toLowerCase()
              .match(removeAccents(this.state.value).toLowerCase())
        );
        filteredItems.length > 0
          ? this.setState({
              filteredItems
            })
          : this.setState({ filteredItems: [] });
        return;
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <input
          ref={this.inputRef}
          autoComplete={"off"}
          type={"text"}
          name={"captcha"}
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={this.props.placeholder || "Pesquisar..."}
          className={`input ${(this.props.css && this.props.css.input) || ""}`}
        />

        <SearchableList<SearchItemsType | {}>
          items={this.state.filteredItems}
          option={this.props.option}
          onSelectedItem={this.props.onSelectedItem}
          className={(this.props.css && this.props.css.list) || ""}
          disable={this.props.disable}
          noOptionsMessage={this.props.noOptionsMessage}
        />
      </React.Fragment>
    );
  }
}
