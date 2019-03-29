
App = {
    // variable declaration
    web3Provider: null,
    web3_abi: null,
    contracts: {},
    accounts: '0x0',
    account: null,
    producerInstance: null,
    manufacturerInstance: null,
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
        $.getJSON("../Manufacturer.json", function(manufacturer) {
            App.abi = manufacturer.abi;
            //Instantiate a new truffle contract from the artifact
            App.contracts.Manufacturer = TruffleContract(manufacturer);
            // Connect provider to interact with contract
            App.contracts.Manufacturer.setProvider(App.web3Provider);
            return App.render();
        });
    },
    // Initial rendering of the app
    render: function() {
        App.contracts.Manufacturer.deployed().then(function(instance){
            App.manufacturerInstance = instance;
            console.log(App.manufacturerInstance);
            App.manufacturerInstance.countManufacturers().then(function(cm){
                App.productsCount = cm;
            });
        });
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " +"<b>"+ App.account+"</b>");
            }
        });

        $("#qrcode").hide();
    },

    submitData: function(){
        var productName =  $('#productName').val()+ ','; 
        var productType = $('#productType').val()+ ',';
        //var manufacturingDate = $('#manufacturerDate').val()+ ',';
        var productNo = $('#productNo').val()+ ',';
        var manufacturingCountry = $('#manufacturingCountry').val()+ ',';
        var productLink = $('#productLink').val()+ ',';
        var manufacturerName = ',' + $('#manufacturerName').val()+ ',';
        var batchNo = $('#batchNo').val()+ ',';
        // productName + ","+ productType + ","+ manufacturingDate + ","+ productNo+ ","+manufacturingCountry + ","+ productLink+ ","+manufacturerName+ ","+batchNo;
        //var dbParam = {};
        //dbParam.productName = productName;
        
        App.manufacturerInstance.setProductDetails(App.account, 
            manufacturerName, 
            manufacturingCountry, 
            batchNo, 
            productNo, 
            productName, 
            productType, 
            productLink);
        var str = "manufacturerName: " + manufacturerName + "\n" + 
                "manufacturingCountry: "+ manufacturingCountry + "\n" +
                "batchNo: "+ batchNo + "\n" + 
                "productName: "+ productName + "\n" + 
                "productNo: " + productNo+ "\n" +
                "productType: " + productType+ "\n" +
                "productType: " + productType;
        console.log(str);
        App.encrypted = encrypt(str);
        App.qrcode.makeCode(str);
        
        // console.log(decrypt(App.encrypted).toString(CryptoJS.enc.Utf8));
        $("#qrcode").show();
        web3.eth.getBlockNumber(function(error, result){
            if(!error){
                App.blockNumber = parseInt(result);
                web3.eth.getBlock(App.blockNumber, function(error, result){
                    if(!error){
                        console.log(result);
                        App.blockHash = result.hash;
                        $("#transactionHash").html("Your Transaction Hash: " + "<b>"+ result.transactions[0] +"</b>");
                        $("#blockHash").html("Your Block Hash: " + "<b>"+ App.blockHash +"</b>");
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
                                obj.manufacturer = word[2];
                                obj.country = word[3];
                                obj.batchNo = word[4];
                                obj.prodNo = word[5];
                                obj.modelName = word[6];
                                obj.model = word[7];
                                obj.prodLink = word[8];
                                App.productsJson.push(obj);
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
        $('#productName').val("");
        $('#productType').val("");
        $('#productNo').val("");
        $('#productLink').val("");
        $('#manufacturerName').val("");
        $('#manufacturingCountry').val("");
        $('#batchNo').val("");
    },
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


  