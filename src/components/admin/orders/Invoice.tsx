import React from 'react';

interface ShipOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderItem: IOrderItems | null;
}

const ShipOrder: React.FC<ShipOrderModalProps> = ({ open, onClose, orderItem }) => {
  if (!orderItem || !open) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
<html>
  <head>
    <title>Print Order</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .container {
        width: 100%;
        max-width: 800px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        font-size: 28px;
        margin-bottom: 20px;
        color: #333333;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 10px;
      }
      .info {
        margin-top: 20px;
      }
      .info p {
        font-size: 16px;
        margin: 8px 0;
        color: #555555;
      }
      .info p strong {
        color: #333333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Order Details</h1>
      <div class="info">
        <p><strong>Order ID :</strong> ${orderItem.orderId}</p>
        <p><strong>Product Name :</strong> ${orderItem.name_en}</p>
        <p><strong>Quantity :</strong> ${orderItem.quantity}</p>
        <p><strong>Size :</strong> ${orderItem.size}</p>
        <p><strong>Price :</strong> ${orderItem.price}</p>
        <p><strong>Due Date :</strong> ${new Date(orderItem.dueDate).toLocaleDateString()}</p>
      </div>
    </div>
  </body>
</html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 ${!open && 'hidden'}`}>
      <div className="relative mx-auto my-20 bg-white rounded-lg shadow-lg max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ship Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-medium text-gray-700">Order ID:</span>
              <span className="text-gray-900">{orderItem.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-medium text-gray-700">Product Name:</span>
              <span className="text-gray-900">{orderItem.name_en}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-medium text-gray-700">Quantity:</span>
              <span className="text-gray-900">{orderItem.quantity}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-medium text-gray-700">Size:</span>
              <span className="text-gray-900">{orderItem.size}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-medium text-gray-700">Price:</span>
              <span className="text-gray-900">{orderItem.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Due Date:</span>
              <span className="text-gray-900">{new Date(orderItem.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded mr-2"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipOrder;
