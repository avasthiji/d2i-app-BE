module.exports.HealthController = {
  index: async (req, res) => {
    res.json({ message: "Server is UP!!!", api: true });
  },
};
