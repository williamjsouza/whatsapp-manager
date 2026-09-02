const axios = require('axios');

class EvolutionService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.EVOLUTION_API_URL,
      headers: {
        'apikey': process.env.EVOLUTION_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  // --- Instances ---

  async createInstance(instanceName) {
    try {
      const response = await this.api.post('/instance/create', {
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating instance:', error.response?.data || error.message);
      throw error;
    }
  }

  async connectInstance(instanceName) {
    try {
      const response = await this.api.get(`/instance/connect/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error('Error connecting instance:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteInstance(instanceName) {
    try {
      const response = await this.api.delete(`/instance/delete/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting instance:', error.response?.data || error.message);
      throw error;
    }
  }

  async logoutInstance(instanceName) {
    try {
      const response = await this.api.delete(`/instance/logout/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error('Error logging out instance:', error.response?.data || error.message);
      throw error;
    }
  }

  async connectionState(instanceName) {
    try {
      const response = await this.api.get(`/instance/connectionState/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching connection state:', error.response?.data || error.message);
      throw error;
    }
  }

  // --- Webhooks ---

  async setWebhook(instanceName, webhookUrl) {
    try {
      const response = await this.api.post(`/webhook/set/${instanceName}`, {
        webhook: {
          url: webhookUrl,
          byEvents: false,
          base64: false,
          events: [
            'APPLICATION_STARTUP',
            'QRCODE_UPDATED',
            'MESSAGES_UPSERT',
            'MESSAGES_UPDATE',
            'SEND_MESSAGE',
            'CONTACTS_UPSERT',
            'CONTACTS_UPDATE',
            'PRESENCE_UPDATE',
            'CONNECTION_UPDATE'
          ]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error setting webhook:', error.response?.data || error.message);
      throw error;
    }
  }

  // --- Messaging ---

  async sendText(instanceName, number, text) {
    try {
      const response = await this.api.post(`/message/sendText/${instanceName}`, {
        number,
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error sending text:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendMedia(instanceName, number, mediaMessage) {
    try {
      const response = await this.api.post(`/message/sendMedia/${instanceName}`, {
        number,
        mediatype: mediaMessage.mediatype,
        mimetype: mediaMessage.mimetype,
        caption: mediaMessage.caption,
        media: mediaMessage.media, // base64 or URL depending on Evolution version
      });
      return response.data;
    } catch (error) {
      console.error('Error sending media:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAsRead(instanceName, number, messageId) {
    try {
      const response = await this.api.post(`/chat/markMessageAsRead/${instanceName}`, {
        readMessages: [{
          remoteJid: number,
          fromMe: false,
          id: messageId
        }]
      });
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new EvolutionService();
