const { BadRequestError } = require("../exceptions");
const { TABLE_NAMES } = require("../utils/db");
const { HelperFunction } = require("../utils/HelperFunction");
const transporter = require("../utils/Mailer");
const { getRecordByKey, updateRecordsByKey } = require("../utils/QueryBuilder");

module.exports.ForgotPasswordService = {
  requestOtp: async (email) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, {
        officialEmail: email,
      });
      if (user) {
        const otp = HelperFunction.generateOtp();

        user.otp = otp;
        user.otpGeneratedAt = Date.now() + 300000;

        await user.save();
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.officialEmail,
          subject: "Your OTP for password reset",
          html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It is valid for the next 5 minutes.</p>`,
        };
        await transporter.sendMail(mailOptions);
      }

      return { message: "OTP sent to your email." };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  resetPasswordWithOtp: async (email, otp, newPassword) => {
    try {
      const user = await getRecordByKey(TABLE_NAMES.USERS, {
        officialEmail: email,
      });

      if (!user) {
        throw new Error("Invalid OTP or Something went wrong");
      } else {
        if (user.otp !== otp || user.otpGeneratedAt < Date.now()) {
          throw new Error("Invalid or expired OTP");
        } else {
          const response = await updateRecordsByKey(
            TABLE_NAMES.USERS,
            { officialEmail: email },
            { password: newPassword, otp: null, otpGeneratedAt: null }
          );
          return { message: "Password successfully reset" };
        }
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
};
