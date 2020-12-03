import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('experimentsAccess')

import { ExperimentItem } from '../models/ExperimentItem'
import { ExperimentUpdate } from '../models/ExperimentUpdate'

export class ExperimentsAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly experimentsTable = process.env.EXPERIMENTS_TABLE,
    private readonly experimentsByUserIndex = process.env.EXPERIMENTS_BY_USER_INDEX,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)) {
  }

  // Check if experimentItem exists
  async experimentItemExists(experimentId: string): Promise<boolean> {
    const item = await this.getExperimentItem(experimentId)
    return !!item
  }

  // get specific experimentItem
  async getExperimentItem(experimentId: string): Promise<ExperimentItem> {
    logger.info(`Get specific experimentItem ${experimentId}`)

    const result = await this.docClient.get({
      TableName: this.experimentsTable,
      Key: {
        experimentId
      }
    }).promise()

    const item = result.Item

    return item as ExperimentItem
  }

  // get experimentItem for userId
  async getExperimentItemsUserId(userId: string): Promise<ExperimentItem[]> {
    logger.info(`Getting experimentItems for userId ${userId}`)

    const result = await this.docClient.query({
      TableName: this.experimentsTable,
      IndexName: this.experimentsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    return items as ExperimentItem[]
  }

  // create experimentItem
  async createExperimentItem(experimentItem: ExperimentItem) {
    logger.info(`Create experimentItem ${experimentItem.experimentId}`)
    console.log('Create experimentItem')
    await this.docClient.put({
      TableName: this.experimentsTable,
      Item: experimentItem
    }).promise()
  }

  // Update experimentItem
  async updateExperimentItem(experimentId: string, experimentUpdate: ExperimentUpdate) {
    logger.info(`Update experimentItem ${experimentId}`)
    console.log('Update experimentItem')
    await this.docClient.update({
      TableName: this.experimentsTable,
      Key: {
        experimentId
      },
      UpdateExpression: 'set #title = :title, description = :description',
      ExpressionAttributeNames: {
        "#title": "title"
      },
      ExpressionAttributeValues: {
        ":title": experimentUpdate.title,
        ":description": experimentUpdate.description
      }
    }).promise()
  }

  // Delete experimentItem
  async deleteExperimentItem(experimentId: string) {
    logger.info(`Delete experimentItem ${experimentId}`)
    console.log('Delete experimentItem')
    await this.docClient.delete({
      TableName: this.experimentsTable,
      Key: {
        experimentId
      }
    }).promise()   
  }

  // Generate Upload Url: createAttachmentUrl + getUploadUrl
  async createAttachmentUrl(experimentId: string, attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    
    await this.docClient.update({
      TableName: this.experimentsTable,
      Key: {
        experimentId
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

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
