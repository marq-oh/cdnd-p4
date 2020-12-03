import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

import { getUserId } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getTodo event', { event })
  
  // Set data
  const userId = getUserId(event)
  logger.info('UserID: ', { event })

  // console.log('User ID: ' + userId)

  // Get ToDos
  const items = await getTodos(userId)

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