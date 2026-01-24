export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 opacity-100">
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center p-1">
                        <img src="/saber-logo.png" className="w-full h-full object-contain" alt="Saber" />
                    </div>
                    <span className="font-bold tracking-widest text-sm text-white">SABER</span>
                </div>
                <p className="text-gray-500 text-sm">© 2024 Saber Protocol. All rights reserved.</p>
            </div>
        </footer>
    );
}
