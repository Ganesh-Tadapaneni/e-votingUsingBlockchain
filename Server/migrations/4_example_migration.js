// SPDX-License-Identifier: MIT
const Election = artifacts.require("Election");

module.exports = async function (deployer) {
  // Deploy Election contract
  await deployer.deploy(Election); // No initial owner parameter needed
  
  // You can add additional steps here if needed, such as setting up initial state or performing additional configurations
};
