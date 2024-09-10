require("dotenv").config();
const CONSTANTS = {
  LOGIN_URL: `${process.env.BASEURL}/login`,
  INVITE_URL: `${process.env.BASEURLFE}/resetpassword?inviteCode=`,
};
module.exports = CONSTANTS;
