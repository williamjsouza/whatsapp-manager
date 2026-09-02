const prisma = require('../config/prisma');
const evolutionService = require('../integrations/evolution/EvolutionService');

class InstanceService {
  async listInstances() {
    return prisma.whatsappInstance.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async createInstance(data) {
    const { name, instance_name, phone } = data;
    
    // Check if exists in DB
    const existing = await prisma.whatsappInstance.findUnique({
      where: { instance_name }
    });

    if (existing) {
      throw { statusCode: 400, code: 'INSTANCE_EXISTS', message: 'Já existe uma instância com esse nome.' };
    }

    // Attempt to create in Evolution API
    let evolutionData;
    try {
      evolutionData = await evolutionService.createInstance(instance_name);
    } catch (err) {
      try {
        const state = await evolutionService.connectionState(instance_name);
        if (state && state.instance) {
          console.log(`Instância ${instance_name} já existe na Evolution API, importando para o banco...`);
          evolutionData = { qrcode: null };
        } else {
          throw err;
        }
      } catch (e) {
        throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Falha ao criar ou importar instância na Evolution API. Verifique a API Key.' };
      }
    }

    // Set Webhook if it's created
    try {
      if (process.env.WEBHOOK_URL) {
        await evolutionService.setWebhook(instance_name, process.env.WEBHOOK_URL);
      }
    } catch (err) {
      console.warn('Could not set webhook on creation:', err.message);
    }

    // Save in DB
    const newInstance = await prisma.whatsappInstance.create({
      data: {
        name,
        instance_name,
        phone: phone || null,
        api_url: process.env.EVOLUTION_API_URL,
        status: 'CONNECTING' // Since it returns QR code
      }
    });

    return { instance: newInstance, qrCode: evolutionData?.qrcode?.base64 };
  }

  async getInstance(id) {
    const instance = await prisma.whatsappInstance.findUnique({ where: { id: parseInt(id) } });
    if (!instance) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Instância não encontrada.' };
    return instance;
  }

  async connectInstance(id) {
    const instance = await this.getInstance(id);
    
    try {
      const connectData = await evolutionService.connectInstance(instance.instance_name);
      return connectData;
    } catch (err) {
      throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Falha ao conectar instância.' };
    }
  }

  async disconnectInstance(id) {
    const instance = await this.getInstance(id);
    
    try {
      await evolutionService.logoutInstance(instance.instance_name);
      
      const updated = await prisma.whatsappInstance.update({
        where: { id: parseInt(id) },
        data: { status: 'DISCONNECTED' }
      });
      return updated;
    } catch (err) {
      throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Falha ao desconectar instância.' };
    }
  }

  async reconnectInstance(id) {
    const instance = await this.getInstance(id);
    // Logout and then connect again
    try {
      await evolutionService.logoutInstance(instance.instance_name).catch(() => {});
      const connectData = await evolutionService.connectInstance(instance.instance_name);
      return connectData;
    } catch (err) {
      throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Falha ao reconectar instância.' };
    }
  }

  async deleteInstance(id) {
    const instance = await this.getInstance(id);
    
    try {
      await evolutionService.logoutInstance(instance.instance_name).catch(() => {});
      await evolutionService.deleteInstance(instance.instance_name).catch(() => {});
      
      await prisma.whatsappInstance.delete({ where: { id: parseInt(id) } });
      return { message: 'Instância excluída com sucesso.' };
    } catch (err) {
      throw { statusCode: 500, code: 'EVOLUTION_API_ERROR', message: 'Falha ao excluir instância.' };
    }
  }
}

module.exports = new InstanceService();
