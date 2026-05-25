/**
 * Cliente para el notification-service real de Konfío.
 * Base URL: https://notifications.konfio.mx/api/v1
 *
 * Usa el patrón estándar de integración: Bearer token + x-api-key
 */

interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  variables?: Record<string, string>;
}

interface SmsNotification {
  to: string;
  message: string;
}

interface NotificationResponse {
  id: string;
  status: string;
}

const NOTIFICATIONS_URL = process.env.NOTIFICATIONS_URL || 'https://notifications.konfio.mx/api/v1';
const NOTIFICATIONS_API_KEY = process.env.NOTIFICATIONS_API_KEY || '';

function notificationHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': NOTIFICATIONS_API_KEY,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function sendEmail(
  notification: EmailNotification,
  token?: string
): Promise<NotificationResponse> {
  const response = await fetch(`${NOTIFICATIONS_URL}/notifications/email`, {
    method: 'POST',
    headers: notificationHeaders(token),
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Email send failed' }));
    throw new Error(error.message || `Email send failed with status ${response.status}`);
  }

  return response.json() as Promise<NotificationResponse>;
}

export async function sendSms(
  notification: SmsNotification,
  token?: string
): Promise<NotificationResponse> {
  const response = await fetch(`${NOTIFICATIONS_URL}/notifications/sms`, {
    method: 'POST',
    headers: notificationHeaders(token),
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'SMS send failed' }));
    throw new Error(error.message || `SMS send failed with status ${response.status}`);
  }

  return response.json() as Promise<NotificationResponse>;
}

/**
 * Helper para notificar cambio de estado de un gasto.
 * Envía email al aprobador o al miembro según el caso.
 */
export async function notifyExpenseStatusChange(params: {
  recipientEmail: string;
  memberName: string;
  expenseDescription: string;
  amount: string;
  newStatus: string;
  token?: string;
}): Promise<NotificationResponse> {
  const subjectMap: Record<string, string> = {
    pendiente: `Nuevo gasto pendiente de ${params.memberName}`,
    aprobado: `Tu gasto "${params.expenseDescription}" fue aprobado`,
    rechazado: `Tu gasto "${params.expenseDescription}" fue rechazado`,
  };

  return sendEmail(
    {
      to: params.recipientEmail,
      subject: subjectMap[params.newStatus] || `Actualización de gasto`,
      body: `El gasto "${params.expenseDescription}" por ${params.amount} ahora tiene estado: ${params.newStatus}.`,
    },
    params.token
  );
}
