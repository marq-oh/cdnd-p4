import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE
// const attachmentsTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

// For presigned URL
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  // Get Parameters
  const attachmentId = uuid.v4()
 
  // Generate and create URL
  const uploadUrl = await getUploadUrl(attachmentId)
  const attachmentUrl = await createAttachmentUrl(attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl,
      attachmentUrl
    })
  }
}

async function createAttachmentUrl(attachmentId: string): Promise<string> {
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
  return attachmentUrl
}

async function getUploadUrl(attachmentId: string): Promise<string> {
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  })
  return uploadUrl
}