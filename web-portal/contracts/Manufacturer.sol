pragma solidity ^0.5.0;

contract Manufacturer {
    //Model Product Details
    struct ProductInfo {
        string manufacturerName;
        string manufacturingCountry;
        string batch;
        string productNumber;
        string productName;
        string productType;
        string productLink;
    }
    //store products
    //fetch products
    mapping(address => ProductInfo) public products;
    //address array to store manufacturer accounts
    address[] public manufacturerAccounts;

    //set details of the product and producer
    function setProductDetails (
        address _address,
        string memory _manufacturerName,
        string memory _manufacturingCountry,
        string memory _batch,
        string memory _productNumber,
        string memory _productName, 
        string memory _productType, 
        string memory _productLink) public {
        ProductInfo storage product = products[_address];

        product.manufacturerName = _manufacturerName;
        product.manufacturingCountry = _manufacturingCountry;
        product.batch = _batch;
        product.productNumber = _productNumber;
        product.productName = _productName;
        product.productType = _productType;
        product.productLink = _productLink;

        manufacturerAccounts.push(_address)-1;
    }

    function getManufacturers() public view  returns (address[] memory) {
        return manufacturerAccounts;
    }
    
    function getManufacturer(address _address) public view  returns (
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        string memory,
        string memory) {
        return(
            products[_address].manufacturerName,
            products[_address].manufacturingCountry,
            products[_address].batch,
            products[_address].productNumber,
            products[_address].productName,
            products[_address].productType,
            products[_address].productLink
        );
    }
    
    function countManufacturers() public view  returns (uint) {
        return manufacturerAccounts.length;
    }

    function storeTransactionHashForManufacturer() public view  returns (address) {
    }
}