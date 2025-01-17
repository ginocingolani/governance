import { def, get } from 'bdd-lazy-var/getter'

import { decodeSurvey } from './decoder'
import { Reaction, Topic, TopicFeedback } from './types'

const TOPIC_1: Topic = { topic_id: '12345' }
const TOPIC_2: Topic = { topic_id: '22222' }
const TOPIC_3: Topic = { topic_id: '33333' }

const SENTIMENT_SURVEY: TopicFeedback[] = [
  { ...TOPIC_1, reaction: Reaction.NEUTRAL },
  { ...TOPIC_2, reaction: Reaction.LOVE },
  { ...TOPIC_3, reaction: Reaction.EMPTY },
]

describe('decode', () => {
  def('decodedSurvey', () => decodeSurvey(get.encodedSurvey))

  describe('and empty survey', () => {
    def('encodedSurvey', () => '')

    it('should be encoded into an empty array', () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with different topic feedbacks', () => {
    def('encodedSurvey', () => {
      return {
        survey: [
          { topic_id: '12345', reaction: 'neutral' },
          { topic_id: '22222', reaction: 'love' },
          { topic_id: '33333', reaction: 'empty' },
        ],
      }
    })

    it('should be encoded into a sentiment survey', () => {
      expect(get.decodedSurvey).toEqual(SENTIMENT_SURVEY)
    })
  })

  describe('a survey with unknown topics and valid reactions', () => {
    def('encodedSurvey', () => {
      return {
        survey: [
          { topic_id: 'unknown', reaction: 'love' },
          { topic_id: 'whatevs', reaction: 'concerned' },
        ],
      }
    })

    it('returns a parsed survey', async () => {
      expect(get.decodedSurvey).toEqual([
        {
          reaction: 'love',
          topic_id: 'unknown',
        },
        {
          reaction: 'concerned',
          topic_id: 'whatevs',
        },
      ])
    })
  })

  describe('a survey with unknown topics and invalid reactions', () => {
    def('encodedSurvey', () => {
      return {
        survey: [
          { topic_id: 'unknown', reaction: 'luv' },
          { topic_id: 'whatevs', reaction: 'conzerned' },
        ],
      }
    })

    it('returns an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with no topics or reactions', () => {
    def('encodedSurvey', () => {
      return { survey: ['asd', 'asdasd', '🙂', {}, null] }
    })

    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with a different format', () => {
    def('encodedSurvey', () => {
      return [{ topic: { label: 'something' }, reaction: {} }]
    })
    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with a wrong topic format', () => {
    def('encodedSurvey', () => {
      return { survey: [{ topic: { topic_id: 'something' }, reaction: {} }] }
    })
    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with an empty reaction', () => {
    def('encodedSurvey', () => {
      return { survey: [{ topic_id: '1234', reaction: {} }] }
    })
    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with an invalid reaction', () => {
    def('encodedSurvey', () => {
      return { survey: [{ topic_id: '1234', reaction: 'lov' }] }
    })
    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey encoded as a string', () => {
    def('encodedSurvey', () => {
      return `{"survey":[{ topic_id: '12345', reaction: 'neutral' }, { topic_id: '22222' , reaction: 'love' }, { topic_id: '33333', reaction: 'empty' }]}`
    })

    it('should return an empty survey', async () => {
      expect(get.decodedSurvey).toEqual([])
    })
  })

  describe('a survey with repeated topic ids', () => {
    def('encodedSurvey', () => {
      return {
        survey: [
          { topic_id: '12345', reaction: 'neutral' },
          { topic_id: '22222', reaction: 'love' },
          { topic_id: '22222', reaction: 'love' },
          { topic_id: '33333', reaction: 'concerned' },
          { topic_id: '33333', reaction: 'empty' },
        ],
      }
    })

    it('returns the first appearance of each repeated topic', async () => {
      expect(get.decodedSurvey).toEqual([
        { topic_id: '12345', reaction: 'neutral' },
        { topic_id: '22222', reaction: 'love' },
        { topic_id: '33333', reaction: 'concerned' },
      ])
    })
  })

  describe('a survey with a mixture of valid and invalid data', () => {
    def('encodedSurvey', () => {
      return {
        survey: [
          { topic_id: 'unknown', reaction: 'luv' },
          { topic_id: 'whatevs', reaction: 'conzerned' },
          { topic_id: '12345', reaction: 'love' },
          { something_wrong: '12345', reaction: 'love' },
          { topic_id: { something_wrong: '12345' }, reaction: 'love' },
          [],
          "I'm a string",
          {},
          { topic_id: '55555', reaction: 'empty' },
        ],
      }
    })

    it('returns a survey with correct topic format and valid reactions', async () => {
      expect(get.decodedSurvey).toEqual([
        {
          reaction: 'love',
          topic_id: '12345',
        },
        {
          reaction: 'empty',
          topic_id: '55555',
        },
      ])
    })
  })
})
