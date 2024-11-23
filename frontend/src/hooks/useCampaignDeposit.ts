import { gql, useQuery } from '@apollo/client';

const GET_CAMPAIGN_DEPOSITS = gql`
  query GetCampaignDeposits($campaignId: String!, $first: Int = 10, $skip: Int = 0) {
    deposits(
      first: $first
      skip: $skip
      where: { campaign: $campaignId }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      donor {
        id
        address
      }
      amount
      timestamp
      cumulativeAmount
      transactionHash
    }
  }
`;

export function useCampaignDeposits(campaignId: string, first = 10, skip = 0) {
  return useQuery(GET_CAMPAIGN_DEPOSITS, {
    variables: { campaignId, first, skip },
    skip: !campaignId
  });
}