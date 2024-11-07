// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// );

// const Dashboard = () => {
//   // Example chart data
//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [
//       {
//         label: 'Revenue Over Time',
//         data: [1000, 1200, 800, 1500, 1100],
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Revenue Chart',
//       },
//     },
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {/* Chart Section */}
//         <div className="bg-white shadow-lg rounded-lg p-6 col-span-1">
//           <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
//           <Line data={data} options={options} />
//         </div>

//         {/* Statistics Section */}
//         <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 lg:col-span-1">
//           <h2 className="text-xl font-semibold mb-2">Total Requests</h2>
//           <p className="text-4xl font-bold">25</p>
//         </div>

//         <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 lg:col-span-1">
//           <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
//           <p className="text-4xl font-bold">$24,500</p>
//         </div>

//         {/* Pending Requests */}
//         <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 lg:col-span-1">
//           <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
//           <p className="text-4xl font-bold">5</p>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Request ID</th>
//               <th className="py-2 px-4 border-b">Detail</th>
//               <th className="py-2 px-4 border-b">Total Price</th>
//               <th className="py-2 px-4 border-b">State</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="hover:bg-gray-50">
//               <td className="py-2 px-4 border-b">REQ001</td>
//               <td className="py-2 px-4 border-b">Sample Request 1</td>
//               <td className="py-2 px-4 border-b">$1,000</td>
//               <td className="py-2 px-4 border-b">Pending</td>
//             </tr>
//             <tr className="hover:bg-gray-50">
//               <td className="py-2 px-4 border-b">REQ002</td>
//               <td className="py-2 px-4 border-b">Sample Request 2</td>
//               <td className="py-2 px-4 border-b">$1,500</td>
//               <td className="py-2 px-4 border-b">Completed</td>
//             </tr>
//             {/* Add more rows as needed */}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
