// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/OrganisationCampaigns.sol";
import "../src/MockUSDC.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockUSDC first
        MockUSDC mockUSDC = new MockUSDC();
        
        // Deploy OrganizationCampaigns with MockUSDC address
        OrganizationCampaigns organizationCampaigns = new OrganizationCampaigns(address(mockUSDC));

        vm.stopBroadcast();

        console.log("MockUSDC deployed to:", address(mockUSDC));
        console.log("OrganizationCampaigns deployed to:", address(organizationCampaigns));
    }
}