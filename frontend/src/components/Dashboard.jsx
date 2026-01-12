import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosconfig';
import * as XLSX from 'xlsx';


const Dashboard = () => {

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [washingLog, setWashingLog] = useState([]);
    const [supplies, setSupplies] = useState({ disinfectant: 0, degreaser: 0, bleach: 0 });

    const [newWash, setNewWash] = useState({
      vehicleTypeId: '',
      timeMinutes: '',
      date: new Date().toISOString().split('T')[0]
    });

    const [restock, setRestock] = useState({
      type: 'disinfectant',
      quantity: ''
    })

    useEffect(() => {
      loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
      try {
        const typeRes = await api.get('/vehicle-types');
        setVehicleTypes(typeRes.data);

        const loadRes = await api.get('/washing-services');
        setWashingLog(loadRes.data);

        const suppRes = await api.get('/supplies');
        const inventoryMap = { disinfectant: 0, degreaser: 0, bleach: 0 };
        
        if(Array.isArray(suppRes.data)){
            suppRes.data.forEach(item => {
                const key = item.name ? item.name.toLowerCase().trim() : '';
                if (key.includes('disinfectant') || key.includes('desinfectante')) inventoryMap.disinfectant = item.currentQuantity;
                else if (key.includes('degreaser') || key.includes('desengrasante')) inventoryMap.degreaser = item.currentQuantity;
                else if (key.includes('bleach') || key.includes('cloro')) inventoryMap.bleach = item.currentQuantity;
            });
            setSupplies(inventoryMap);
        }
      }
      catch (error) {
        console.error(error);
      }
    };

    const handleInputChange = (e) => {
      setNewWash({ ...newWash, [e.target.name]: e.target.value });
    };

    const handleRegisterWash = async () => {
      if (!newWash.vehicleTypeId || !newWash.timeMinutes) {
        alert('Please select a vehicle type and enter time.');
        return;
      }
      try {
        const payload = {
          vehicleType: { id: newWash.vehicleTypeId },
          timeTaken: newWash.timeMinutes,
          washingMinutes: newWash.timeMinutes, 
          date: newWash.date
        };

        await api.post('/washing-services', payload);
        alert('Wash Registered Successfully! 🚛');
        loadDashboardData(); 
        setNewWash({ ...newWash, timeMinutes: '' });
      } catch (error) {
        console.error(error);
        alert("Error registering wash.");
      }
    };

    const handleDeleteWash = async (id) => {
      if(!window.confirm('Are you sure you want to delete this record?')) return;

      try{
        await api.delete(`/washing-services/${id}`);
        setWashingLog(prev => prev.filter(item => item.id !== id));
        loadDashboardData(); 
      } catch (error){
        console.error("Error deleting:", error);
        alert("Failed to delete. Check Backend Console.");
      };
    };

    const handleClearTable = async () => {
        if(!window.confirm("⚠️ WARNING: This will delete ALL records history.")) return;
        
        try {
            await api.delete('/washing-services'); 
            setWashingLog([]); 
            loadDashboardData(); 
            alert("Table Cleared Successfully.");
        } catch (error) {
            console.error("Error clearing table:", error);
            alert("Failed to clear table.");
        }
    };

    const handleRestock = async () => {
      if(!restock.quantity || restock.quantity <= 0) {
        alert("Please enter valid quantity")
        return;
      }
      try {
        const payload = {
          name: restock.type,
          currentQuantity: parseFloat(restock.quantity)
        };

        await api.post('/supplies/restock', payload);
        alert(`Stock added succesfully! (+${restock.quantity})`);
        setRestock({...restock, quantity: ''});
        
        loadDashboardData(); 
      } catch (error) {
        console.error("Restock failed", error);
        alert("Error adding stock.")
      }
    };

    const handleClearInventory = async () => {
        if(!window.confirm("⚠ WARNING: This will empty all inventory tanks to 0.")) return;
        
        try {
            await api.delete('/supplies');
            setSupplies({ disinfectant: 0, degreaser: 0, bleach: 0 });
            alert("Inventory cleared successfully.");
            loadDashboardData();
        } catch (error) {
            console.error("Error clearing inventory:", error);
            alert("Failed to clear inventory.");
        }
    };

    const totals = washingLog.reduce((acc, log) => {
        return {
            water: acc.water + (log.waterUsed || 0),
            disinf: acc.disinf + (log.disinfectantUsed || 0),
            degreaser: acc.degreaser + (log.degreaserUsed || 0),
            bleach: acc.bleach + (log.bleachUsed || 0)
        };
    }, { water: 0, disinf: 0, degreaser: 0, bleach: 0 });


        const exportToExcel = () => {
      const dataToExport = washingLog.map(service => ({
        "ID": service.id,
        "Date": service.date,
        "Vehicle Type" : service.vehicleType ? service.vehicleType.name : "N/A",
        "Time (m)": service.washingMinutes,
        "Water (L)": service.waterUsed,
        "Disinfectant (mL)": service.disinfectantUsed,
        "Degreaser (mL)": service.degreaserUsed,
        "Bleach (mL)" : service.bleachUsed
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      const columnWidths = [
        {wch : 5}, 
        {wch : 15},
        {wch : 20},
        {wch : 12},
        {wch : 10},
        {wch : 15},
        {wch : 15},
        {wch : 10}
      ];

      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Washing Report');
      XLSX.writeFile(workbook, 'Report.xlsx');
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-center border-l-8 border-blue-900">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            🚛 Car-Wash San Diego
          </h1>
          <p className="text-gray-500 text-sm mt-1">Fleet Maintenance & Inventory System</p>
        </div>
        
      <Link 
      to='/security'
      className='t-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 flex items-center gap-2'>
      🔐 Register Security Seal
      </Link>

      </div>

      {/* INVENTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-3 rounded-lg text-teal-700 text-xl">💧</div>
            <h2 className="text-xl font-bold text-gray-800">Current Inventory</h2>
            <button 
                onClick={handleClearInventory}
                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded border border-red-100 hover:bg-red-100 transition-colors"
            >
                🗑️ Reset Levels
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Disinfectant</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{supplies.disinfectant || 0.0} <span className="text-sm text-gray-400 font-normal">L</span></p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Degreaser</p>
              <p className="text-3xl font-bold text-gray-800 mt-2"> {supplies.degreaser || 0.0} <span className="text-sm text-gray-400 font-normal">L</span></p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
              <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Bleach</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{supplies.bleach || 0.0} <span className="text-sm text-gray-400 font-normal">L</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg text-green-700 text-xl">➕</div>
            <h2 className="text-xl font-bold text-gray-800">Restock Inventory</h2>
          </div>
          
         <div className="space-y-3">
            <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={restock.type}
                onChange={(e) => setRestock({...restock, type: e.target.value})}
            >
                <option value="disinfectant">Disinfectant</option>
                <option value="degreaser">Degreaser</option>
                <option value="bleach">Bleach</option>
            </select>

            <input 
                type="number" 
                placeholder="Quantity" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={restock.quantity}
                onChange={(e) => setRestock({...restock, quantity: e.target.value})}
            />

            <button 
                onClick={handleRestock}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors mt-2"
            >
              Add Stock
            </button>
          </div>
        </div>
      </div>

      {/* REGISTER FORM */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-700">🚛 Register Car Wash</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle Type</label>
              <select 
                name="vehicleTypeId" 
                value={newWash.vehicleTypeId} 
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select Type...</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name || type.description || type.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time (Minutes)</label>
              <input 
                type="number" 
                name='timeMinutes'
                value={newWash.timeMinutes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="0" 
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input 
                type="date" 
                name='date'
                value={newWash.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600" 
              />
            </div>

            <div className="col-span-1">
              <button 
                onClick={handleRegisterWash}
                className="w-full bg-blue-900 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
              >
                + Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type of Vehicle</th>
                <th className="px-6 py-4 text-center">Water (L)</th>
                <th className="px-6 py-4 text-center">Disinfectant</th>
                <th className="px-6 py-4 text-center">Degreaser</th>
                <th className="px-6 py-4 text-center">Bleach</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              
              {washingLog.length > 0 ? (
                washingLog.map((log) => {
                    return (
                        <tr key={log.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{log.date}</td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-bold">
                                    {log.vehicleType ? (log.vehicleType.name || log.vehicleType.type) : 'Unknown'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-gray-600">{log.waterUsed || 0}</td>
                            <td className="px-6 py-4 text-center text-gray-600">{log.disinfectantUsed || 0} mL</td>
                            <td className="px-6 py-4 text-center text-gray-600">{log.degreaserUsed || 0} mL</td>
                            <td className="px-6 py-4 text-center text-gray-600">{log.bleachUsed || 0} mL</td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                onClick={() => handleDeleteWash(log.id)}
                                className="text-red-500 hover:text-red-700 font-bold hover:underline">Delete</button>
                            </td>
                        </tr>
                    );
                })
              ) : (
                <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                        No wash records found.
                    </td>
                </tr>
              )}

              {/* TOTALS */}
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td colSpan="2" className="px-6 py-4 text-right font-bold text-gray-700 uppercase">Totales Gastados:</td>
                <td className="px-6 py-4 text-center font-bold text-blue-900">{totals.water}</td>
                <td className="px-6 py-4 text-center font-bold text-blue-900">{totals.disinf}</td>
                <td className="px-6 py-4 text-center font-bold text-blue-900">{totals.degreaser}</td>
                <td className="px-6 py-4 text-center font-bold text-blue-900">{totals.bleach}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 justify-end">
        <button 
          onClick={handleClearTable} 
          className="px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm"
        >
          ⚠️ Clear Table
        </button>
        <button 
        onClick={exportToExcel}
        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2">
          📊 Export Weekly Excel
        </button>
      </div>

    </div>
  );
};

export default Dashboard;