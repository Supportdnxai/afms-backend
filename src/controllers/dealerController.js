import Dealer from "../models/dealerModel.js";

export const getDealerByIFMS = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealer.findOne({ iFMSId: id });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res.json(dealer);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get ALL dealers
export const getAllDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.status(200).json(dealers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
