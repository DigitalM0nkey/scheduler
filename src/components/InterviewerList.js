import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map(interviewer => (
          <InterviewerListItem
            avatar={interviewer.avatar}
            name={interviewer.name}
            selected={props.interviewer === interviewer.id}
            id={interviewer.id}
            setInterviewer={props.setInterviewer}
          />
        ))}
        ;
      </ul>
    </section>
  );
}
