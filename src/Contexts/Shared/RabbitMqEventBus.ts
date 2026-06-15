import amqplib, { Channel, ChannelModel } from "amqplib";
import { IDomainEvent, IEventBus } from "./IEventBus";

export class RabbitMqEventBus implements IEventBus {
  private model: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly url: string,
    private readonly exchange: string
  ) {}

  async connect(): Promise<void> {
    this.model = await amqplib.connect(this.url);
    this.channel = await this.model.createChannel();
    await this.channel.assertExchange(this.exchange, "topic", { durable: true });
  }

  async disconnect(): Promise<void> {
    await this.channel?.close();
    await this.model?.close();
    this.channel = null;
    this.model = null;
  }

  async publicar<TPayload>(event: IDomainEvent<TPayload>): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMqEventBus não está conectado. Chame connect() primeiro.");
    }

    const routingKey = event.name;
    const content = Buffer.from(JSON.stringify(event));

    this.channel.publish(this.exchange, routingKey, content, {
      persistent: true,
      contentType: "application/json",
      timestamp: Date.now()
    });
  }
}
