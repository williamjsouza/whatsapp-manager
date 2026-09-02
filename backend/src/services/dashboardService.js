const prisma = require('../config/prisma');

class DashboardService {
  async getStats() {
    const totalInstances = await prisma.whatsappInstance.count();
    const totalContacts = await prisma.contact.count();
    
    // Group conversations by unread status (if unread_count > 0, it's open)
    const openConversations = await prisma.conversation.count({
      where: { unread_count: { gt: 0 } }
    });

    const totalConversations = await prisma.conversation.count();

    const messagesSent = await prisma.message.count({
      where: { direction: 'OUTGOING' }
    });

    const messagesReceived = await prisma.message.count({
      where: { direction: 'INCOMING' }
    });

    const upcomingScheduled = await prisma.scheduledMessage.count({
      where: { status: 'PENDING' }
    });

    return {
      totalInstances,
      totalContacts,
      totalConversations,
      openConversations,
      messagesSent,
      messagesReceived,
      upcomingScheduled
    };
  }
}

module.exports = new DashboardService();
