declare module "midtrans-client" {
  type SnapConfig = {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  };

  type TransactionResponse = {
    token: string;
    redirect_url: string;
  };

  class Snap {
    constructor(config: SnapConfig);

    createTransaction(
      parameter: Record<string, unknown>,
    ): Promise<TransactionResponse>;

    createTransactionToken(parameter: Record<string, unknown>): Promise<string>;

    createTransactionRedirectUrl(
      parameter: Record<string, unknown>,
    ): Promise<string>;
  }

  const midtransClient: {
    Snap: typeof Snap;
  };

  export default midtransClient;
}
