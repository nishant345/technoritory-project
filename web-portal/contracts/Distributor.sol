pragma solidity ^0.5.0;

contract Distributor {
    //Model Distributor Details
    struct DistributorDetails {
        string distributorTinNo;
        string distributorName;
        string distributorCountry;
        string distributorLocation;
        string manufacturerName;
        string productName;
        string manufacturingCountry;
    }
    //store Distributor
    //fetch Distributor
    mapping(address => DistributorDetails) public distributors;

    //store total no of products
    address[] public distributorAccounts;

    //set details of the product and producer
    function setDistributorDetails (
        address _address,
        string memory _distributorTinNo, 
        string memory _distributorName, 
        string memory _distributorCountry,
        string memory _distributorLocation,
        string memory _manufacturerName,
        string memory _productName,
        string memory _manufacturingCountry) public {
        DistributorDetails storage distributor = distributors[_address];

        distributor.distributorTinNo = _distributorTinNo;
        distributor.distributorName = _distributorName;
        distributor.distributorCountry = _distributorCountry;
        distributor.distributorLocation = _distributorLocation;
        distributor.manufacturerName = _manufacturerName;
        distributor.productName = _productName;
        distributor.manufacturingCountry = _manufacturingCountry;

        distributorAccounts.push(_address)-1;
    }
    function countDistributors() public view  returns (uint) {
        return distributorAccounts.length;
    }

    function getDistributor() public view  returns (address[] memory) {
        return distributorAccounts;
    }

    function storeTransactionHashForDistributor() public view  returns (address) {
    }
}