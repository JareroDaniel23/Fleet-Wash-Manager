import React, { useEffect, useState } from 'react';
import api from '../api/axiosconfig';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const SealForm = () => {

  const [logHistory, setLogHistory] = useState([]);

  const [newEntry, setNewEntry] = useState({
    date: '',
    driverName: '',
    washerName: '',
    vehicleType: '',
    licensePlate: '',
    initialStrap: '',
    finalStrap: ''
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const reponse = await api.get('/seal-logs');
      setLogHistory(reponse.data);
      
    }catch (error){
      console.error("Error loading logs", error);
    }
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };

  const countSealsInRow = (log) => {

    const start = parseInt(log.initialStrap);
    const end = parseInt(log.finalStrap);

    if(!isNaN(start) && !isNaN(end)){
      if(end >= start){
        return end - start;
      }
    }
  };

  const totalSealsUsed = logHistory.reduce((acc, log) => acc + countSealsInRow(log), 0);

const exportToExcel = () => {
    if(logHistory.length === 0) {
        alert("No data to export.");
        return;
    }

    const dataToExport = logHistory.map(log => ({
        "ID": log.id,
        "Date": log.date,
        "Driver": log.driverName,
        "Operator": log.washerName,
        "Type": log.vehicleType,
        "Plate": log.licensePlate,
        "Initial Seal": log.initialStrap,
        "Final Seal": log.finalStrap,
        "Qty Used": countSealsInRow(log)  
    }));
    const grandTotal = dataToExport.reduce((acc, row) => acc + (row["Qty Used"] || 0), 0);

    dataToExport.push({
        "ID": "",
        "Date": "",
        "Driver": "",
        "Operator": "",
        "Type": "",
        "Plate": "",
        "Initial Seal": "",
        "Final Seal": "TOTAL TOTAL:",
        "Qty Used": grandTotal
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Seals');
    XLSX.writeFile(workbook, 'Seal_Report.xlsx');
  };

  const addEntry = async (e) => {
    e.preventDefault(); 

    if (!newEntry.date || !newEntry.driverName) {
      alert("Please fill required fields (Date & Driver)");
      return;
    }

    try {
      await api.post('/seal-logs', newEntry);
        
      alert("✅ Log Saved Successfully!");
      loadLogs();
    
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        driverName: '',
        washerName: '',
        vehicleType: '',
        licensePlate: '',
        initialStrap: '',
        finalStrap: '',
        QtyUsed: totalSealsUsed
      })
    } catch (error) {
      console.error("Error saving Log:", error)
      alert("❌ Error saving to database")
    }
  };


  const deleteOne = async (id) => {
    if(!window.confirm("Delete this record?")) return;
    try {
        await api.delete(`/seal-logs/${id}`); // Requires @DeleteMapping("/{id}") in Backend
        loadLogs(); // Reload list
    } catch (error) {
        console.error("Error deleting one:", error);
        alert("Error deleting. Check if Backend supports delete by ID.");
    }
  }
  const deleteAll = async () => {
    if(!window.confirm("⚠️ Are you sure you want to delete ALL records?")) return;

    try {
        await api.delete('/seal-logs');
        setLogHistory([]); 
        alert("All records deleted.");
    } catch (error) {
        console.error("Error deleting:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-900"></div> 
        <div className="z-10">
        <Link 
          to='/'
          className='z-10 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-1 flex items-center gap-2'
        >
          ⬅ Back to Dashboard
        </Link>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            🔐 Security Seal Monitor
          </h2>
          <p className="text-gray-500 mt-1">System Date: {new Date().toLocaleDateString('en-US')}</p>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-md p-1">📝</span>
          <h3 className="font-bold text-gray-700">New Entry Log</h3>
        </div>

        <form className="p-8" onSubmit={addEntry}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">General Info</label>

              <input 
                type="date"
                name="date" 
                value={newEntry.date}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3" 
              />

              {/* Driver */}
              <input 
                type="text"
                name="driverName"
                value={newEntry.driverName}
                onChange={handleInputChange}
                placeholder="Driver Name" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3" 
              />

              <input 
                type="text"
                name="washerName"
                value={newEntry.washerName}
                onChange={handleInputChange} 
                placeholder="Washed By (Operator)" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Vehicle Data</label>
                <input 
                type="text"
                name="vehicleType" 
                value={newEntry.vehicleType}
                onChange={handleInputChange}  
                placeholder='Vehicle Type'
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3"
                />

              <input 
                type="text" 
                name="licensePlate"
                value={newEntry.licensePlate}
                onChange={handleInputChange}
                placeholder="Truck Plate Number" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3" 
              />
            </div>

            {/* Group 3: Seal */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Security Seals IDs</label>
              
              <input 
                type="number"
                name="initialStrap"
                value={newEntry.initialStrap}
                onChange={handleInputChange} 
                placeholder="Initial Seal ID" 
                className="w-full bg-blue-50 border border-blue-200 text-blue-900 font-bold rounded-lg p-3" 
              />

              <input 
                type="number" 
                name="finalStrap"
                value={newEntry.finalStrap}
                onChange={handleInputChange}
                placeholder="Final Seal ID" 
                className="w-full bg-blue-50 border border-blue-200 text-blue-900 font-bold rounded-lg p-3" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            💾 Save Log Entry
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-700">📋 Recent Logs</h3>

          <button 
              onClick={exportToExcel} 
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1 transition-colors shadow-sm"
            >
                📊 Excel
            </button>

          <button 
            onClick={deleteAll}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded"
          >
            Delete All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Driver</th>
                <th className='px-6 py-3'>Washer</th>
                <th className='px-6 py-6'>Type</th>
                <th className="px-6 py-3">Plate</th>
                <th className="px-6 py-3">Initial Seal</th>
                <th className="px-6 py-3">Final Seal</th>
                <th className="px-6 py-3 text-center">Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logHistory.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 font-bold">{item.date}</td>
                  <td className="px-6 py-4">{item.driverName}</td>
                  <td className='px-6 py-4'>{item.washerName}</td>
                  <td className='px-6 py-4'>{item.vehicleType}</td>
                  <td className="px-6 py-4">{item.licensePlate}</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{item.initialStrap}</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{item.finalStrap}</td>
                  <td className="px-6 py-4 font-mono text-blue-600">{countSealsInRow(item)}</td>
                  <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => deleteOne(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold hover:bg-red-50 px-3 py-1 rounded transition-colors">
                      🗑️
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SealForm;