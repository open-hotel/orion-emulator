import { EventEmitter } from 'events'
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsProvider extends EventEmitter {}