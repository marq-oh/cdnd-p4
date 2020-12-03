import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { createExperiment } from '../../businessLogic/experiments'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createExperiment')

import { getUserId } from '../../auth/utils'
import { CreateExperimentRequest } from '../../requests/CreateExperimentRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createExperiment event', { event })

  // Set data
  const userId = getUserId(event)
  const newData: CreateExperimentRequest = JSON.parse(event.body)

  // Create Experiment
  const newExperiment = await createExperiment(userId, newData)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newExperiment
    })
  }
}
