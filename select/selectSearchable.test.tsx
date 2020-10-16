import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { items } from "../test/mocks/items";
import { SelectSearchable } from ".";

describe("Component: SelectSearchable", () => {
  describe("rendering", () => {
    it("should render and search in SelectSearchable", async () => {
      const { getByRole } = render(
        <SelectSearchable
          items={items}
          onSelectedItem={() => {}}
          hasSearch={true}
          noOptionsMessage="Nenhuma opção encontrada"
        />
      );
      const childrens = getByRole("listbox").children;
      const input = getByRole("textbox") as HTMLInputElement;

      expect(childrens.length).toEqual(items.length);

      act(() => {
        fireEvent.change(input, { target: { value: "Teste" } });
      });

      expect(childrens[0].textContent).toEqual("Nenhuma opção encontrada");

      act(() => {
        fireEvent.change(input, { target: { value: "Forró" } });
      });

      expect(childrens[0].textContent).toEqual("Forró");
    });
  });
});
