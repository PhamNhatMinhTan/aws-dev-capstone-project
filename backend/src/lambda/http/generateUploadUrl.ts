import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { createAttachmentPresignedUrl, uploadProductImage } from '../../businessLogic/products'
import { getUserId } from '../utils'
import * as uuid from 'uuid';


const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Generate Presigned URL ---------------")

    const userId = getUserId(event)
    const productId = event.pathParameters.productId

    // Create the presignedUrl and update AttachmentURL on database
    const url = productId + uuid.v4();
    const presignedUrl = await createAttachmentPresignedUrl(url)
    await uploadProductImage(userId, productId, url)

    logger.info("-- Presigned URL: " + presignedUrl)
    logger.info("-- End: Generate Presigned URL ---------------")

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: presignedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
