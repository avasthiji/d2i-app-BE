require("dotenv").config();
const CONSTANTS = {
  LOGIN_URL: `${process.env.BASEURL}/login`,
  INVITE_URL: `${process.env.BASEURL}/signup?inviteCode=`,
};
module.exports = CONSTANTS;
