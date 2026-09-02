const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const startBackupJob = () => {
  // Configured to run everyday at 3 AM: '0 3 * * *'
  // For testing purposes, could be changed, but usually backups are daily.
  cron.schedule('0 3 * * *', async () => {
    try {
      logger.info('Starting scheduled database backup...');

      const dbPath = path.resolve(__dirname, '../../../backend/database/database.sqlite');
      const backupDir = path.resolve(__dirname, '../../../backups');
      const envPath = path.resolve(__dirname, '../../../.env');
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Copy SQLite DB
      if (fs.existsSync(dbPath)) {
        const dbBackupFile = path.join(backupDir, `database-${timestamp}.sqlite`);
        fs.copyFileSync(dbPath, dbBackupFile);
        logger.info(`Database backup created at ${dbBackupFile}`);
      } else {
        logger.warn(`Database file not found at ${dbPath}`);
      }

      // Copy .env
      if (fs.existsSync(envPath)) {
        const envBackupFile = path.join(backupDir, `env-${timestamp}.txt`);
        fs.copyFileSync(envPath, envBackupFile);
        logger.info(`Environment backup created at ${envBackupFile}`);
      }

      // Optional: Clean up old backups (older than 7 days)
      const files = fs.readdirSync(backupDir);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      
      for (const file of files) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtimeMs < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old backup file: ${file}`);
        }
      }

    } catch (err) {
      logger.error('Error during scheduled backup', { error: err });
    }
  });

  logger.info('Backup scheduler started. Configured to run daily at 03:00 AM.');
};

module.exports = startBackupJob;
