const prisma = require('../config/prisma');

class ConversationService {
  async listConversations(instanceId) {
    const filter = {};
    if (instanceId) {
      filter.instance_id = parseInt(instanceId);
    }

    return prisma.conversation.findMany({
      where: filter,
      include: {
        contact: true,
        instance: true
      },
      orderBy: { updated_at: 'desc' }
    });
  }

  async getConversation(id) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        contact: true,
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 50 // load last 50 messages by default
        }
      }
    });

    if (!conversation) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Conversa não encontrada.' };
    }
    return conversation;
  }

  async markAsRead(id) {
    const conversation = await this.getConversation(id);
    
    // In a full implementation, this should also call EvolutionService to mark as read on WhatsApp.
    
    const updated = await prisma.conversation.update({
      where: { id: parseInt(id) },
      data: { unread_count: 0 }
    });

    if (global.io) {
      global.io.emit('conversation:update', updated);
    }

    return updated;
  }
}

module.exports = new ConversationService();
