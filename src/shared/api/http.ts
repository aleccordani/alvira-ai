export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function parseResponse<T>(response: Response): Promise<T> {
  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Request failed.");
  }

  return json.data;
}
