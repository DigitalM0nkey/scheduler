import React from "react";
import "components/DayListItem.scss";

const classnames = require("classnames");

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const message = {
    none: "no spots remaining",
    one: `${props.spots} spot remaining`,
    more: `${props.spots} spots remaining`
  };

  return (
    <li
      className={dayClass}
      data-testid={"day"}
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">
        {props.spots
          ? props.spots === 1
            ? message.one
            : message.more
          : message.none}
      </h3>
    </li>
  );
}
