import Mao from "../models/maoModel.js";

export const getMaoByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const mao = await Mao.findOne({ phone: phone });

    if (!mao) {
      return res.status(404).json({ message: "MAO not found" });
    }

    res.json(mao);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get ALL MAO records
export const getAllMao = async (req, res) => {
  try {
    const maoRecords = await Mao.find();
    res.status(200).json(maoRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get MAO by Mandal
export const getMaoByMandal = async (req, res) => {
  try {
    const { mandal } = req.params;

    const maoRecords = await Mao.find({ mandal: mandal });

    if (maoRecords.length === 0) {
      return res.status(404).json({ message: "No MAO records found for this mandal" });
    }

    res.json(maoRecords);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
