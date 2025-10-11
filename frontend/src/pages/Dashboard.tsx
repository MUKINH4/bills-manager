import { useEffect, useState } from "react";
import { getBills, updateBillPaidStatus, deleteBill } from "../services/billsService";
import type { Bill } from "../types/Bill";
import BillCard from "../components/BillCard";
import BillDetailsModal from "../components/BillDetailsModal";

export default function Dashboard() {

    const [data, setData] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const bills = await getBills();
                setData(bills);
            }
            catch (e) {
                console.error("Erro ao carregar contas:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, [])

    const handleOpenDetails = (bill: Bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBill(null);
    };

    const handleUpdatePaidStatus = async (billId: string) => {
        try {
            await updateBillPaidStatus(billId);
            // Atualizar a lista local
            setData(prevData =>
                prevData.map(bill =>
                    bill.id === billId ? { ...bill } : bill
                )
            );
            // Atualizar o bill selecionado se for o mesmo
            if (selectedBill && selectedBill.id === billId) {
                setSelectedBill({ ...selectedBill });
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleDeleteBill = async (billId: string) => {
        try {
            await deleteBill(billId);
            // Remover da lista local
            setData(prevData => prevData.filter(bill => bill.id !== billId));
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando suas contas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Contas</h1>
                    <p className="text-gray-600">Gerencie suas contas e despesas de forma eficiente</p>
                </div>

                {/* Estatísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total de Contas</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{data.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Valor Total</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(data.reduce((sum, bill) => sum + bill.amount, 0))}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pagas</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {data.filter(bill => bill.paid).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Vencidas</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {data.filter(bill => {
                                if (bill.paid) return false; // Não contar contas pagas como vencidas
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const dueDate = typeof bill.dueDate === 'string' ? new Date(bill.dueDate + 'T00:00:00') : new Date(bill.dueDate);
                                dueDate.setHours(0, 0, 0, 0);
                                return dueDate < today;
                            }).length}
                        </p>
                    </div>
                </div>

                {/* Lista de contas */}
                {data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta encontrada</h3>
                        <p className="text-gray-500">Adicione sua primeira conta para começar.</p>
                        <a href="/bills/add" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Adicionar Conta
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((bill, index) => (
                            <BillCard
                                key={index}
                                bill={bill}
                                onOpenDetails={handleOpenDetails}
                                onUpdatePaidStatus={handleUpdatePaidStatus}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de detalhes */}
            <BillDetailsModal
                bill={selectedBill}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdatePaidStatus={handleUpdatePaidStatus}
                onDeleteBill={handleDeleteBill}
            />
        </div>
    );
}