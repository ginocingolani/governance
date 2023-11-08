import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { calculateMatch } from '../entities/Snapshot/utils'

import { DEFAULT_QUERY_STALE_TIME } from './constants'
import useAddressVotes from './useAddressVotes'

export default function useVotesMatch(userAccount: string | null, otherAccount: string | null) {
  const { votes: userVotes, isLoadingVotes: userVotesLoading } = useAddressVotes(userAccount)

  const { data: otherAccountVotes, isLoading: otherAccountVotesLoading } = useQuery({
    queryKey: [`otherAccountVotes#${otherAccount}`],
    queryFn: async () => {
      if (!otherAccount) {
        return null
      }
      return Governance.get().getAddressVotesWithProposals(otherAccount)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  return {
    userVotes,
    otherAccountVotes,
    matchResult: calculateMatch(userVotes ?? null, otherAccountVotes ?? null),
    votesInformationLoading: userVotesLoading || otherAccountVotesLoading,
  }
}
