const prisma = require('../config/prisma');

class TemplateService {
  async listTemplates() {
    return prisma.messageTemplate.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async createTemplate(data) {
    const { name, title, body, category, active } = data;
    return prisma.messageTemplate.create({
      data: { name, title, body, category, active: active !== undefined ? active : true }
    });
  }

  async getTemplate(id) {
    const template = await prisma.messageTemplate.findUnique({
      where: { id: parseInt(id) }
    });
    if (!template) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Template não encontrado.' };
    return template;
  }

  async updateTemplate(id, data) {
    await this.getTemplate(id);
    return prisma.messageTemplate.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async deleteTemplate(id) {
    await this.getTemplate(id);
    await prisma.messageTemplate.delete({
      where: { id: parseInt(id) }
    });
    return { message: 'Template excluído com sucesso.' };
  }

  /**
   * Substitui as variáveis de um texto de template.
   * Variáveis suportadas: {{nome}}, {{primeiro_nome}}, {{telefone}}, {{data}}, {{hora}}, {{empresa}}, {{servico}}, {{profissional}}
   */
  renderTemplate(body, variables = {}) {
    let rendered = body;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value || '');
    }
    return rendered;
  }
}

module.exports = new TemplateService();
