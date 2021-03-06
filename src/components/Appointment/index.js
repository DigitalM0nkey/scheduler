import React from "react";
import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "../../hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const initialVisualMode = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initialVisualMode);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {
        console.log(error);
        transition(ERROR_SAVE, true);
      });
  }

  function update(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {
        console.log(error);
        transition(ERROR_SAVE, true);
      });
  }

  function destroy() {
    console.log("ALL GONE");
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => {
        console.log("ERROR DESTROY", error);
        transition(ERROR_DELETE, true);
      });
  }

  return (
    <article data-testid="appointment" className="appointment">
      <header>
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            onEdit={() => transition(EDIT)}
            onDelete={() => transition(CONFIRM)}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && <Status message="Saving....." />}
        {mode === DELETE && <Status message="Deleting..." />}
        {mode === CONFIRM && (
          <Confirm
            onConfirm={destroy}
            message="Are you sure?"
            onCancel={() => transition(SHOW)}
          />
        )}
        {mode === EDIT && (
          <Form
            name={props.interview.student}
            interviewers={props.interviewers}
            interviewer={props.interview.interviewer.id}
            onCancel={back}
            onSave={update}
          />
        )}
        {mode === ERROR_DELETE && (
          <Error message="Could not cancel" onClose={() => transition(SHOW)} />
        )}
        {mode === ERROR_SAVE && (
          <Error message="Could not save" onClose={() => transition(EMPTY)} />
        )}
      </header>
    </article>
  );
}
