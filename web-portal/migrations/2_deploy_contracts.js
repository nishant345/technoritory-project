var Retailer = artifacts.require("./Retailer.sol");

module.exports = function(deployer) {
  deployer.deploy(Retailer);
};