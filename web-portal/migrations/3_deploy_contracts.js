var Manufacturer = artifacts.require("./Manufacturer.sol");

module.exports = function(deployer) {
  deployer.deploy(Manufacturer);
};