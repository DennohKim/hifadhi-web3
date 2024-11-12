// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OrganizationCampaigns is ReentrancyGuard {

    struct Organization {
        string name;
        string imageUrl;
        string description;
        address owner;
        uint256 orgId;      
        bool isActive;
        mapping(address => bool) members;
    }

    struct Campaign {
        string name;
        string description;
        string imageUrl;
        address payable walletAddress;
        uint256 orgId;      
        uint256 totalDeposits;
        bool isActive;
        mapping(address => uint256) memberDeposits;
    }

    // Constants
    uint256 public constant MINIMUM_CONTRIBUTION = 5 * 10**6; // 5 USDC (6 decimals)
    IERC20 public immutable USDC;

    // Storage
    mapping(uint256 => Organization) public organizations;    
    mapping(address => uint256[]) public userOrganizations;  
    mapping(address => uint256[]) public memberOrganizations; 
    mapping(uint256 => Campaign) public campaigns;
    
    uint256 public organizationCount;
    uint256 public campaignCount;
    
    // Events
    event OrganizationCreated(
        uint256 indexed orgId,
        string name,
        address indexed owner,
        string imageUrl,
        string description
    );
    
    event CampaignCreated(
        uint256 indexed campaignId,
        string name,
        uint256 indexed orgId,
        address indexed walletAddress,
        string imageUrl
    );
    
    event MemberJoined(
        uint256 indexed orgId,
        address indexed member
    );
    
    event DepositMade(
        uint256 indexed campaignId,
        address indexed member,
        uint256 amount,
        uint256 timestamp,
        uint256 newTotal
    );

    constructor(address _usdcAddress) {
        require(_usdcAddress != address(0), "Invalid USDC address");
        USDC = IERC20(_usdcAddress);
    }

    // Modifiers
    modifier onlyOrgOwner(uint256 _orgId) {
        require(
            organizations[_orgId].owner == msg.sender,
            "Not the organization owner"
        );
        _;
    }

    modifier orgExists(uint256 _orgId) {
        require(
            organizations[_orgId].isActive,
            "Organization does not exist"
        );
        _;
    }

    modifier isMember(uint256 _orgId) {
        require(
            organizations[_orgId].members[msg.sender],
            "Not a member of the organization"
        );
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        _;
    }

    function createOrganization(
        string memory _name,
        string memory _imageUrl,
        string memory _description
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");
        
        uint256 newOrgId = organizationCount;
        
        Organization storage org = organizations[newOrgId];
        org.name = _name;
        org.imageUrl = _imageUrl;
        org.description = _description;
        org.owner = msg.sender;
        org.orgId = newOrgId;
        org.isActive = true;
        org.members[msg.sender] = true;
        
        userOrganizations[msg.sender].push(newOrgId);
        memberOrganizations[msg.sender].push(newOrgId);

        emit OrganizationCreated(newOrgId, _name, msg.sender, _imageUrl, _description);
        
        organizationCount++;
        return newOrgId;
    }

    function createCampaign(
        uint256 _orgId,
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        address payable _walletAddress
    ) 
        external 
        orgExists(_orgId) 
        onlyOrgOwner(_orgId)
        returns (uint256)
    {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");

        uint256 campaignId = campaignCount;
        Campaign storage campaign = campaigns[campaignId];
        
        campaign.name = _name;
        campaign.description = _description;
        campaign.imageUrl = _imageUrl;
        campaign.walletAddress = _walletAddress;
        campaign.orgId = _orgId;
        campaign.isActive = true;

        emit CampaignCreated(campaignId, _name, _orgId, _walletAddress, _imageUrl);
        
        campaignCount++;
        return campaignId;
    }

    function joinOrganization(uint256 _orgId) 
        external 
        orgExists(_orgId) 
    {
        require(
            !organizations[_orgId].members[msg.sender],
            "Already a member"
        );

        organizations[_orgId].members[msg.sender] = true;
        memberOrganizations[msg.sender].push(_orgId);

        emit MemberJoined(_orgId, msg.sender);
    }

    function deposit(uint256 _campaignId, uint256 _amount) 
        external 
        nonReentrant 
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            organizations[campaign.orgId].members[msg.sender],
            "Not a member of the organization"
        );
        require(_amount >= MINIMUM_CONTRIBUTION, "Deposit below minimum");
        
        require(
            USDC.balanceOf(msg.sender) >= _amount,
            "Insufficient USDC balance"
        );
        
        require(
            USDC.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient USDC allowance"
        );

        require(
            USDC.transferFrom(msg.sender, campaign.walletAddress, _amount),
            "USDC transfer failed"
        );

        campaign.totalDeposits = campaign.totalDeposits + _amount;
        campaign.memberDeposits[msg.sender] = campaign.memberDeposits[msg.sender] + _amount;

        emit DepositMade(
            _campaignId,
            msg.sender,
            _amount,
            block.timestamp,
            campaign.memberDeposits[msg.sender]
        );
    }

    // View functions
    function getOrganizationCount() external view returns (uint256) {
        return organizationCount;
    }

    function getCampaignCount() external view returns (uint256) {
        return campaignCount;
    }

    function getUserOrganizations(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userOrganizations[_user];
    }

    function getMemberOrganizations(address _member) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return memberOrganizations[_member];
    }

    function getOrganizationDetails(uint256 _orgId)
        external
        view
        returns (
            string memory name,
            string memory imageUrl,
            string memory description,
            address owner,
            bool isActive,
            uint256 orgId
        )
    {
        Organization storage org = organizations[_orgId];
        return (
            org.name,
            org.imageUrl,
            org.description,
            org.owner,
            org.isActive,
            org.orgId
        );
    }

    function getCampaignDetails(uint256 _campaignId)
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory imageUrl,
            address walletAddress,
            uint256 orgId,
            uint256 totalDeposits,
            bool isActive
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.name,
            campaign.description,
            campaign.imageUrl,
            campaign.walletAddress,
            campaign.orgId,
            campaign.totalDeposits,
            campaign.isActive
        );
    }

    function getMemberDeposits(uint256 _campaignId, address _member) 
        external 
        view 
        returns (uint256) 
    {
        return campaigns[_campaignId].memberDeposits[_member];
    }

    function isMemberOfOrganization(uint256 _orgId, address _member) 
        external 
        view 
        returns (bool) 
    {
        return organizations[_orgId].members[_member];
    }

    function getOrganizationCampaigns(uint256 _orgId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory orgCampaigns = new uint256[](campaignCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].orgId == _orgId && campaigns[i].isActive) {
                orgCampaigns[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = orgCampaigns[i];
        }
        
        return result;
    }

    // USDC specific functions
    function getMinimumContribution() external pure returns (uint256) {
        return MINIMUM_CONTRIBUTION;
    }

    function getUSDCAddress() external view returns (address) {
        return address(USDC);
    }
}