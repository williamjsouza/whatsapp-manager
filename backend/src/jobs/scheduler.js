const cron = require('node-cron');
const prisma = require('../config/prisma');
const messageService = require('../services/messageService');
const templateService = require('../services/templateService');

// Internal queue to prevent sending too fast
const messageQueue = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  const minDelay = parseInt(process.env.MESSAGE_DELAY_MIN) || 3000;
  const maxDelay = parseInt(process.env.MESSAGE_DELAY_MAX) || 8000;

  while (messageQueue.length > 0) {
    const job = messageQueue.shift();

    try {
      // Actually send via MessageService
      await messageService.sendMessage({
        instance_id: job.instance_id,
        contact_id: job.contact_id,
        body: job.finalBody
      });

      // Update status to SENT
      await prisma.scheduledMessage.update({
        where: { id: job.id },
        data: { status: 'SENT', sent_at: new Date() }
      });

    } catch (err) {
      console.error(`Failed to send scheduled message ${job.id}:`, err);
      const attempts = job.attempts + 1;
      const maxRetries = parseInt(process.env.MAX_RETRIES) || 3;

      await prisma.scheduledMessage.update({
        where: { id: job.id },
        data: {
          status: attempts >= maxRetries ? 'FAILED' : 'PENDING',
          attempts,
          error_message: err.message
        }
      });
    }

    // Delay between messages
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  isProcessingQueue = false;
}

// Run every 30 seconds
const startScheduler = () => {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const now = new Date();

      // Find pending messages
      const pendingMessages = await prisma.scheduledMessage.findMany({
        where: {
          status: 'PENDING',
          scheduled_at: { lte: now }
        },
        include: {
          contact: true,
          template: true
        }
      });

      for (const msg of pendingMessages) {
        // Mark as PROCESSING to avoid picking up again
        await prisma.scheduledMessage.update({
          where: { id: msg.id },
          data: { status: 'PROCESSING' }
        });

        // Resolve template body
        let finalBody = msg.message;
        if (msg.template) {
          const variables = {
            nome: msg.contact.name,
            telefone: msg.contact.phone,
            // Outras variáveis podem ser inseridas aqui,
          };
          finalBody = templateService.renderTemplate(msg.template.body, variables);
        }

        messageQueue.push({ ...msg, finalBody });
      }

      if (messageQueue.length > 0) {
        processQueue();
      }

    } catch (err) {
      console.error('Scheduler error:', err);
    }
  });

  console.log('Scheduler started. Checking pending messages every 30 seconds.');
};

module.exports = startScheduler;
