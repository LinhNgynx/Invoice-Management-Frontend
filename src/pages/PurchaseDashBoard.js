import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const PurchaseDashboard = () => {
  return (
    // <div style={{ display: 'flex', height: '100vh' }}>
    //   {/* Sidebar */}
    //   <nav style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
    //     <h2>Purchase Team Dashboard</h2>
    //     <ul style={{ listStyleType: 'none', padding: 0 }}>
    //       <li>
    //         <Link to="create-request">Create Request</Link>
    //       </li>
    //       <li>
    //         <Link to="save-bill">Save Bill</Link>
    //       </li>
    //       <li>
    //         <Link to="statistics">Statistics</Link>
    //       </li>
    //       <li>
    //         <Link to="logout">Logout</Link>
    //       </li>
    //     </ul>
    //   </nav>

    //   {/* Main Content Area */}
    //   <div style={{ flex: 1, padding: '20px' }}>
    //     <Outlet /> {/* Render the selected component here */}
    //   </div>
    // </div>

    <div className="overflow-hidden bg-stone-500 bg-opacity-60">
    <div className="flex gap-5 max-md:flex-col">
    <div className="flex flex-col w-[21%] max-md:ml-0 max-md:w-full">
      <nav className="flex overflow-hidden flex-col pt-10 mx-auto w-full text-2xl text-white bg-pink-950 pb-[565px] max-md:pb-24">
        <h2 className="self-start ml-2.5 text-4xl max-md:text-4xl">InvoiceActive</h2>
        <ul>
          <li className="overflow-hidden px-6 pt-5 pb-8 mt-24 bg-stone-500 bg-opacity-60 max-md:px-5 max-md:mt-10">
            <Link to="main page">Main Page</Link>
          </li>
          <li className="gap-2.5 self-stretch p-5 whitespace-nowrap w-[310px] max-md:ml-0.5">
            Dashboard
          </li>
          <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="create-request">Create Request</Link>
          </li>
          <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="requests">Request List</Link>
          </li>
          {/* <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="member-list">Member List</Link>
          </li>
          <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="product-list">Product List</Link>
          </li>
          <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="requests">Request List</Link>
          </li>
          <li className="gap-2.5 self-stretch px-8 py-5 bg-stone-500 bg-opacity-60 min-h-[69px] w-[272px]">
            <Link to="statistic">Statistic</Link>
          </li> */}
        </ul>
      </nav>
    </div>
    <div className="flex flex-col ml-5 w-[79%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <header className="flex overflow-hidden flex-wrap gap-10 px-16 py-1 w-full border border-black border-solid bg-pink-950 max-md:px-5 max-md:max-w-full">
            <div className="flex items-start text-2xl text-white whitespace-nowrap">
              <div className="gap-2.5 self-end px-1.5 mt-6 min-h-[54px] w-[90px]">
                 Admin
                <Link to="logout"> Logout</Link>
              </div>
            </div>
            </header>
    {/* Main Content Area */}
    <div style={{ flex: 1, padding: '20px' }}>
    <Outlet /> {/* Render the selected component here */}
    </div>
    </div>
    </div>
  </div>
  </div>
  );
};

export default PurchaseDashboard;
