const prisma = require('../config/prisma');

class WebhookService {
  async processEvent(instanceName, eventType, data) {
    // Basic idempotency check for messages
    // The Evolution API sends unique IDs in data, depending on the event
    let uniqueId = null;

    if (eventType === 'MESSAGES_UPSERT') {
      const msg = data.messages?.[0];
      if (msg && msg.key && msg.key.id) {
        uniqueId = msg.key.id;
      }
    }

    if (uniqueId) {
      const existingEvent = await prisma.webhookEvent.findFirst({
        where: { event: eventType, payload: { contains: uniqueId } }
      });
      if (existingEvent) {
        console.log(`[Webhook] Event ${eventType} with ID ${uniqueId} already processed. Ignoring.`);
        return { message: 'Ignored duplicated event.' };
      }
    }

    // Find the instance
    const instance = await prisma.whatsappInstance.findUnique({
      where: { instance_name: instanceName }
    });

    if (instance) {
      // Save raw event
      await prisma.webhookEvent.create({
        data: {
          instance_id: instance.id,
          event: eventType,
          payload: JSON.stringify(data),
          processed: true
        }
      });

      // Handle specific events
      switch (eventType) {
        case 'CONNECTION_UPDATE':
          await this.handleConnectionUpdate(instance.id, data);
          break;
        case 'MESSAGES_UPSERT':
          await this.handleMessagesUpsert(instance.id, data);
          break;
        // Additional events like PRESENCE_UPDATE, CONTACTS_UPSERT, etc can be handled here
      }
    }

    return { success: true };
  }

  async handleConnectionUpdate(instanceId, data) {
    let newStatus = 'DISCONNECTED';
    
    if (data.state === 'open') {
      newStatus = 'CONNECTED';
    } else if (data.state === 'connecting') {
      newStatus = 'CONNECTING';
    } else if (data.state === 'close') {
      newStatus = 'DISCONNECTED';
    } else if (data.statusReason === 401) {
      newStatus = 'QR_CODE'; // Probably disconnected or needs QR
    }

    await prisma.whatsappInstance.update({
      where: { id: instanceId },
      data: { status: newStatus, last_connected_at: newStatus === 'CONNECTED' ? new Date() : undefined }
    });

    if (global.io) {
      global.io.emit('instance:status', { instanceId, status: newStatus });
    }
  }

  async handleMessagesUpsert(instanceId, data) {
    const messages = data.messages || [];
    
    for (const msg of messages) {
      if (msg.key.fromMe) continue; // ignore messages sent by the instance itself if needed

      const remoteJid = msg.key.remoteJid;
      if (!remoteJid || remoteJid.includes('@g.us')) continue; // Ignore groups for now

      const pushName = msg.pushName || 'Desconhecido';
      const phone = remoteJid.split('@')[0];
      const messageId = msg.key.id;
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '[Mídia/Outro]';

      // 1. Find or create Contact
      let contact = await prisma.contact.findUnique({ where: { whatsapp_id: remoteJid } });
      if (!contact) {
        contact = await prisma.contact.create({
          data: { name: pushName, phone, whatsapp_id: remoteJid }
        });
      }

      // 2. Find or create Conversation
      let conversation = await prisma.conversation.findUnique({
        where: { instance_id_contact_id: { instance_id: instanceId, contact_id: contact.id } }
      });
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { instance_id: instanceId, contact_id: contact.id }
        });
      }

      // 3. Save Message
      const newMessage = await prisma.message.create({
        data: {
          instance_id: instanceId,
          conversation_id: conversation.id,
          contact_id: contact.id,
          message_id: messageId,
          direction: 'INCOMING',
          type: 'text',
          body,
          status: 'RECEIVED',
          timestamp: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000)
        }
      });

      // 4. Update Conversation
      const updatedConv = await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          last_message: body,
          last_message_at: new Date(),
          unread_count: { increment: 1 }
        }
      });

      // 5. Emit WebSockets
      if (global.io) {
        global.io.emit('message:new', newMessage);
        global.io.emit('conversation:update', updatedConv);
      }
    }
  }
}

module.exports = new WebhookService();
