const ort = require("onnxruntime-node");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const PendingCollection = require("../models/PendingCollection");
const PendingNFT = require("../models/PendingNFT");

path1 = "./src/ai/random_forest_model.onnx";
path2 = "./src/ai/multi_linear_model.onnx";

class AIController {
  async predictAIPrice(pending_collection_id) {
    try {
      console.log("Predict AI Price");
      const session1 = await ort.InferenceSession.create(path1);
      const session2 = await ort.InferenceSession.create(path2);

      const inputName1 = session1.inputNames[0];
      const inputName2 = session2.inputNames[0];
      const outputName1 = session1.outputNames[0];
      const outputName2 = session2.outputNames[0];

      const inputTensor1 = new ort.Tensor("float32", [2, 400], [1, 2]);
      const inputTensor2 = new ort.Tensor("float32", [2, 400], [1, 2]);

      const results1 = await session1.run({ [inputName1]: inputTensor1 });
      const results2 = await session2.run({ [inputName2]: inputTensor2 });

      console.log("Prediction:", results1[outputName1].data);
      console.log("Prediction:", results2[outputName2].data);

      return;
    } catch (error) {
      return;
    }
  }
}

module.exports = new AIController();
