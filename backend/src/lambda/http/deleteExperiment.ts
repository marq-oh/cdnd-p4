import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { deleteExperiment } from '../../businessLogic/experiments'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteExperiment')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing deleteExperiment event', { event })

  // Set data
  const experimentId = event.pathParameters.experimentId

  // Delete Experiment
  await deleteExperiment(experimentId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
