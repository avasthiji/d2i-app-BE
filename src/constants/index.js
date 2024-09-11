require("dotenv").config();
const CONSTANTS = {
  LOGIN_URL: `${process.env.BASEURL}/login`,
  INVITE_URL: `${process.env.BASEURLFE}/reset-password?inviteCode=`,
};
module.exports = CONSTANTS;
