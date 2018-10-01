pragma solidity ^0.4.2;

contract UbricoinToken{
	//Constructor
	//Set the totall number of token 
	//Read the total number of token
	uint256 public totalSupply;
	constructor() public{
		totalSupply = 1000000; 
	}
}