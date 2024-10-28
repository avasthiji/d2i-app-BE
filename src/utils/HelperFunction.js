const moment = require("moment/moment");
const crypto = require("crypto");

module.exports.HelperFunction = {
  checkDuplicateHolidayDates: (holidays, newHolidayDate) => {
    const holidayExists = holidays.some(
      (holiday) => moment(holiday.date).format("YYYY-MM-DD") === newHolidayDate
    );
    return holidayExists;
  },
  generateOtp: () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return otp;
  },
  encryptMessage: (message, secretKey) => {
    const algorithm = "aes-256-cbc";
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(secretKey)
      .digest("base64")
      .substr(0, 32); //key from the secret key
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted; //store iv along with the message
  },
  decryptMessage: (encryptMessage, secretKey) => {
    const algorithm = "aes-256-cbc";
    const parts = encryptMessage.split(":");
    const iv = Buffer.from(parts.shift(), "hex");
    const encryptedText = parts.join(":");
    const key = crypto
      .createHash("sha256")
      .update(secretKey)
      .digest("base64")
      .substr(0, 32);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
};
