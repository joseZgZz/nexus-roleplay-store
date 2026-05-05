import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Negocios = () => {
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/jobs/open`);
                setBusinesses(res.data);
            } catch (err) {
                console.error("Error fetching businesses", err);
            }
        };
        fetchBusinesses();
        const interval = setInterval(fetchBusinesses, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden bg-grid">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

            <section className="py-10 relative px-4 z-10 w-full">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase mb-2">
                            NEGOCIOS <span className="text-primary italic">ACTIVOS</span>
                        </h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-xs font-bold uppercase tracking-widest">Ciudad</span>
                            <ChevronRight size={12} />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Establecimientos y Servicios</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-black text-white italic uppercase">Servicios <span className="text-secondary">Activos</span></h2>
                            <p className="text-gray-500 font-medium text-sm">Negocios abiertos en la ciudad ahora mismo</p>
                        </div>
                    </div>

                    {businesses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {businesses.map((item, i) => (
                                <motion.div
                                    key={item._id || i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-6 rounded-3xl border-secondary/20 bg-secondary/5 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl rounded-full"></div>

                                    {item.job?.image ? (
                                        <div className="h-32 mb-4 rounded-2xl overflow-hidden relative">
                                            <img src={item.job.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="h-32 mb-4 rounded-2xl bg-black/40 flex items-center justify-center relative">
                                            <Briefcase size={40} className="text-secondary/50 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2 block">{item.job?.role || 'EMPLEADO'}</span>
                                        <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">{item.job?.name || 'NEGOCIO'}</h3>
                                        <p className="text-xs text-gray-400">Responsable: <span className="text-white font-bold">{item.username}</span></p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">ABIERTO</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-12 rounded-[3rem] text-center border-white/5">
                            <p className="text-gray-500 font-medium">No hay negocios registrados abiertos en este momento.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Negocios;
