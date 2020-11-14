import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const imagesTable = process.env.IMAGES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  // Get Parameter
  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(todoId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'ToDo does not exist'
      })
    }
  }

  const imageId = uuid.v4()
  const newItem = await createImage(todoId, imageId, event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem
    })
  }
}

async function todoExists(todoId: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        id: todoId
      }
    })
    .promise()

  console.log('Get todo: ', result)
  return !!result.Item
}

async function createImage(todoId: string, imageId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)

  const newItem = {
    todoId,
    timestamp,
    imageId,
    ...newImage,
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  return newItem
}
