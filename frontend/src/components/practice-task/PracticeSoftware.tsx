import React from 'react';
import { Building2, Package, Hash, CheckCircle, FileText, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { StepId } from '../../types';

export interface PracticeSoftwareProps {
  currentStep: StepId;
  supplier: string;
  onSupplierChange: (val: string) => void;
  product: string;
  onProductChange: (val: string) => void;
  quantity: string;
  onQuantityChange: (val: string) => void;
  onSubmitPO: () => void;
  onWrongInteraction: () => void;
  isCompleted: boolean;
}

export const PracticeSoftware: React.FC<PracticeSoftwareProps> = ({
  currentStep,
  supplier,
  onSupplierChange,
  product,
  onProductChange,
  quantity,
  onQuantityChange,
  onSubmitPO,
  onWrongInteraction,
  isCompleted,
}) => {
  // Mock product price lookup
  const getProductPrice = (prod: string): number => {
    switch (prod) {
      case 'Laptop - Model X200':
        return 1200;
      case 'Office Supplies Pack':
        return 150;
      case 'Network Switch 24-Port':
        return 850;
      default:
        return 0;
    }
  };

  const parsedQty = parseInt(quantity, 10) || 0;
  const unitPrice = getProductPrice(product);
  const totalAmount = unitPrice * parsedQty;

  return (
    <div
      className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden"
      onClick={(e) => {
        // If clicking random white space outside interactive controls, count potential distraction
        const target = e.target as HTMLElement;
        if (target.tagName === 'DIV' && !target.closest('button, select, input, a')) {
          onWrongInteraction();
        }
      }}
    >
      {/* Enterprise App Header Bar */}
      <div className="bg-[#1E293B] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center font-bold text-white text-sm">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">Enterprise Requisition Suite</h2>
              <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-mono">
                MOCK ERP v4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Transaction: ME21N — Create Standard Purchase Order</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1 font-mono">
            <FileText className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            PO #PO-2026-9042
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            2026-09-23
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-amber-950/80 text-amber-300 border-amber-700'
            }`}
          >
            {isCompleted ? 'Status: Approved & Dispatched' : 'Status: Draft'}
          </span>
        </div>
      </div>

      {/* Main PO Document Container */}
      <div className="p-6 space-y-6">
        {/* Header Information Grid */}
        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STEP 1: Supplier Lookup */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              currentStep === 1
                ? 'bg-white border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-sm'
                : 'bg-transparent border-slate-200 opacity-90'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="po-supplier-select"
                className="text-xs font-bold text-gray-800 flex items-center gap-1.5"
              >
                <Building2 className={`w-3.5 h-3.5 ${currentStep === 1 ? 'text-[#4F46E5]' : 'text-gray-500'}`} aria-hidden="true" />
                <span>1. Vendor / Supplier</span>
                {currentStep === 1 && (
                  <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.2 rounded font-semibold">
                    ACTIVE STEP
                  </span>
                )}
              </label>
              {supplier && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />}
            </div>

            <select
              id="po-supplier-select"
              value={supplier}
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
              aria-required="true"
            >
              <option value="">-- Choose Approved Vendor --</option>
              <option value="GlobalTech Supplies">GlobalTech Supplies (Vendor #V-102)</option>
              <option value="Apex Procurement">Apex Procurement Inc. (Vendor #V-105)</option>
              <option value="NovaParts Logistics">NovaParts Logistics (Vendor #V-109)</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">Authorized regional supply partners</p>
          </div>

          {/* Purchasing Org Info */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">Purchasing Unit</span>
            <div className="font-semibold text-gray-800">EU-CENTRAL-01 (Headquarters)</div>
            <div className="text-[10px] text-gray-500 mt-1">Payment terms: Net 30 days</div>
          </div>

          {/* Currency & Tax */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">Currency & Delivery</span>
            <div className="font-semibold text-gray-800">USD ($) — Standard Freight</div>
            <div className="text-[10px] text-gray-500 mt-1">Tax code: V1 (19% standard VAT)</div>
          </div>
        </div>

        {/* PO Line Items Section */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              Line Item Specification
            </h3>
            <span className="text-[11px] text-slate-500">Item 0010 of 0010</span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
            {/* STEP 2: Product Item Dropdown */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                currentStep === 2
                  ? 'bg-white border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-sm'
                  : 'bg-transparent border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="po-product-select"
                  className="text-xs font-bold text-gray-800 flex items-center gap-1.5"
                >
                  <Package className={`w-3.5 h-3.5 ${currentStep === 2 ? 'text-[#4F46E5]' : 'text-gray-500'}`} aria-hidden="true" />
                  <span>2. Catalog Product Item</span>
                  {currentStep === 2 && (
                    <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.2 rounded font-semibold">
                      ACTIVE STEP
                    </span>
                  )}
                </label>
                {product && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />}
              </div>

              <select
                id="po-product-select"
                value={product}
                onChange={(e) => onProductChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                aria-required="true"
              >
                <option value="">-- Choose Catalog Product --</option>
                <option value="Laptop - Model X200">Laptop - Model X200 ($1,200.00 / unit)</option>
                <option value="Office Supplies Pack">Office Supplies Pack ($150.00 / unit)</option>
                <option value="Network Switch 24-Port">Network Switch 24-Port ($850.00 / unit)</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Catalog equipment requisition code</p>
            </div>

            {/* STEP 3: Quantity Input */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                currentStep === 3
                  ? 'bg-white border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-sm'
                  : 'bg-transparent border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="po-quantity-input"
                  className="text-xs font-bold text-gray-800 flex items-center gap-1.5"
                >
                  <Hash className={`w-3.5 h-3.5 ${currentStep === 3 ? 'text-[#4F46E5]' : 'text-gray-500'}`} aria-hidden="true" />
                  <span>3. Order Quantity (Units)</span>
                  {currentStep === 3 && (
                    <span className="text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-1.5 py-0.2 rounded font-semibold">
                      ACTIVE STEP
                    </span>
                  )}
                </label>
                {parsedQty > 0 && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />}
              </div>

              <input
                id="po-quantity-input"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                placeholder="e.g. 5"
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                aria-required="true"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Enter an integer greater than 0 (e.g., 5 or 10 units)
              </p>
            </div>
          </div>

          {/* Pricing Calculation Summary Table */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs">
            <div className="text-gray-600">
              Unit Price: <span className="font-semibold text-gray-800">${unitPrice.toLocaleString()}.00</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
              <DollarSign className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Subtotal: ${totalAmount.toLocaleString()}.00 USD</span>
            </div>
          </div>
        </div>

        {/* STEP 4: Review & Final Submission */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            currentStep === 4
              ? 'bg-indigo-50/50 border-[#4F46E5] ring-2 ring-[#4F46E5]/20'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  4. Final Verification & Approval
                </h4>
                {currentStep === 4 && (
                  <span className="text-[10px] bg-[#4F46E5] text-white px-2 py-0.5 rounded font-semibold">
                    READY FOR DISPATCH
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {supplier && product && parsedQty > 0
                  ? `Order Summary: ${parsedQty}x ${product} from ${supplier} (Total: $${totalAmount.toLocaleString()}.00 USD)`
                  : 'Complete Steps 1–3 above to verify order details.'}
              </p>
            </div>

            <button
              id="po-submit-button"
              onClick={onSubmitPO}
              disabled={isCompleted || !supplier || !product || parsedQty <= 0}
              className={`inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isCompleted
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white focus-visible:ring-[#4F46E5] active:scale-[0.98]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label="Submit Purchase Order for processing"
            >
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isCompleted ? 'PO Dispatched ✓' : 'Submit Purchase Order'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
