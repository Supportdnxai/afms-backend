import Farmer from "../models/farmerModel.js";

// =======================================================
// GET farmer by PPB Number with 20-day consumption note
// =======================================================
// export const getFarmerByIFMS = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const farmer = await Farmer.findOne({ ppbNumber: id.trim() });

//     if (!farmer) {
//       return res.status(404).json({ message: "Farmer not found" });
//     }

//     let note = "";

//     // ------------------------------------------------------
//     // ⭐ FIXED: Check consumptionHistory correctly
//     // ------------------------------------------------------
//     if (farmer.consumptionHistory && farmer.consumptionHistory.length > 0) {

//       // Get last consumption entry
//       const lastEntry = farmer.consumptionHistory[farmer.consumptionHistory.length - 1];

//       if (lastEntry?.date) {
//         const lastDate = new Date(lastEntry.date);
//         const today = new Date();

//         const diffDays = Math.floor(
//           (today - lastDate) / (1000 * 60 * 60 * 24)
//         );

//         // If >= 20 days
//         if (diffDays >= 20) {
//           note = ``;
//         } else {
//           note = `Recent consumption: ${diffDays} days ago on ${lastDate.toISOString().split("T")[0]} by ${farmer.consumptionHistory.dealerName}`;
//         }
//       } else {
//         note = "";
//       }

//     } else {
//       note = "";
//     }

//     // Attach note to response object
//     const response = {
//       ...farmer.toObject(),
//       note,
//     };

//     res.json(response);

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getFarmerByIFMS = async (req, res) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findOne({ ppbNumber: id.trim() });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    let note = "";

    if (farmer.consumptionHistory?.length > 0) {
      const lastEntry =
        farmer.consumptionHistory[farmer.consumptionHistory.length - 1];

      if (lastEntry?.date) {
        const lastDate = new Date(lastEntry.date);
        const today = new Date();
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays >= 20) {
          note = "";
        } else {
          const dealerText = lastEntry.dealerName
            ? ` by ${lastEntry.dealerName}`
            : "";
          note = `Recent consumption: ${diffDays} days ago on ${lastDate
            .toISOString()
            .split("T")[0]}${dealerText}.`;
        }
      }
    }

    res.json({
      ...farmer.toObject(),
      note,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// =======================================================
// GET ALL farmers
// =======================================================
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =======================================================
// UPDATE farmer by PPB Number  (kept same as your version)
// =======================================================
// export const updateFarmer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const farmer = await Farmer.findOne({ ppbNumber: id.trim() });

//     if (!farmer) {
//       return res.status(404).json({ message: "Farmer not found" });
//     }

//     // Add consumption history entry when bags change
//     if (updateData.bagsConsumed !== undefined || updateData.bagsLeft !== undefined) {
//       farmer.consumptionHistory.push({
//         date: new Date(),
//         bagsConsumed: updateData.bagsConsumed ?? farmer.bagsConsumed,
//         bagsLeft: updateData.bagsLeft ?? farmer.bagsLeft
//       });
//     }

//     // Update only fields provided
//     Object.keys(updateData).forEach((key) => {
//       farmer[key] = updateData[key];
//     });

//     await farmer.save();

//     res.status(200).json({
//       message: "Farmer updated successfully",
//       updatedFarmer: farmer,
//     });

//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// =======================================================
// UPDATE farmer by PPB Number with allowed fields validation
// =======================================================
export const updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const farmer = await Farmer.findOne({ ppbNumber: id.trim() });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Allowed safe update fields
    const allowedFields = [
      "aadharNumber",
      "eligibility",
      "bagsConsumed",
      "bagsLeft",
      "consumptionHistory",
      "othersAcres",
      "othersGuntas"
    ];

    // Validate Aadhaar if included
    if (updateData.aadharNumber) {
      if (!/^\d{12}$/.test(updateData.aadharNumber)) {
        return res.status(400).json({ message: "Invalid Aadhaar. Must be 12 digits." });
      }
    }

    // Add consumption log only if changed
    if ("bagsConsumed" in updateData || "bagsLeft" in updateData) {
      farmer.consumptionHistory.push({
        date: new Date(),
        bagsConsumed: updateData.bagsConsumed ?? farmer.bagsConsumed,
        bagsLeft: updateData.bagsLeft ?? farmer.bagsLeft,
        dealerName: updateData.dealerName,
        iFMSId: updateData.iFMSId,
        othersAcres: updateData.othersAcres,
        othersGuntas: updateData.othersGuntas
      });
    }

    // Update fields safely
    allowedFields.forEach(key => {
      if (key in updateData) {
        farmer[key] = updateData[key];
      }
    });

    await farmer.save();

    res.json({
      success: true,
      message: "Farmer updated successfully",
      updatedFarmer: farmer
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

