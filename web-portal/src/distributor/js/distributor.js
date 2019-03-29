
App = {
    // variable declaration
    web3Provider: null,
    web3_abi: null,
    contracts: {},
    accounts: '0x0',
    account: null,
    distributorInstance: null,
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
        $.getJSON("../../Distributor.json", function(distributor) {
            App.abi = distributor.abi;
            //Instantiate a new truffle contract from the artifact
            App.contracts.Distributor = TruffleContract(distributor);
            // Connect provider to interact with contract
            App.contracts.Distributor.setProvider(App.web3Provider);
            return App.render();
        });
    },
    // Initial rendering of the app
    render: function() {
        App.contracts.Distributor.deployed().then(function(instance){
            App.distributorInstance = instance;
            console.log(App.distributorInstance);
        });
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " +"<b>"+ App.account+"</b>");
            }
        });
        //$("#qrcode").hide();
    },
    // Submitting Distributor data to Ethereum network
    submitDistributorData: function(){
        var distributorName = $('#distributorName').val()+ ','; 
        var distributorTinNo = ','+ $('#distributorTinNo').val()+ ',';
        var distributorCountry = ','+ $('#distributorCountry').val()+ ',';
        var distributorLocation = ','+ $('#distributorLocation').val() +',';
        var manufacturerName = ','+ $('#manufacturerName').val() +',';
        var productNumber = ','+ $('#productNumber').val() +',';
        var productName = ','+ $('#productName').val() +',';
        var manufacturingCountry = ','+ $('#manufacturingCountry').val();
        App.distributorInstance.setDistributorDetails(App.account, 
            distributorTinNo,
            distributorName,
            distributorCountry,  
            distributorLocation,
            manufacturerName,
            productName,
            manufacturingCountry);
        var str =   "distributorName: " + distributorName + "\n" + 
                    "distributorTinNo: "+ distributorTinNo + "\n" +
                    "distributorCountry: "+ distributorCountry + "\n" +
                    "distributorLocation: "+ distributorLocation + "\n" +
                    "manufacturerName: "+ manufacturerName + "\n" +
                    "productNumber: "+ productNumber + "\n" +
                    "productName: "+ productName + "\n" +
                    "manufacturingCountry: "+ manufacturingCountry;
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
                        web3.eth.getTransactionFromBlock(App.blockNumber, function(error, res){
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
        $('#distributorName').val("");
        $('#distributorTinNo').val("");
        $('#distributorLocation').val("");
        $('#manufacturerName').val("");
        $('#productNumber').val("");
        $('#productName').val("");
        $('#productName').val("");
        $('#manufacturingCountry').val("");
    },

    submitTransactionHash: function() {
        var transactionBlock = parseInt($("#transactionBlockForDistributor").val())+1;
        console.log("Transaction Block: " + transactionBlock);
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
                obj.manufacturer = word[2]; //.substring(word[1]).lastIndexOf("@"), word[1].charAt(word[1].length - 1));
                obj.country = word[3];
                obj.batchNo = word[4];
                obj.prodNo = word[5];
                obj.modelName = word[6];
                obj.model = word[7];
                obj.prodLink = word[8];
                obj.manufacturingDate = word[9];
                console.log(obj);
            }
            $('#manufacturingCountry').val(obj.country);
            $('#manufacturerName').val(obj.manufacturer);
            $('#productNumber').val(obj.prodNo);
            $('#productName').val(obj.model +" "+obj.modelName);
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


  