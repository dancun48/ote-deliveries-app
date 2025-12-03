// services/webhookService.js
class WebhookService {
  async sendToGoogleSheets(delivery, action) {
    try {
      // You can use Google Apps Script as a webhook endpoint
      const webhookUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      
      const payload = {
        action: action, // 'create', 'update', 'assign_driver'
        delivery: delivery,
        timestamp: new Date().toISOString()
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('✅ Data sent to Google Sheets via webhook');
    } catch (error) {
      console.error('❌ Error sending data to Google Sheets:', error);
    }
  }
}

module.exports = new WebhookService();