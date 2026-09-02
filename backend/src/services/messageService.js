const prisma = require('../config/prisma');
const evolutionService = require('../integrations/evolution/EvolutionService');
const crypto = require('crypto');

class MessageService {
  async getMessages(conversationId) {
    return prisma.message.findMany({
      where: { conversation_id: parseInt(conversationId) },
      orderBy: { timestamp: 'asc' }
    });
  }

  async sendMessage(data) {
    const { instance_id, contact_id, body } = data;
    
    const instance = await prisma.whatsappInstance.findUnique({ where: { id: parseInt(instance_id) } });
    const contact = await prisma.contact.findUnique({ where: { id: parseInt(contact_id) } });
    
    if (!instance || !contact) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Instância ou Contato não encontrados.' };

    let conversation = await prisma.conversation.findUnique({
      where: { instance_id_contact_id: { instance_id: instance.id, contact_id: contact.id } }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { instance_id: instance.id, contact_id: contact.id }
      });
    }

    // Call Evolution API
    let evoResponse;
    try {
      // Assuming contact.phone or whatsapp_id is the remote Jid
      const remoteJid = contact.whatsapp_id || `${contact.phone}@s.whatsapp.net`;
      evoResponse = await evolutionService.sendText(instance.instance_name, remoteJid, body);
    } catch (err) {
      throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Erro ao enviar mensagem pela API.' };
    }

    // Usually Evolution returns the generated message_id
    const message_id = evoResponse?.key?.id || crypto.randomUUID();

    // Save Message in DB
    const newMessage = await prisma.message.create({
      data: {
        instance_id: instance.id,
        conversation_id: conversation.id,
        contact_id: contact.id,
        message_id,
        direction: 'OUTGOING',
        type: 'text',
        body,
        status: 'SENT',
        timestamp: new Date()
      }
    });

    // Update conversation
    const updatedConv = await prisma.conversation.update({
      where: { id: conversation.id },
      data: { last_message: body, last_message_at: new Date() }
    });

    if (global.io) {
      global.io.emit('message:sent', newMessage);
      global.io.emit('conversation:update', updatedConv);
    }

    return newMessage;
  }

  async sendMedia(data) {
    // Similar logic for sending media
    // Skipping full implementation for brevity, but follows same pattern as sendText
    return { message: 'Media sending not fully implemented in this demo phase.' };
  }

  async deleteMessage(id) {
    // Soft delete or hard delete
    await prisma.message.delete({ where: { id: parseInt(id) } });
    return { success: true };
  }
}

module.exports = new MessageService();
