import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { updateExperiment } from '../../businessLogic/experiments'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateExperiment')

import { UpdateExperimentRequest } from '../../requests/UpdateExperimentRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateExperiment event', { event })

  // Get Parameters
  const experimentId = event.pathParameters.experimentId
  const newData: UpdateExperimentRequest = JSON.parse(event.body)

  // Update
  const updatedItem = await updateExperiment(experimentId, newData)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}
