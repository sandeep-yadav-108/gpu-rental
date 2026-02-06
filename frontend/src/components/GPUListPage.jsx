import React, { useState, useEffect } from 'react';
import { HardDrive, Thermometer, Activity, Zap } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://superseraphically-umbonate-leighton.ngrok-free.dev';

const DUMMY_GPUS = [
  {
    id: 'dummy-1',
    name: 'NVIDIA RTX 4090',
    status: 'idle',
    memTotal: 32000,
    memUsed: 18000,
    memFree: 14000,
    util: 65,
    temp: 58,
    utilization: 72
  },
  {
    id: 'dummy-2',
    name: 'NVIDIA RTX 4080',
    status: 'idle',
    memTotal: 24000,
    memUsed: 8000,
    memFree: 16000,
    util: 42,
    temp: 45,
    utilization: 35
  }
];

export default function GPUListPage() {
  const [agents, setAgents] = useState([]);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/agents`);
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setAgents([]);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  // Flatten GPUs from agents
  const allGPUs = [];
  agents.forEach(agent => {
    agent.gpus?.forEach(gpu => {
      allGPUs.push({ ...gpu, agentId: agent.agentId });
    });
  });

  const displayGPUs = [...allGPUs, ...DUMMY_GPUS];

  const totalGPUs = displayGPUs.length;
  const avgUtil =
    totalGPUs > 0
      ? Math.round(displayGPUs.reduce((sum, g) => sum + g.util, 0) / totalGPUs)
      : 0;

  const totalMemory = displayGPUs.reduce((sum, g) => sum + g.memTotal, 0);
  const usedMemory = displayGPUs.reduce((sum, g) => sum + g.memUsed, 0);

  return (
    <div className="max-w-7xl mx-auto pt-24">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total GPUs', value: totalGPUs, icon: HardDrive },
          { label: 'Avg Utilization', value: `${avgUtil}%`, icon: Activity },
          { label: 'Total Memory', value: `${Math.round(totalMemory / 1024)}GB`, icon: Zap },
          { label: 'Memory Used', value: `${Math.round(usedMemory / 1024)}GB`, icon: Zap }
        ].map((card, i) => (
          <div
            key={i}
            className="bg-black rounded-lg p-6 border border-[#76B900]/30 hover:border-[#76B900] transition shadow-lg shadow-[#76B900]/10 hover:shadow-[#76B900]/20"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{card.label}</p>
              <card.icon className="w-5 h-5 text-[#76B900]" />
            </div>
            <p className="text-3xl font-bold text-[#76B900]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* GPU Cards */}
      <h2 className="text-2xl font-bold mb-4 text-white">GPU Devices</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayGPUs.map((gpu, idx) => (
          <div
            key={gpu.id ?? idx}
            className="bg-black rounded-lg p-6 border border-[#76B900]/30 hover:border-[#76B900] transition shadow-lg shadow-[#76B900]/10 hover:shadow-[#76B900]/20"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{gpu.name}</h3>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    gpu.status === 'idle'
                      ? 'bg-[#76B900] text-black'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {gpu.status ?? 'idle'}
                </span>

                {gpu.agentId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Agent: {gpu.agentId}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-[#76B900]">{gpu.util}%</p>
                <p className="text-xs text-gray-500">Utilization</p>
              </div>
            </div>

            {/* Memory */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Memory</span>
                <span className="font-mono">
                  {gpu.memUsed}MB / {gpu.memTotal}MB
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-[#76B900] h-2 rounded-full"
                  style={{
                    width: `${(gpu.memUsed / gpu.memTotal) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-600">
              <Stat icon={Activity} label="GPU Util" value={`${gpu.util}%`} />
              <Stat icon={Thermometer} label="Temp" value={`${gpu.temp}°C`} />
              <Stat icon={HardDrive} label="Mem Util" value={`${gpu.utilization}%`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black rounded-lg p-4 border border-gray-600 text-center mt-6">
        <p className="text-sm text-gray-400">
          Showing {displayGPUs.length} GPU(s)
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <Icon className="w-4 h-4 text-white" />
        <span className="font-mono text-sm text-white">{value}</span>
      </div>
    </div>
  );
}
