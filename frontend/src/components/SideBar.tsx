import type { SideBar } from "../types/SideBar";

const getIcon = (name: string) => {
    switch (name) {
        case 'Dashboard':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 5 3-3 3 3" />
                </svg>
            );
        case 'Contas':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'Adicionar Conta':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            );
        default:
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            );
    }
};

export default function SideBar({ items }: { items: SideBar[] }) {
    return (
        <div className="w-[225px] bg-gray-800 text-white shadow-lg">
            <section className="h-screen">
                <div className="h-[100px] flex items-center justify-center border-b border-gray-700">
                    <div className="text-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold">Gestão de Contas</h1>
                    </div>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        {
                            items.map(({ name, link }, index) => (
                                <li key={index}>
                                    <a
                                        href={link}
                                        className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 font-medium group"
                                    >
                                        <span className="mr-3 group-hover:scale-110 transition-transform duration-200">
                                            {getIcon(name)}
                                        </span>
                                        {name}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </section>
        </div>
    );
}