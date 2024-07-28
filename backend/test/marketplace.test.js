const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Marketplace', function () {
  let marketplace;
  let owner;
  let seller;
  let buyer;

  beforeEach(async function () {
    // Get the test accounts
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy the Marketplace contract
    const Marketplace = await ethers.getContractFactory('Marketplace');
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();
  });

  it('should create a product', async function () {
    const name = 'Product1';
    const price = ethers.utils.parseEther('1');

    // Seller creates a product
    await marketplace.connect(seller).createProduct(name, price);

    // Retrieve the product
    const product = await marketplace.products(1);

    // Assertions
    expect(product.name).to.equal(name);
    expect(product.price.toString()).to.equal(price.toString()); // Ensure price is compared as a string
    expect(product.owner).to.equal(seller.address);
    expect(product.purchased).to.equal(false);
  });

  it('should purchase a product', async function () {
    const name = 'Product1';
    const price = ethers.utils.parseEther('1');

    // Seller creates a product
    await marketplace.connect(seller).createProduct(name, price);

    // Buyer purchases the product
    await marketplace.connect(buyer).purchaseProduct(1, { value: price });

    // Retrieve the product
    const product = await marketplace.products(1);

    // Assertions
    expect(product.owner).to.equal(buyer.address);
    expect(product.purchased).to.equal(true);
  });
});
