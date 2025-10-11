import type { Bill } from "../types/Bill";

interface BillCardProps {
    bill: Bill;
    onOpenDetails: (bill: Bill) => void;
    onUpdatePaidStatus: (billId: string, paid: boolean) => void;
}

export default function BillCard({ bill, onOpenDetails, onUpdatePaidStatus }: BillCardProps) {
    // Função para formatar a data
    const formatDate = (date: Date) => {
        // Criar uma nova data garantindo que seja interpretada como local
        const localDate = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);

        return localDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Função para formatar o valor monetário
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    // Função para determinar a cor da categoria
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'alimentação': 'bg-green-100 text-green-800',
            'transporte': 'bg-blue-100 text-blue-800',
            'moradia': 'bg-purple-100 text-purple-800',
            'saúde': 'bg-red-100 text-red-800',
            'educação': 'bg-yellow-100 text-yellow-800',
            'lazer': 'bg-pink-100 text-pink-800',
            'outros': 'bg-gray-100 text-gray-800'
        };
        return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    // Verificar se a conta está vencida ou próxima do vencimento
    const getDueDateStatus = (dueDate: Date, isPaid: boolean) => {
        // Se já está paga, retorna status especial
        if (isPaid) {
            return { status: 'paid', color: 'text-green-600', label: 'Paga' };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas da data

        // Tratar a data de vencimento da mesma forma que formatDate
        const due = typeof dueDate === 'string' ? new Date(dueDate + 'T00:00:00') : new Date(dueDate);
        due.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas da data

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { status: 'overdue', color: 'text-red-600', label: 'Vencida' };
        } else if (diffDays <= 3) {
            return { status: 'warning', color: 'text-orange-600', label: 'Vence em breve' };
        } else {
            return { status: 'normal', color: 'text-gray-600', label: '' };
        }
    };

    const dueDateStatus = getDueDateStatus(bill.dueDate, bill.paid);

    return (
        <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden group hover:scale-105 relative ${bill.paid ? 'border-green-200 bg-green-50' : 'border-gray-100'
            }`}>

            {/* Badge de "PAGO" se a conta estiver paga */}
            {bill.paid && (
                <div>
                    <div className="bg-green-600 text-white px-3 py-1 text-xs font-bold flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        PAGO
                    </div>
                </div>
            )}

            {/* Header da conta */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold transition-colors duration-200 ${bill.paid ? 'text-green-700' : 'text-gray-800 group-hover:text-blue-600'
                        }`}>
                        {bill.billName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(bill.category)}`}>
                        {bill.category}
                    </span>
                </div>

                {/* Valor da conta */}
                <div className="mb-4">
                    <span className={`text-3xl font-bold ${bill.paid ? 'text-green-600' : 'text-gray-900'
                        }`}>
                        {formatCurrency(bill.amount)}
                    </span>
                    {bill.paid && (
                        <span className="ml-2 text-sm text-green-600 font-medium">✓ Pago</span>
                    )}
                </div>

                {/* Informações adicionais */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-600 text-sm">
                            <span className="font-medium">Recebedor:</span> {bill.receiver}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-sm font-medium ${dueDateStatus.color}`}>
                            {bill.paid ? 'Pago em:' : 'Vencimento:'} {formatDate(bill.dueDate)}
                            {dueDateStatus.label && (
                                <span className="ml-2 text-xs">({dueDateStatus.label})</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer com ações */}
            <div className={`px-6 py-4 border-t ${bill.paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                }`}>
                <div className="flex justify-between items-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
                        Editar
                    </button>
                    <div className="flex space-x-2">
                        {bill.paid ? (
                            <button
                                onClick={() => onUpdatePaidStatus(bill.id || '', false)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Marcar como Pendente
                            </button>
                        ) : (
                            <button
                                onClick={() => onUpdatePaidStatus(bill.id || '', true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Pagar
                            </button>
                        )}
                        <button
                            onClick={() => onOpenDetails(bill)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicador de status na lateral */}
            <div className={`absolute left-0 top-0 w-1 h-full ${bill.paid ? 'bg-green-500' :
                dueDateStatus.status === 'overdue' ? 'bg-red-500' :
                    dueDateStatus.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
        </div>
    );
}