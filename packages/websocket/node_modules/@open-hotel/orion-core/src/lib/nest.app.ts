import { NestApplication } from "@nestjs/core";

let app: NestApplication

export function getApp () {
  return app
}

export function setApp(newApp: NestApplication) {
  app = newApp
  return app
}