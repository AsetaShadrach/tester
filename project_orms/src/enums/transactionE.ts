export enum TransactionType{
    MPESA_STK = 'mpesa_stk',
    MPESA_B2B = 'mpesa_b2b',
    PESALINK = 'pesalink',
    RTGS = 'rtgs',
    CARD_TRANSFER = 'card_transfer',
}

export enum TransactionStatus{
    PENDING_INTERNAL = 'pending_internal',
    PENDING_EXTERNAL = 'pending_external',
    SUCCESSFUL =  'successful',
    FAILED = 'failed',
    STK_SENT = 'stk_sent',
    INITIATED = 'initiated',
}

export enum TransactionDirection{
    INFLOW = 'inflow',
    OUTFLOW = 'outflow',
}