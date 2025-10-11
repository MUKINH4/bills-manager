
export type Bill = {
    id?: string,
    billName: string,
    amount: number,
    category: string,
    receiver: string,
    dueDate: Date,
    paid: boolean
}