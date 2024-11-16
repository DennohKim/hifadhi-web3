import {
  CampaignCreated as CampaignCreatedEvent,
  DepositMade as DepositMadeEvent,
  MemberJoined as MemberJoinedEvent,
  OrganizationCreated as OrganizationCreatedEvent
} from "../generated/OrganizationCampaigns/OrganizationCampaigns"
import {
  CampaignCreated,
  DepositMade,
  MemberJoined,
  OrganizationCreated
} from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.name = event.params.name
  entity.orgId = event.params.orgId
  entity.walletAddress = event.params.walletAddress
  entity.imageUrl = event.params.imageUrl

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositMade(event: DepositMadeEvent): void {
  let entity = new DepositMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.member = event.params.member
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp
  entity.newTotal = event.params.newTotal

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMemberJoined(event: MemberJoinedEvent): void {
  let entity = new MemberJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orgId = event.params.orgId
  entity.member = event.params.member

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrganizationCreated(
  event: OrganizationCreatedEvent
): void {
  let entity = new OrganizationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orgId = event.params.orgId
  entity.name = event.params.name
  entity.owner = event.params.owner
  entity.imageUrl = event.params.imageUrl
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
