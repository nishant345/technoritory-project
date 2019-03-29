pragma solidity ^0.5.0;

contract Retailer {
    //Model Retailer Details
    struct RetailerDetails {
        string retailerTinNo;
        string retailerName;
        string retailerCountry;
        string retailerLocation;
        string distributorDetails;
        string manufacturerDetails;
        string productDetails;
    }
    //store Distributor
    //fetch Distributor
    mapping(address => RetailerDetails) public retailers;

    //store total no of products
    address[] public retailerAccounts;

    //set details of the product and producer
    function setRetailerDetails (
        address _address,
        string memory _retailerTinNo, 
        string memory _retailerName,
        string memory _retailerCountry,
        string memory _retailerLocation,
        string memory _distributorDetails,
        string memory _manufacturerDetails,
        string memory _productDetails) public {
        RetailerDetails storage retailer = retailers[_address];

        retailer.retailerTinNo = _retailerTinNo;
        retailer.retailerName = _retailerName;
        retailer.retailerCountry = _retailerCountry;
        retailer.retailerLocation = _retailerLocation;
        retailer.distributorDetails = _distributorDetails;
        retailer.manufacturerDetails = _manufacturerDetails;
        retailer.productDetails = _productDetails;

        retailerAccounts.push(_address)-1;
    }
    function countRetailer() public view  returns (uint) {
        return retailerAccounts.length;
    }

    function getRetailer() public view  returns (address[] memory) {
        return retailerAccounts;
    }

    function storeTransactionHashForRetailer() public view  returns (address) {
    }
}