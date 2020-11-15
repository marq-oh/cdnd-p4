import { decode } from 'jsonwebtoken'
import { JwtToken } from './JwtToken'
import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */

export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken
  return decodedJwt.sub
}

