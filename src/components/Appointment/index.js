import React from "react";
import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";

export default function Appointment(props) {
  const initialVisualMode = props.interview ? SHOW : EMPTY;
  const [visualMode, transition, back] = useVisualMode(initialVisualMode);

  return (
    <article className="appointment">
      <header>
        <Header time={props.time} />
        {visualMode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {visualMode === EMPTY && <Empty />}
      </header>
    </article>
  );
}
