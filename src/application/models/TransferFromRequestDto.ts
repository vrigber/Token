/**
 * DTO for token transfer, includes recipient and token amount
 */
export interface TransferFromRequestDto {
    sender: string
    payer: string
    /** Address of the recipient */
    recipient: string

    /** Token value to transfer in smallest unit */
    tokenValue: string
}