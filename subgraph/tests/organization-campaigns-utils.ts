import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  DepositMade,
  MemberJoined,
  OrganizationCreated
} from "../generated/OrganizationCampaigns/OrganizationCampaigns"

export function createCampaignCreatedEvent(
  campaignId: BigInt,
  name: string,
  orgId: BigInt,
  walletAddress: Address,
  imageUrl: string
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "walletAddress",
      ethereum.Value.fromAddress(walletAddress)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl))
  )

  return campaignCreatedEvent
}

export function createDepositMadeEvent(
  campaignId: BigInt,
  member: Address,
  amount: BigInt,
  timestamp: BigInt,
  newTotal: BigInt
): DepositMade {
  let depositMadeEvent = changetype<DepositMade>(newMockEvent())

  depositMadeEvent.parameters = new Array()

  depositMadeEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  depositMadeEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )
  depositMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  depositMadeEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  depositMadeEvent.parameters.push(
    new ethereum.EventParam(
      "newTotal",
      ethereum.Value.fromUnsignedBigInt(newTotal)
    )
  )

  return depositMadeEvent
}

export function createMemberJoinedEvent(
  orgId: BigInt,
  member: Address
): MemberJoined {
  let memberJoinedEvent = changetype<MemberJoined>(newMockEvent())

  memberJoinedEvent.parameters = new Array()

  memberJoinedEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  memberJoinedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )

  return memberJoinedEvent
}

export function createOrganizationCreatedEvent(
  orgId: BigInt,
  name: string,
  owner: Address,
  imageUrl: string,
  description: string
): OrganizationCreated {
  let organizationCreatedEvent = changetype<OrganizationCreated>(newMockEvent())

  organizationCreatedEvent.parameters = new Array()

  organizationCreatedEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  organizationCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  organizationCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  organizationCreatedEvent.parameters.push(
    new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl))
  )
  organizationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return organizationCreatedEvent
}
