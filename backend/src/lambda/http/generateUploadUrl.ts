import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as uuid from 'uuid'

import { getUploadUrl, createAttachmentUrl } from '../../businessLogic/experiments'
import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUploadUrl event', { event })

  // Set data
  const experimentId = event.pathParameters.experimentId
  const attachmentId = uuid.v4()
 
  // Generate and create URL
  const uploadUrl = await getUploadUrl(attachmentId)
  const attachmentUrl = await createAttachmentUrl(experimentId, attachmentId)

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