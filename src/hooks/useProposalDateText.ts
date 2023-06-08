import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import Time from 'decentraland-gatsby/dist/utils/date/Time'

export function getDateKey(startAt: Date, finishAt: Date) {
  const now = Time()

  if (now.isBefore(startAt)) {
    return 'starts_date'
  }

  if (now.isBefore(Time(finishAt))) {
    return 'ends_date'
  }

  return 'ended_date'
}

export function useProposalDateText(startAt: Date, finishAt: Date) {
  const t = useFormatMessage()
  const value = Time().isBefore(startAt) ? startAt : finishAt

  return t(`page.home.open_proposals.${getDateKey(startAt, finishAt)}`, {
    value: Time(value).fromNow(),
  })
}