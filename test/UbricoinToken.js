var UbricoinToken =artifacts.require(",/UbricoinToken.sol");

contract('UbricoinToken',function(accounts){
   it('sets the total supply upon deployment' , function(){
   	 return UbricoinToken.deployed().then(function(instance){
   	 	tokenInstance = instance;
   	 	return tokenInstance.totalSupply();
   	 }).then(function(totalSupply){
   	 	assert.equal(totalSupply.toNumber(),1000000, 'sets the total supply to 1000000');
   	 });
   });
})