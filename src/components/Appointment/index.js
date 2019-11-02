import React from "react";
import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "../../hooks/useVisualMode";
import Status from "./Status";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
  const initialVisualMode = props.interview ? SHOW : EMPTY;
  const [visualMode, transition, back] = useVisualMode(initialVisualMode);
  console.log("INTERVIEWERS", props.interviewers);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  }

  return (
    <article className="appointment">
      <header>
        <Header time={props.time} />
        {visualMode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {visualMode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {visualMode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {visualMode === SAVING && <Status message="Saving....." />}
      </header>
    </article>
  );
}
