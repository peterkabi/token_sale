App={
  web3Provider: null,
  contracts:{},
  account:'0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable:750000,


  init: function(){
    console.log("App initialized...")
    return App.initWeb3();
  },
  initWeb3: function(){
    if (typeof web3 !== 'undefined') {
      App.web3Provider=web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
     // Set the provider you want from Web3.providers
    App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = new Web3(App.web3Provider);
    }

      return App.initContracts();
    },

    initContracts: function(){
    $.getJSON("UbricoinTokenSale.json", function(ubricoinTokenSale){
      App.contracts.UbricoinTokenSale = TruffleContract(ubricoinTokenSale);
      App.contracts.UbricoinTokenSale.setProvider(App.web3Provider);
      App.contracts.UbricoinTokenSale.deployed().then(function(ubricoinTokenSale){
         console.log("Ubricoin Token Sale Address:", ubricoinTokenSale.address);
      });
    }).done(function(){
        $.getJSON("UbricoinToken.json", function(ubricoinToken){
            App.contracts.UbricoinToken = TruffleContract(ubricoinToken);
            App.contracts.UbricoinToken.setProvider(App.web3Provider);
            App.contracts.UbricoinToken.deployed().then(function(ubricoinToken){
            console.log("Ubricoin Token Address:", ubricoinToken.address);
            });
            App.listenForEvents();
            return App.render();
      });
    })
  },

  //Listen for events emitted from the contract
  listenForEvents: function(){
    App.contracts.UbricoinTokenSale.deployed().then(function(instance){
      instance.Sell({},{
      fromBlock: 0,
      toBlock: 'latest',


      }).watch(function(error, events){
        console.log("event triggered", event);
        App.render();
      })
        
        
    })
  },
  render: function(){
    if(App.Loading){
      return;
    }

    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();
    //Load account Data
    web3.eth.getCoinbase(function(err, account){
      if(err ===null){
        console.log("account", account);
        App.account = account;
        $('#accountAddress').html("Your Account: " +  account);
      }
    })

      //Load token sale contract
      App.contracts.UbricoinTokenSale.deployed().then(function(instance){
         ubricoinTokenSaleInstance = instance;
         return ubricoinTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice){
        
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return ubricoinTokenSaleInstance.tokensSold();
      }).then(function(tokensSold){
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);

        var progressPercent =(Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        console.log(progressPercent);
        $('#progress').css('width', progressPercent + '%');

        //Load token contract
        App.contracts.UbricoinToken.deployed().then(function(instance){
          ubricoinTokenInstance = instance;
          return ubricoinTokenInstance.balanceOf(App.account);
        }).then(function(balance){
          $('.ubricoin-balance').html(balance.toNumber());


           App.loading = false;
           loader.hide();
           content.show();
        })
      });

     
    
  },
  buyTokens: function(){
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens =$('#numberOfTokens').val();
    App.contracts.UbricoinTokenSale.deployed().then(function(instance){
      return instance.buyTokens(numberOfTokens,{
        from:App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000

      });
    }).then(function(result){
     console.log("Tokens bought...")
     $('form').trigger('reset') //rest number of token in form
     //wait for sell event
     
    });
  }
}
$(function(){
  $(window).load(function(){
    App.init();
  })
});