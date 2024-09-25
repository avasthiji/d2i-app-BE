const axios = require("axios");

// Replace these with your actual OneSignal App ID and REST API Key
const ONE_SIGNAL_APP_ID = "61699a51-2649-4711-9dec-330d06a7d771";
const ONE_SIGNAL_API_KEY = "Y2VmMzlmNTUtZDA1NC00YTc5LWIwMjAtNzk0NzUyZGFhY2Iz";

async function sendNotification(heading, content, segmentName = "All") {
  const notificationData = {
    app_id: ONE_SIGNAL_APP_ID,
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
          Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
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
