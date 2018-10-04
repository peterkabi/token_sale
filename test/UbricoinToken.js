var UbricoinToken =artifacts.require(",/UbricoinToken.sol");

contract('UbricoinToken',function(accounts){
   var tokenInstance;
   it('initializes the contract with the correct values',function(){
   	 return UbricoinToken.deployed().then(function(instance){
       tokenInstance = instance;
       return tokenInstance.name();
   	 }).then(function(name){
   	 	assert.equal(name,'Ubricoin Token','has the correct name');
   	    return tokenInstance.symbol();
   	 }).then(function(symbol){
   	 	assert.equal(symbol, 'UBN','has the correct symbol');
   	    return tokenInstance.standard();
   	 }).then(function(standard){
       assert.equal(standard, 'Ubricoin Token v1.0'),'has the correct standard';
   	 });


   })
   it('allocates the initial supply upon deployment' , function(){
   	 return UbricoinToken.deployed().then(function(instance){
   	 	tokenInstance = instance;
   	 	return tokenInstance.totalSupply();
   	 }).then(function(totalSupply){
   	 	assert.equal(totalSupply.toNumber(),1000000, 'sets the total supply to 1000000');
   	 	return tokenInstance.balanceOf(accounts[0]);
   	 }).then(function(adminBalance){
   	 	assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
   	 });

   });

   it('transfers token ownership', function(){
     return UbricoinToken.deployed().then(function(instance){
     	tokenInstance = instance;
     	return tokenInstance.transfer.call(accounts[1],99999999999999999999999);
     }).then(assert.fail).catch(function(error){
     	assert(error.message.indexOf('revert') >=0,'error message must contain revert');
        return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
      }).then(function(success){

        assert.equal(success, true, 'it returns true');
        return tokenInstance.transfer(accounts[1],250000,{from: accounts[0]});
     }).then(function(receipt){
       assert.equal(receipt.logs.length,1,'trigger one event');
       assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
       assert.equal(receipt.logs[0].args._from, accounts[0],'logs the account the token are transferred from');
       assert.equal(receipt.logs[0].args._to,accounts[1],'logs the accounts the token are transferred to');
       assert.equal(receipt.logs[0].args._value, 250000,'logs the transfer amount');
       return tokenInstance.balanceOf(accounts[1]);

     }).then(function(balance){
     	assert.equal(balance.toNumber(),250000,'adds the amount to the receiving account');
     	return tokenInstance.balanceOf(accounts[0]);
     }).then(function(balance){
     	assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending accounts');
     });
   });







});