import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Briefcase, Building, ChevronRight, User } from 'lucide-react';
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
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden bg-grid">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-8">
                <div>
                    <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase mb-2">
                        NEGOCIOS <span className="text-primary italic">ACTIVOS</span>
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xs font-bold uppercase tracking-widest">Ciudad</span>
                        <ChevronRight size={12} />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Establecimientos y Servicios</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {businesses.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20 text-white">
                            <Briefcase size={80} className="mb-6" />
                            <p className="text-xl font-black uppercase tracking-widest">No hay negocios abiertos</p>
                        </div>
                    ) : (
                        businesses.map((b) => (
                            <motion.div key={b._id} whileHover={{ y: -5 }} className="glass-card rounded-[2.5rem] overflow-hidden group border border-white/5 bg-[#111]/40 hover:border-primary/50 transition-all flex flex-col p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center p-4">
                                        {b.job?.image ? <img src={b.job.image} alt="Logo" className="w-full h-full object-cover rounded-xl" /> : <Building size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{b.job?.name || "Negocio"}</h3>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 border border-gray-500/20 px-2 py-1 rounded inline-block mt-1">
                                            {b.job?.role || "Jefe"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl mb-2">
                                    <User size={18} className="text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encargado</p>
                                        <p className="text-sm font-bold text-white">{b.username}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                    <span className="flex-1 text-center py-2 bg-primary/20 text-primary font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">
                                        ABIERTO
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Negocios;
