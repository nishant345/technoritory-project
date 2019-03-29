
App = {
    // variable declaration
    web3Provider: null,
    web3_abi: null,
    contracts: {},
    accounts: '0x0',
    account: null,
    retailerInstance: null,
    productsCount: null,
    qrcode: null,
    blockNumber: null,
    blockHash: null,
    encrypted: null,
    transactions: [],
    productsJson: [],

    //initialization
    init: function() {
        return App.initQrCode();
    },
    // initialising QR Code, providing the options for QR Code 
    initQrCode: function(){
        App.qrcode = new QRCode(document.getElementById("qrcode"), {
            width : 200,
            height : 200,
            logo: '../images/logo_blue_technoritory.PNG'
        });
        return App.initWeb3();
    },
    // initialising WEB3.JS
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },
    // initialising contracts
    // Here the smart contracts that are written in solidity are integrated with web js and then used 
    // by the front end
    initContract: function() {
        $.getJSON("../../Retailer.json", function(retailer) {
            App.abi = retailer.abi;
            //Instantiate a new truffle contract from the artifact
            App.contracts.Retailer = TruffleContract(retailer);
            // Connect provider to interact with contract
            App.contracts.Retailer.setProvider(App.web3Provider);
            return App.render();
        });
    },
    // Initial rendering of the app
    render: function() {
        App.contracts.Retailer.deployed().then(function(instance){
            App.retailerInstance = instance;
            console.log(App.retailerInstance);
        });
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " +"<b>"+ App.account+"</b>");
            }
        });
        //$("#qrcode").hide();
    },
    // Submitting Retailer data to Ethereum network
    submitRetailerData: function(){
        var retailerName = $('#retailerName').val()+ ','; 
        var retailerTinNo = ','+ $('#retailerTinNo').val()+ ',';
        var retailerLocation = $('#retailerLocation').val();
        var retailerCountry = $('#retailerCountry').val();
        var productDetails = $('#productDetails').val();
        var distributorDetails = $('#distributorName').val() +", "+ $('#distributorLocation').val() ;
        var manufacturerDetails = $('#manufacturerName').val() +", "+ $('#manufacturingLocation').val();
        App.retailerInstance.setRetailerDetails(App.account, 
            retailerTinNo,
            retailerName,
            retailerCountry,  
            retailerLocation,
            distributorDetails,
            manufacturerDetails,
            productDetails);
        var str =   "retailerName: " + retailerName + "\n" + 
                    "retailerTinNo: "+ retailerTinNo + "\n" +
                    "retailerCountry: "+ retailerCountry + "\n" +
                    "productDetails: "+ productDetails + "\n" +
                    "distributorDetails: "+ distributorDetails + "\n" +
                    "manufacturerDetails: "+ manufacturerDetails + "\n" +
                    "retailerLocation: "+ retailerLocation;
                    
        console.log(str);
        //App.encrypted = encrypt(str);
        //App.qrcode.makeCode(str);
        
        //console.log(decrypt(App.encrypted).toString(CryptoJS.enc.Utf8));
        //$("#qrcode").show();
        web3.eth.getBlockNumber(function(error, result){
            if(!error){
                App.blockNumber = result;
                web3.eth.getBlock(App.blockNumber, function(error, result){
                    if(!error){
                        console.log(result);
                        App.blockHash = result.hash;
                        $("#blockNumber").html("Your Block Number: " + "<b>"+ App.blockNumber +"</b>");
                        $("#blockHash").html("Your Block Hash: " + "<b>"+ App.blockHash +"</b>");
                        $("#transactionHash").html("Your Block Hash: " + "<b>"+ result.transactions[0] +"</b>");
                        //App.transactions.push(result.transactions[0]);
                        web3.eth.getTransaction(result.transactions[0], function(error, res){
                            if(!error){
                                var input = web3.toAscii(res.input);
                                var output = "";
                                var obj = {};
                                var substr = "";
                                for (var i=0; i<input.length; i++) {
                                    if (input.charCodeAt(i) >= 32 && input.charCodeAt(i) <= 127) {
                                        output += input.charAt(i);
                                    }
                                }
                                output = output.replace(substr,'');
                                var word = output.split(",");
                                console.log(word);
                            }
                        });
                    console.log(App.productsJson);
                    }
                    else
                        console.log(error);
                });
            }
            else
                console.log(error);
        });
    },

    clearForm: function(){
        $('#retailerName').val("");
        $('#retailerTinNo').val("");
        $('#retailerDate').val("");
        $('#retailerLocation').val("");
        $('#productDetails').val("");
        $('#distributorName').val("");
        $('#distributorLocation').val("") ;
        $('#manufacturerName').val("");
        $('#manufacturingLocation').val("");
    },
    
    submitTransactionHash: function() {
        var transactionBlock = parseInt($("#transactionBlockForRetailer").val())+1;
        console.log("Transaction Block Retailer: " + transactionBlock);
        web3.eth.getTransactionFromBlock(transactionBlock, function(error, res){
            if(!error){
                var input = web3.toAscii(res.input);
                var output = "";
                var obj = {};
                var substr = "";
                for (var i=0; i<input.length; i++) {
                    if (input.charCodeAt(i) >= 32 && input.charCodeAt(i) <= 127) {
                        output += input.charAt(i);
                    }
                }
                output = output.replace(substr,'');
                var word = output.split(",");
                console.log(word);
                obj.distributorName = word[2]; //.substring(word[1]).lastIndexOf("@"), word[1].charAt(word[1].length - 1));
                obj.distributorCountry = word[4];
                obj.distributorPlace = word[6];
                obj.manufacturerName = word[8];
                obj.prodDetails= word[10];
                obj.manufacturerLocation = word[12];
                console.log(obj);
            }
            $('#distributorName').val(obj.distributorName);
            $('#distributorLocation').val(obj.distributorPlace+", "+obj.distributorCountry);
            $('#productDetails').val(obj.prodDetails);
            $('#manufacturerName').val(obj.manufacturerName);
            $('#manufacturingLocation').val(obj.manufacturerLocation);
        });
    }
}
// on page reload init function will be called
$(function() {
    $(window).load(function() {
        App.init();
    });
});
window.ethereum.on('accountsChanged', function (accounts) {
    console.log(accounts);
    App.account = accounts[0];
})


  