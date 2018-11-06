var UbricoinToken = artifacts.require("./UbricoinToken.sol");
var UbricoinTokenSale = artifacts.require("./UbricoinTokenSale.sol");
var tokenPrice = 1000000000000000;

module.exports = function(deployer) {
  deployer.deploy(UbricoinToken, 1000000).then(function(){
  	 return deployer.deploy(UbricoinTokenSale , UbricoinToken.address,tokenPrice);
  });
  
};
