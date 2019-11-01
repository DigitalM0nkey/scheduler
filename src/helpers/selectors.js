export function getAppointmentsForDay(state, day) {
  let index = state.days.findIndex(x => x.name === day);
  let appointmentKeys = [];
  let appointments = [];
  if (state.days.length === 0) {
    return [];
  }
  if (index >= 0) {
    appointmentKeys = state.days[index].appointments;
  } else {
    return [];
  }
  appointmentKeys.forEach(element => {
    appointments.push(state.appointments[element]);
  });

  return appointments;
}

export function getInterview(state, interview) {
  let index;
  if (interview) {
    index = interview.interviewer;
  } else {
    return null;
  }
  let interviewerData = {
    student: interview.student,
    interviewer: state.interviewers[index]
  };

  return interviewerData;
}
