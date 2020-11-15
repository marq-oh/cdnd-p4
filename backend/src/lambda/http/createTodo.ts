import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

import { getUserId } from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createTodo event', { event })

  // Set data
  const userId = getUserId(event)
  const newData: CreateTodoRequest = JSON.parse(event.body)

  // Create ToDo
  const newItem = await createTodo(userId, newData)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}
