import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todosAccess')

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = XAWS.DynamoDB.createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)) {
  }

  // Check if todoItem exists
  async todoItemExists(todoId: string): Promise<boolean> {
    const item = await this.getTodoItem(todoId)
    return !!item
  }

  // get specific todoItem
  async getTodoItem(todoId: string): Promise<TodoItem> {
    logger.info(`Get specific todoItem ${todoId}`)

    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId
      }
    }).promise()

    const item = result.Item

    return item as TodoItem
  }

  // get todoItem for userId
  async getTodoItemsUserId(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting todoItems for userId ${userId}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    return items as TodoItem[]
  }

  // create todoItem
  async createTodoItem(todoItem: TodoItem) {
    logger.info(`Create todoItem ${todoItem.todoId}`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  // Update todoItem
  async updateTodoItem(todoId: string, todoUpdate: TodoUpdate) {
    logger.info(`Update todoItem ${todoId}`)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done
      }
    }).promise()
  }

  // Delete todoItem
  async deleteTodoItem(todoId: string) {
    logger.info(`Delete todoItem ${todoId}`)

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId
      }
    }).promise()   
  }

  // Generate Upload Url: createAttachmentUrl + getUploadUrl
  async createAttachmentUrl(todoId: string, attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()

    return attachmentUrl
  }
  
  async getUploadUrl(attachmentId: string): Promise<string> {
    // For presigned URL
    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    })

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.urlExpiration
    })
    return uploadUrl
  }
}