const ort = require("onnxruntime-node");

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const PendingCollection = require("../models/PendingCollection");
const PendingNFT = require("../models/PendingNFT");
const PendingTrait = require("../models/PendingTrait");
const { getPriceTokenUSDtoETH } = require("../utils/getPriceTokenUSDtoETH.js");

path1 = "./src/ai/random_forest_model.onnx";
path2 = "./src/ai/multi_linear_model.onnx";

class AIController {
  async predictAIPrice(id) {
    try {
      console.log("Predict AI Price");
      const collection = await PendingCollection.findById(id);
      const total_items = collection.total_items;
      const traits = await PendingTrait.find({
        pending_collection_id: collection._id,
      });

      const categories = {};
      traits.map((trait) => {
        const { trait_type, value } = trait;
        if (!categories[trait_type]) {
          categories[trait_type] = {};
        }
        if (!categories[trait_type[value]]) {
          categories[trait_type][value] = 0;
        }
        categories[trait_type][value]++;
      });

      console.log(categories);
      //Tổng hợp các chỉ số

      const nfts = await PendingNFT.find({
        pending_collection_id: collection._id,
      });

      const data = await Promise.all(
        nfts.map(async (nft) => {
          const traitNFT = await PendingTrait.find({
            pending_collection_id: nft.pending_collection_id,
            nft_id: nft.nft_id,
          }).select("trait_type value");
          let total_rate = 0;
          let total_resever_rate = 0;
          let openrarity = 1;
          traitNFT.map((item) => {
            const percent = (
              (categories[item.trait_type][item.value] / total_items) *
              100
            ).toFixed(3);
            total_rate += parseFloat(percent);
            total_resever_rate += 1 / percent;
            openrarity *= percent;
          });
          return [
            nft.nft_id,
            total_items,
            "1", //number
            openrarity.toFixed(3),
            total_rate.toFixed(3),
            total_resever_rate.toFixed(3),
          ];
        })
      );

      const list = data.map((item) => {
        return item.shift();
      });
      const features = data;

      try {
        const session1 = await ort.InferenceSession.create(path1);
        const session2 = await ort.InferenceSession.create(path2);

        const inputName1 = session1.inputNames[0];
        const inputName2 = session2.inputNames[0];
        const outputName1 = session1.outputNames[0];
        const outputName2 = session2.outputNames[0];

        const inputTensor1 = new ort.Tensor(
          "float32",
          new Float32Array(features.flat()),
          [features.length, 5]
        );

        const inputTensor2 = new ort.Tensor(
          "float32",
          new Float32Array(features.flat()),
          [features.length, 5]
        );

        const results1 = await session1.run({ [inputName1]: inputTensor1 });
        const results2 = await session2.run({ [inputName2]: inputTensor2 });

        const aiPrice = list.map((item, index) => {
          const price =
            (results1[outputName1].data[index] +
              results2[outputName2].data[index]) /
            2;

          return { nft_id: item, ai_price: price.toString() };
        });

        console.log(aiPrice);

        const newNFTs = await Promise.all(
          aiPrice.map(async (item) => {
            return await PendingNFT.findOneAndUpdate(
              {
                pending_collection_id: collection._id,
                nft_id: item.nft_id,
              },
              {
                ai_price: await getPriceTokenUSDtoETH(item.ai_price),
              },
              {
                new: true,
                runValidators: true,
              }
            );
          })
        );
        const newCollection = await PendingCollection.findByIdAndUpdate(
          collection._id,
          {
            status: "AI Price",
          },
          {
            new: true,
            runValidators: true,
          }
        );
      } catch (error) {
        console.log(error);
      }

      return;
    } catch (error) {
      return;
    }
  }
}

module.exports = new AIController();
