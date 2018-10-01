var UbricoinToken = artifacts.require("./UbricoinToken.sol");

module.exports = function(deployer) {
  deployer.deploy(UbricoinToken);
};
