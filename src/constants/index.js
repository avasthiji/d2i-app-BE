require("dotenv").config();
const CONSTANTS = {
  LOGIN_URL: `${process.env.BASEURL}/login`,
  INVITE_URL: `${process.env.BASEURLFE}/reset-password?inviteCode=`,
  LEAVE_URL: `${process.env.BASEURLFE}/leave`,
};
module.exports = CONSTANTS;
