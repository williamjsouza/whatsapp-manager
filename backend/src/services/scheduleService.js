const prisma = require('../config/prisma');
const templateService = require('./templateService');

class ScheduleService {
  async listScheduled() {
    return prisma.scheduledMessage.findMany({
      include: { contact: true, instance: true, template: true },
      orderBy: { scheduled_at: 'asc' }
    });
  }

  async createScheduled(data) {
    const { instance_id, contact_id, template_id, message, scheduled_at } = data;
    return prisma.scheduledMessage.create({
      data: {
        instance_id: parseInt(instance_id),
        contact_id: parseInt(contact_id),
        template_id: template_id ? parseInt(template_id) : null,
        message: message || '',
        scheduled_at: new Date(scheduled_at),
        status: 'PENDING'
      }
    });
  }

  async getScheduled(id) {
    const scheduled = await prisma.scheduledMessage.findUnique({
      where: { id: parseInt(id) }
    });
    if (!scheduled) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Agendamento não encontrado.' };
    return scheduled;
  }

  async updateScheduled(id, data) {
    await this.getScheduled(id);
    if (data.scheduled_at) {
      data.scheduled_at = new Date(data.scheduled_at);
    }
    return prisma.scheduledMessage.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async deleteScheduled(id) {
    await this.getScheduled(id);
    await prisma.scheduledMessage.delete({
      where: { id: parseInt(id) }
    });
    return { message: 'Agendamento excluído com sucesso.' };
  }

  async cancelScheduled(id) {
    await this.getScheduled(id);
    return prisma.scheduledMessage.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' }
    });
  }
}

module.exports = new ScheduleService();
