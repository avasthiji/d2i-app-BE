module.exports = {
  index: async (req, res, next) => {
    try {
      const lookups = {
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        leaveTypes: ["casual", "earned", "maternity", "parent", "sick"],
        status: ["pending", "approved", "rejected"],
      };
      res.status(200).json(lookups);
    } catch (error) {
      next(error);
    }
  },
};
