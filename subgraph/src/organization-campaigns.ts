// import {
//   CampaignCreated as CampaignCreatedEvent,
//   DepositMade as DepositMadeEvent,
//   MemberJoined as MemberJoinedEvent,
//   OrganizationCreated as OrganizationCreatedEvent
// } from "../generated/OrganizationCampaigns/OrganizationCampaigns"
// import {
//   CampaignCreated,
//   DepositMade,
//   MemberJoined,
//   OrganizationCreated
// } from "../generated/schema"

// export function handleCampaignCreated(event: CampaignCreatedEvent): void {
//   let entity = new CampaignCreated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.campaignId = event.params.campaignId
//   entity.name = event.params.name
//   entity.orgId = event.params.orgId
//   entity.walletAddress = event.params.walletAddress
//   entity.imageUrl = event.params.imageUrl

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleDepositMade(event: DepositMadeEvent): void {
//   let entity = new DepositMade(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.campaignId = event.params.campaignId
//   entity.member = event.params.member
//   entity.amount = event.params.amount
//   entity.timestamp = event.params.timestamp
//   entity.newTotal = event.params.newTotal

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleMemberJoined(event: MemberJoinedEvent): void {
//   let entity = new MemberJoined(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.orgId = event.params.orgId
//   entity.member = event.params.member

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleOrganizationCreated(
//   event: OrganizationCreatedEvent
// ): void {
//   let entity = new OrganizationCreated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.orgId = event.params.orgId
//   entity.name = event.params.name
//   entity.owner = event.params.owner
//   entity.imageUrl = event.params.imageUrl
//   entity.description = event.params.description

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

import { BigInt } from "@graphprotocol/graph-ts";
import {
  CampaignCreated as CampaignCreatedEvent,
  DepositMade as DepositMadeEvent,
  MemberJoined as MemberJoinedEvent,
  OrganizationCreated as OrganizationCreatedEvent,
  OrganizationCampaigns,
  CampaignTargetReached as CampaignTargetReachedEvent,
} from "../generated/OrganizationCampaigns/OrganizationCampaigns";
import { Campaign, Deposit, Member, Organization } from "../generated/schema";

export function handleOrganizationCreated(
  event: OrganizationCreatedEvent
): void {
  let organization = new Organization(event.params.orgId.toString());
  organization.name = event.params.name;
  organization.description = event.params.description;
  organization.imageUrl = event.params.imageUrl;
  organization.owner = event.params.owner;
  organization.createdAt = event.block.timestamp;
  organization.save();
}

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.campaignId.toString());
  let contract = OrganizationCampaigns.bind(event.address);
  let campaignDetails = contract.getCampaignDetails(event.params.campaignId);

  campaign.name = event.params.name;
  campaign.description = campaignDetails.value1;
  campaign.imageUrl = event.params.imageUrl;
  campaign.walletAddress = event.params.walletAddress;
  campaign.organization = event.params.orgId.toString();
  campaign.totalDeposits = BigInt.fromI32(0);
  campaign.target = event.params.target; 
  campaign.isActive = true;
  campaign.createdAt = event.block.timestamp;
  campaign.save();
}

export function handleCampaignTargetReached(
  event: CampaignTargetReachedEvent
): void {
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (campaign) {
    campaign.isActive = false;
    campaign.save();
  }
}

export function handleMemberJoined(event: MemberJoinedEvent): void {
  let memberId = event.params.member.toHexString();
  let member = Member.load(memberId);

  if (!member) {
    member = new Member(memberId);
    member.address = event.params.member;
    member.organization = event.params.orgId.toString();
    member.joinedAt = event.block.timestamp;
    member.save();
  }
}

export function handleDepositMade(event: DepositMadeEvent): void {
  let depositId =
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let deposit = new Deposit(depositId);

  // Get campaign to find orgId
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (!campaign) {
    return; // Exit if campaign not found
  }

  // Create or load member
  let memberId = event.params.member.toHexString();
  let member = Member.load(memberId);
  if (!member) {
    member = new Member(memberId);
    member.address = event.params.member;
    member.organization = campaign.organization; // Use campaign's organization
    member.joinedAt = event.block.timestamp;
    member.save();
  }

  deposit.campaign = event.params.campaignId.toString();
  deposit.donor = memberId;
  deposit.amount = event.params.amount;
  deposit.timestamp = event.params.timestamp;
  deposit.cumulativeAmount = event.params.newTotal;
  deposit.transactionHash = event.transaction.hash;
  deposit.save();

  // Update campaign total deposits
  campaign.totalDeposits = campaign.totalDeposits.plus(event.params.amount);
  campaign.save();
}
