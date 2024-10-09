require("dotenv").config();
const CONSTANTS = {
  URL: {
    LOGIN_URL: `${process.env.BASEURL}/login`,
    INVITE_URL: `${process.env.BASEURLFE}/reset-password?inviteCode=`,
    LEAVE_URL: `${process.env.BASEURLFE}/leave`,
  },
  ERROR_MESSAGES: {
    SOMETHING_WRONG: "Something went wrong!",
    USER_NOT_FOUND: "User not found!",
    METRIC_NOT_FOUND: "Metric not found!",
    LEAVE_NOT_FOUND: "Leave not found!",
    ATTENDANCE_NOT_FOUND: "Employee attendance record not found.",
    ALREADY_PUNCHED_OUT: "User has already punched out.",
    MANAGER_NOT_FOUND: "Manager not found",
    HOLIDAY_NOT_FOUND: "Holiday not found",
    USER_ALREADY_EXISTS: "A user with this email already exists.",
    ATTENDNACE_ALREADY_EXISTS:
      "Attendance record already exists for this user on this date.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    ACCESS_DENIED: "Access denied.",
    USER_DELETED: "User deleted successfully.",
    METRIC_DELETED: "Metric deleted successfully.",
    REQUIRED_INVITE: "Invite code is required",
    INVALID_ADMIN_KEY: "Invalid Admin Signup Key",
    POINTS_OUT_RANGE: "Points out of allowed range",
    NOT_MODIFIABLE:
      "Access denied can't modify ROLE or EmployeeId or OfficialEmail",
    PUNCH_ACTION_REQUIRED: "Action is required(punchIn or punchOut)",
    INVALID_ACTION: "Invalid Action specified.",
    NOT_AUTHORIZED: "You are not authorized to access this data.",
    LEAVE_FIELDS_REQUIRED:
      "All fields are required: leaveStart, leaveEnd, leaveType, dayType, reason",
    LEAVE_DAY_TYPE_ERROR:
      "DayType must be either 0.5 (half day) or 1 (full day)",
    LEAVE_START_DATE: "Leave start date cannot be in the past.",
    LEAVE_END_DATE: "Leave end date cannot be before leave start date.",
    ALREADY_LEAVE_REQUEST: "You already have a leave request for these dates.",
    LEAVE_ALREADY_PROCESSED: "Leave has already been processed.",
    HOLIDAY_REQUIRED_FIELDS: "Year and Holidays are required fields",
    HOLIDAY_ARRAY_FIELDS: "Holidays array is required",
    NO_HOLIDAYS_FOR_YEAR: "No holidays found for the year",
    HOLIDAY_CREATING_ERROR: "Error creating holiday record!",
  },
};
module.exports = CONSTANTS;
