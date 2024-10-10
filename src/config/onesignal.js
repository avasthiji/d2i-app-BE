const axios = require("axios");

async function sendNotification(heading, content, segmentName = "All") {
  const notificationData = {
    app_id: process.env.ONE_SIGNAL_APP_ID,
    headings: { en: heading },
    contents: { en: content },
    included_segments: [segmentName],
  };

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
        },
      }
    );

    return response.data.id;
  } catch (error) {
    if (error.response) {
    } else {
    }
    throw error;
  }
}

module.exports = { sendNotification };
