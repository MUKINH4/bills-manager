import { useState } from 'react';
import type { Bill } from '../types/Bill';
import Modal from './Modal';
import Switch from './Switch';

interface BillDetailsModalProps {
    bill: Bill | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdatePaidStatus: (billId: string, paid: boolean) => void;
    onDeleteBill: (billId: string) => void;
}

export default function BillDetailsModal({
    bill,
    isOpen,
    onClose,
    onUpdatePaidStatus,
    onDeleteBill
}: BillDetailsModalProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    if (!bill) return null;

    const formatDate = (date: Date) => {
        const localDate = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
        return localDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

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

    const handlePaidToggle = async (newPaidStatus: boolean) => {
        setIsUpdating(true);
        try {
            // Aqui você faria a chamada para a API
            await onUpdatePaidStatus(bill.id || 'temp-id', newPaidStatus);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            await onDeleteBill(bill.id || 'temp-id');
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalhes da Conta"
        >
            <div className="space-y-6">
                {/* Cabeçalho com status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold text-gray-900">{bill.billName}</h2>
                        {bill.paid && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Paga
                            </span>
                        )}
                    </div>
                </div>

                {/* Informações principais */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-sm font-medium text-gray-500">Valor</label>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(bill.amount)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-sm font-medium text-gray-500">Categoria</label>
                            <div className="mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(bill.category)}`}>
                                    {bill.category}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-sm font-medium text-gray-500">Data de Vencimento</label>
                            <p className="text-sm font-medium text-gray-900 mt-2">{formatDate(bill.dueDate)}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-sm font-medium text-gray-500">Recebedor</label>
                        <p className="text-sm font-medium text-gray-900 mt-2">{bill.receiver}</p>
                    </div>
                </div>

                {/* Switch para marcar como pago */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Status de Pagamento</h3>
                            <p className="text-sm text-gray-500">Marque esta conta como paga ou pendente</p>
                        </div>
                        <Switch
                            checked={bill.paid}
                            onChange={handlePaidToggle}
                            disabled={isUpdating}
                            label={bill.paid ? 'Paga' : 'Pendente'}
                        />
                    </div>
                </div>

                {/* Ações */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Excluir Conta
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de confirmação de exclusão */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-md">
                                <div className="bg-white px-4 pt-5 pb-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Excluir conta
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Tem certeza que deseja excluir a conta "{bill.billName}"? Esta ação não pode ser desfeita.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse space-x-2 space-x-reverse">
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}