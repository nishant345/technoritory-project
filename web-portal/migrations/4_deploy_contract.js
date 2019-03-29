var Distributor = artifacts.require("./Distributor.sol");

module.exports = function(deployer) {
  deployer.deploy(Distributor);
};