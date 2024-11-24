import { gql, useQuery } from '@apollo/client';

const GET_ORGANIZATION_CAMPAIGNS = gql`
  query OrganizationCampaigns($orgId: String!) {
    campaigns(where: { organization: $orgId }) {
      id
      name
      description
      target
      imageUrl
      totalDeposits
      organization {
        id
        name
      }
      isActive
      createdAt
    }
  }
`;

export function useOrganizationCampaigns(orgId: string | undefined) {
  return useQuery(GET_ORGANIZATION_CAMPAIGNS, {
    variables: { orgId },
    skip: !orgId,
  });
}