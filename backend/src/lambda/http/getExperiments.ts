import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getExperiments } from '../../businessLogic/experiments'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getExperiments')

import { getUserId } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getExperiment event', { event })
  
  // Set data
  const userId = getUserId(event)
  logger.info('UserID: ', { event })

  // console.log('User ID: ' + userId)

  // Get Experiments
  const items = await getExperiments(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}