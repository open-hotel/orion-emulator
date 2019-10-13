import { Inject } from "@nestjs/common";

export function InjectArango (connectionName = 'default') {
  return Inject(`ARANGO_DB#${connectionName}`)
}