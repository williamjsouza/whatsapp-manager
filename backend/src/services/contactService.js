const prisma = require('../config/prisma');

class ContactService {
  async listContacts() {
    return prisma.contact.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async getContact(id) {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) }
    });
    if (!contact) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Contato não encontrado.' };
    return contact;
  }

  async createContact(data) {
    const { name, phone, whatsapp_id, email, notes } = data;
    
    if (whatsapp_id) {
      const existing = await prisma.contact.findUnique({ where: { whatsapp_id } });
      if (existing) {
        throw { statusCode: 400, code: 'CONTACT_EXISTS', message: 'Contato com este WhatsApp ID já existe.' };
      }
    }

    return prisma.contact.create({
      data: { name, phone, whatsapp_id, email, notes }
    });
  }

  async updateContact(id, data) {
    await this.getContact(id); // Ensures it exists
    
    return prisma.contact.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async deleteContact(id) {
    await this.getContact(id);
    
    await prisma.contact.delete({
      where: { id: parseInt(id) }
    });
    return { message: 'Contato excluído com sucesso.' };
  }
}

module.exports = new ContactService();
