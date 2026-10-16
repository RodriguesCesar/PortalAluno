type ErrorBody = {
  message?: string;
  error?: string;
};

async function extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const data = (await response.json().catch(() => null)) as ErrorBody | null;
    if (data?.message && data.message.trim().length > 0) return data.message;
    if (data?.error && data.error.trim().length > 0) return data.error;
  }

  const text = await response.text().catch(() => '');
  if (text.trim().length > 0) return text;

  return fallbackMessage;
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  fallbackMessage: string
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, fallbackMessage));
  }

  return response.json() as Promise<T>;
}

export async function request(
  input: RequestInfo | URL,
  init: RequestInit,
  fallbackMessage: string
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, fallbackMessage));
  }

  return response;
}
