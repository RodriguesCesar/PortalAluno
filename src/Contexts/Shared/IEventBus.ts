export interface IDomainEvent<TPayload = unknown> {
  name: string;
  payload: TPayload;
  occurredAt: string;
}

export interface IEventBus {
  publicar<TPayload>(event: IDomainEvent<TPayload>): Promise<void>;
}
