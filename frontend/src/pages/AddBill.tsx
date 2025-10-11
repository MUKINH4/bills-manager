import { useState } from "react";
import type { Bill } from "../types/Bill";
import { addBill } from "../services/billsService";

export default function AddBill() {
    const [formData, setFormData] = useState<Omit<Bill, 'dueDate'> & { dueDate: string }>({
        billName: '',
        amount: 0,
        category: '',
        receiver: '',
        dueDate: '',
        paid: false
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = [
        'Alimentação',
        'Transporte',
        'Moradia',
        'Saúde',
        'Educação',
        'Lazer',
        'Serviços',
        'Impostos',
        'Seguros',
        'Outros'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));

        // Limpar erro específico quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.billName.trim()) {
            newErrors.billName = 'Nome da conta é obrigatório';
        }

        if (formData.amount <= 0) {
            newErrors.amount = 'Valor deve ser maior que zero';
        }

        if (!formData.category) {
            newErrors.category = 'Categoria é obrigatória';
        }

        if (!formData.receiver.trim()) {
            newErrors.receiver = 'Recebedor é obrigatório';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Data de vencimento é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Converter string para Date
            const billData: Bill = {
                ...formData,
                dueDate: new Date(formData.dueDate)
            };

            // Chamar a API para adicionar a conta
            const newBill = await addBill(billData);
            console.log('Conta adicionada com sucesso:', newBill);

            setSuccess(true);

            // Resetar formulário após sucesso
            setFormData({
                billName: '',
                amount: 0,
                category: '',
                receiver: '',
                dueDate: '',
                paid: false
            });

            // Remover mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error('Erro ao adicionar conta:', error);
            // Aqui você poderia mostrar uma mensagem de erro
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            billName: '',
            amount: 0,
            category: '',
            receiver: '',
            dueDate: '',
            paid: false
        });
        setErrors({});
        setSuccess(false);
    };

    return (
        <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Adicionar Nova Conta</h1>
                    <p className="text-gray-600">Preencha as informações abaixo para adicionar uma nova conta</p>
                </div>

                {/* Mensagem de Sucesso */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">Conta adicionada com sucesso!</span>
                    </div>
                )}

                {/* Formulário */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome da Conta */}
                            <div className="md:col-span-2">
                                <label htmlFor="billName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nome da Conta *
                                </label>
                                <input
                                    type="text"
                                    id="billName"
                                    name="billName"
                                    value={formData.billName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 ${errors.billName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Ex: Conta de Luz, Internet, Supermercado..."
                                />
                                {errors.billName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.billName}
                                    </p>
                                )}
                            </div>

                            {/* Valor */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Valor (R$) *
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount || ''}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 ${errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="0,00"
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            {/* Categoria */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Categoria *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Recebedor */}
                            <div>
                                <label htmlFor="receiver" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Recebedor *
                                </label>
                                <input
                                    type="text"
                                    id="receiver"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 ${errors.receiver ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Ex: CEMIG, Vivo, Magazine Luiza..."
                                />
                                {errors.receiver && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.receiver}
                                    </p>
                                )}
                            </div>

                            {/* Data de Vencimento */}
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Data de Vencimento *
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 ${errors.dueDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors.dueDate && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.dueDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Adicionando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Adicionar Conta
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Limpar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
