

const model = require("../model/copounModel");

const factory = require("./handellingServices");


const getCopouns = factory.getAll(model);

const creatCopoun = factory.createOne(model);

const specificCopoun = factory.specificOne(model);

const updateCopoun = factory.updateOne(model);

const deleteCopoun = factory.deleteOne(model);


module.exports = {
  getCopouns,
  creatCopoun,
  specificCopoun,
  updateCopoun,
  deleteCopoun,
};
