import { gql, useQuery } from '@apollo/client';

const GET_CAMPAIGN_DEPOSITS = gql`
  query GetCampaignDeposits($campaignId: String!, $walletAddress: String, $first: Int = 10, $skip: Int = 0) {
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

const GET_ALL_DEPOSITS = gql`
  query GetAllDeposits {
    deposits(first: 1000) {
      donor {
        address
      }
    }
  }
`;


export function useCampaignDeposits(campaignId: string, first = 10, skip = 0) {
  return useQuery(GET_CAMPAIGN_DEPOSITS, {
    variables: { campaignId, first, skip },
    skip: !campaignId
  });
}

export function useAllDeposits() {
  return useQuery(GET_ALL_DEPOSITS);
}