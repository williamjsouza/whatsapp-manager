const scheduleService = require('./scheduleService');

class CampaignService {
  async createCampaign(data) {
    const { instance_id, contact_ids, template_id, scheduled_at } = data;
    
    if (!instance_id || !contact_ids || !Array.isArray(contact_ids) || !template_id || !scheduled_at) {
      throw { statusCode: 400, code: 'INVALID_DATA', message: 'Dados insuficientes para criar a campanha.' };
    }

    const scheduledMessages = [];

    // Gerar mensagens individuais a partir do template para a fila do Scheduler (Fase 10/11)
    for (const contact_id of contact_ids) {
      const scheduled = await scheduleService.createScheduled({
        instance_id,
        contact_id,
        template_id,
        scheduled_at
      });
      scheduledMessages.push(scheduled);
    }

    return { 
      message: `Campanha criada com sucesso! ${scheduledMessages.length} mensagens agendadas.`,
      scheduled_count: scheduledMessages.length
    };
  }
}

module.exports = new CampaignService();
