import { NavigateOptions } from '@reach/router'
import API from 'decentraland-gatsby/dist/utils/api/API'
import { navigate as gatsbyNavigate } from 'gatsby'

import { NewGrantCategory } from '../entities/Grant/types'
import { CatalystType, HiringType, PoiType, ProposalStatus, ProposalType } from '../entities/Proposal/types'

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || '/'

export function toProposalListPage(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Math.max(1, value)
  } else if (typeof value === 'string') {
    const page = Number(value)
    return Number.isFinite(page) ? Math.max(1, page) : 1
  } else {
    return 1
  }
}

export type ProposalListPage = {
  page: string
}

export type ProposalsStatusFilter = {
  status: ProposalStatus
}

export type ProposalsTypeFilter = {
  type: ProposalType
}

export type GrantCategoryTypeFilter = {
  subtype: NewGrantCategory
}

export type ProposalsModal = {
  modal: 'new'
}

export function url(path = '/', query: Record<string, string> | URLSearchParams = {}) {
  return API.url(GATSBY_BASE_URL, path, query)
}

export default {
  home: () => url('/'),
  proposals: (
    options:
      | Partial<
          ProposalListPage & ProposalsStatusFilter & ProposalsTypeFilter & GrantCategoryTypeFilter & ProposalsModal
        >
      | URLSearchParams = {}
  ) => url('/proposals/', options),
  proposal: (
    proposalId: string,
    options: {
      new?: 'true'
      newUpdate?: 'true'
      pending?: 'true'
      bid?: 'true'
      anchor?: string
    } = {}
  ) => {
    const { anchor, ...otherOptions } = options
    const anchorFragment = anchor ? `#${anchor}` : ''
    return url(`/proposal/`, { id: proposalId, ...otherOptions }) + anchorFragment
  },
  submit: (
    type?: ProposalType,
    options: {
      linked_proposal_id?: string
      request?: PoiType | HiringType | CatalystType
      category?: NewGrantCategory
    } = {}
  ) => url(type ? `/submit/${String(type).replace('_', '-')}/` : '/submit/', options),
  submitUpdate: (options: { id?: string; proposalId: string }) => url('/submit/update/', options),
  profile: (options: Partial<{ address: string }> = {}) => url('/profile/', options),
  transparency: () => url('/transparency/'),
  debug: () => url('/debug/'),
  welcome: () => url('/welcome/', {}),
  update: (id: string) => url('/update/', { id }),
  projects: () => url('/projects/', {}),
  edit: {
    update: (id: string) => url('edit/update/', { id }),
  },
}

// TODO: Type this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function navigate(to: string, options?: NavigateOptions<any>) {
  if (typeof window === 'undefined') {
    return
  }
  gatsbyNavigate(to, options)
}
