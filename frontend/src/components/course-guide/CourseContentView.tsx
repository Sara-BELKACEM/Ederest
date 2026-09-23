import React, { useState } from 'react';
import {
  Layers,
  Database,
  GitBranch,
  CheckCircle2,
  Building,
  Box,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Award,
  ExternalLink,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { StepId } from '../../types';

export interface CourseContentViewProps {
  currentStepId: StepId;
  onAdvanceStep: () => void;
  onOpenPurchaseOrderPractice: () => void;
}

export const CourseContentView: React.FC<CourseContentViewProps> = ({
  currentStepId,
  onAdvanceStep,
  onOpenPurchaseOrderPractice,
}) => {
  // Step 1 interactive comparison tab
  const [step1Tab, setStep1Tab] = useState<'siloed' | 'integrated'>('integrated');

  // Step 2 interactive data concept tab
  const [step2DataType, setStep2DataType] = useState<'master' | 'transactional'>('master');

  // Step 3 interactive process stepper active node
  const [activeProcessStep, setActiveProcessStep] = useState<number>(2); // Default to PO step

  // Step 4 knowledge check answers
  const [quizAnswer1, setQuizAnswer1] = useState<string | null>(null);
  const [quizAnswer2, setQuizAnswer2] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      {/* Course Stage Header */}
      <div className="bg-[#1E293B] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center font-bold text-white text-sm">
            SAP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">SAP Fundamentals Academy</h2>
              <span className="text-[10px] bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 px-2 py-0.5 rounded font-mono">
                COURSE MODULE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Guided Curriculum · Step {currentStepId} of 4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified Enterprise Content
          </span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded text-[11px]">
            Certification Track
          </span>
        </div>
      </div>

      {/* Main Educational Stage Body */}
      <div className="p-6">
        {/* ===================================================================
         * STEP 1: Understand SAP Fundamentals
         * =================================================================== */}
        {currentStepId === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Module 1 · Introduction
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                What is SAP and Why Do Enterprises Use ERP?
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                SAP is the world's most widely adopted Enterprise Resource Planning (ERP) platform. Before ERP, companies stored financial accounts in one software, warehouse inventory in another, and sales records in separate spreadsheets.
              </p>
            </div>

            {/* Interactive Architecture Comparison */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                  <span>Compare Enterprise Architectures</span>
                </h4>
                <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setStep1Tab('siloed')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      step1Tab === 'siloed'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Legacy Siloed Systems
                  </button>
                  <button
                    onClick={() => setStep1Tab('integrated')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      step1Tab === 'integrated'
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    SAP Integrated ERP
                  </button>
                </div>
              </div>

              {step1Tab === 'siloed' ? (
                <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-rose-600" aria-hidden="true" />
                    <span>The Problem: Disconnected Departmental Databases</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">Purchasing Dept</strong>
                      <p className="text-gray-600 text-[11px]">Orders 50 laptops via email; accounts team has no visibility.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">Warehouse Dept</strong>
                      <p className="text-gray-600 text-[11px]">Receives shipment on dock; types receipt manually into local stock file.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-rose-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">Finance Dept</strong>
                      <p className="text-gray-600 text-[11px]">Receives vendor invoice; spends days chasing staff to confirm delivery.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-700 italic">
                    Result: Duplicate data entry, reconciliation errors, delayed audits, and inventory discrepancies.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Database className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>The Solution: Single Source of Truth with Real-Time Integration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">1. Purchase Order Created</strong>
                      <p className="text-gray-600 text-[11px]">PO details instantly visible to warehouse, accounting, and plant managers.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">2. Goods Receipt Posted</strong>
                      <p className="text-gray-600 text-[11px]">Scanning shipment increases stock and records liability automatically in real time.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                      <strong className="text-gray-900 block mb-1">3. Automated 3-Way Match</strong>
                      <p className="text-gray-600 text-[11px]">System verifies PO, delivery receipt, and vendor invoice with zero manual chasing.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    Result: Zero duplicate work, 100% auditable traceability, real-time financial reporting.
                  </p>
                </div>
              )}
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
                <h5 className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                  <span>Why Modern Businesses Require ERP</span>
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enterprise operations involve thousands of transactions each hour. An ERP ensures that every department works with matching, validated data adhering to regulatory and compliance standards.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
                <h5 className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>SAP's Role in Global Commerce</span>
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Over 77% of the world's transaction revenue touches an SAP system at some point. Learning core SAP principles provides a critical foundation for digital operations and enterprise careers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
         * STEP 2: Explore Core SAP Concepts
         * =================================================================== */}
        {currentStepId === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Module 2 · Architecture & Terminology
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                Master Data, Organizational Units & Transaction Documents
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                In SAP, enterprise data is strictly partitioned into three categories: structural organizational units, permanent master records, and event-based transactional documents.
              </p>
            </div>

            {/* Interactive Concept Switcher: Master Data vs Transactional Data */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Interactive Concept Explorer
                </span>
                <div className="flex bg-white border border-gray-200 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setStep2DataType('master')}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      step2DataType === 'master'
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Master Data (Persistent)
                  </button>
                  <button
                    onClick={() => setStep2DataType('transactional')}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      step2DataType === 'transactional'
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Transactional Data (Events)
                  </button>
                </div>
              </div>

              {step2DataType === 'master' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold mb-2">
                      <Building className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <strong className="text-gray-900 block">Vendor / Supplier Master</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Stores bank details, tax ID, payment terms, and addresses. Entered once; reused on every PO.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold mb-2">
                      <Box className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <strong className="text-gray-900 block">Material Master</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Stores item dimensions, weight, units of measure, valuation class, and replenishment lead times.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold mb-2">
                      <Layers className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <strong className="text-gray-900 block">General Ledger Master</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Chart of accounts structuring asset, liability, revenue, and expense balances for financial reporting.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                      #PO
                    </div>
                    <strong className="text-gray-900 block">Purchase Order Document</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Created for an exact date and quantity (e.g. 10x Laptops from Apex on Sept 23). Has a unique PO number.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                      #GR
                    </div>
                    <strong className="text-gray-900 block">Goods Receipt Document</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Records the physical arrival of ordered items at the warehouse dock. Updates inventory balances.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                      #INV
                    </div>
                    <strong className="text-gray-900 block">Vendor Invoice Document</strong>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Records the bill received from the vendor and establishes accounts payable liability.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Organizational Hierarchy Blueprint */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                SAP Enterprise Structure Hierarchy
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">LEVEL 1</span>
                  <strong className="text-gray-900">Client</strong>
                  <span className="text-[10px] text-gray-500 block">Entire Enterprise Group</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">LEVEL 2</span>
                  <strong className="text-gray-900">Company Code</strong>
                  <span className="text-[10px] text-gray-500 block">Independent Legal Entity</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center ring-1 ring-indigo-300">
                  <span className="text-[10px] text-indigo-600 font-mono block">LEVEL 3</span>
                  <strong className="text-indigo-950">Plant</strong>
                  <span className="text-[10px] text-indigo-700 block">Manufacturing / Logistics Hub</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">LEVEL 4</span>
                  <strong className="text-gray-900">Storage Location</strong>
                  <span className="text-[10px] text-gray-500 block">Bin / Warehouse Zone</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
         * STEP 3: Understand SAP Business Processes
         * =================================================================== */}
        {currentStepId === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Module 3 · Enterprise Workflows
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                The Procure-to-Pay (P2P) Business Process in Action
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                A business process is a sequence of connected steps executing across multiple enterprise departments. Follow the Procure-to-Pay cycle below to see how a Purchase Order fits into the bigger picture.
              </p>
            </div>

            {/* Interactive Procure-to-Pay Process Stepper */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                  <span>Click Any Stage to Inspect Data Handoffs</span>
                </span>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded">
                  Active Inspection: Stage {activeProcessStep}
                </span>
              </div>

              {/* Process Pipeline Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { id: 1, title: '1. Requisition', dept: 'Department', doc: 'Internal Need' },
                  { id: 2, title: '2. Purchase Order', dept: 'Procurement', doc: 'PO Contract' },
                  { id: 3, title: '3. Goods Receipt', dept: 'Warehouse', doc: 'Physical Stock' },
                  { id: 4, title: '4. Invoice Match', dept: 'Accounts Payable', doc: '3-Way Verification' },
                  { id: 5, title: '5. Payment', dept: 'Treasury / Cash', doc: 'Bank Dispatch' },
                ].map((node) => {
                  const isSelected = activeProcessStep === node.id;
                  const isPOStage = node.id === 2;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveProcessStep(node.id)}
                      className={`p-3 rounded-xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md ring-2 ring-[#4F46E5]/20 scale-102'
                          : isPOStage
                          ? 'bg-amber-50/70 border-amber-200 text-gray-800 hover:bg-amber-50'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`text-[10px] font-mono block ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {node.dept}
                      </span>
                      <strong className="block text-xs mt-0.5">{node.title}</strong>
                      <span className={`text-[10px] mt-1 block ${isSelected ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {node.doc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stage Context Card */}
              <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
                {activeProcessStep === 1 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 mb-1">Stage 1: Purchase Requisition (PR)</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      An internal user or department manager determines a need (e.g. 5 laptops for incoming staff). They submit a Purchase Requisition. This is an internal request, not yet a legal commitment with a vendor.
                    </p>
                  </div>
                )}
                {activeProcessStep === 2 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-xs font-bold text-[#4F46E5]">Stage 2: Purchase Order (PO) — The Crucial Document</h5>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        PRACTICE SIMULATOR AVAILABLE
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      The purchasing department reviews the requisition, selects an approved vendor, verifies material catalog prices, and issues a Purchase Order. This creates a legally binding procurement commitment.
                    </p>
                    <div className="p-3 bg-white border border-indigo-200 rounded-lg flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-700">
                        Want to practice creating a Purchase Order directly in the mock software interface?
                      </span>
                      <button
                        onClick={onOpenPurchaseOrderPractice}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] flex-shrink-0"
                      >
                        <span>Open PO Practice Simulator</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
                {activeProcessStep === 3 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 mb-1">Stage 3: Goods Receipt (GR)</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      The physical goods arrive at the dock. The warehouse team inspects the delivery against the Purchase Order number. In SAP, posting a Goods Receipt increases inventory on hand and logs an accrued expense automatically.
                    </p>
                  </div>
                )}
                {activeProcessStep === 4 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 mb-1">Stage 4: Invoice Verification & 3-Way Match</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      The vendor sends their invoice bill. SAP automatically executes a <strong>Three-Way Match</strong>: comparing the Purchase Order details, the Goods Receipt quantity, and the Invoice price. If all three match within tolerance, it is approved for payment.
                    </p>
                  </div>
                )}
                {activeProcessStep === 5 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 mb-1">Stage 5: Payment Execution</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Treasury releases financial disbursement to the vendor via electronic bank transfer according to agreed payment terms (e.g., Net 30 days). The open liability in Accounts Payable is cleared.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
         * STEP 4: Review and Complete SAP Fundamentals
         * =================================================================== */}
        {currentStepId === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Module 4 · Review & Verification
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                Synthesize Concepts & Verify Your Knowledge
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Review the core principles mastered in SAP Fundamentals and complete the quick knowledge verification checkpoints below.
              </p>
            </div>

            {/* Knowledge Check 1 */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                <h4 className="text-xs font-bold text-gray-900">
                  Checkpoint 1: Which of the following is considered Master Data in an ERP system?
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'a', text: 'Purchase Order #9042', correct: false },
                  { id: 'b', text: 'Vendor Record & Address', correct: true },
                  { id: 'c', text: 'Goods Delivery Note', correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQuizAnswer1(opt.id)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      quizAnswer1 === opt.id
                        ? opt.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {quizAnswer1 === opt.id && (
                      <span className="block text-[10px] mt-1 font-bold">
                        {opt.correct ? '✓ Correct! Reusable long-term record.' : '✗ Incorrect. This is transactional data.'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge Check 2 */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                <h4 className="text-xs font-bold text-gray-900">
                  Checkpoint 2: What is the purpose of a 3-way match during Procure-to-Pay?
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'a', text: 'To ensure PO, Goods Receipt, and Invoice match before payment', correct: true },
                  { id: 'b', text: 'To notify three different managers simultaneously', correct: false },
                  { id: 'c', text: 'To order items from three separate suppliers', correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQuizAnswer2(opt.id)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      quizAnswer2 === opt.id
                        ? opt.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {quizAnswer2 === opt.id && (
                      <span className="block text-[10px] mt-1 font-bold">
                        {opt.correct ? '✓ Correct! Protects against fraudulent or incorrect billing.' : '✗ Incorrect. Try again.'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Completion Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Course Completion Ready!</h4>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    You have reviewed all core concepts in SAP Fundamentals. Click below to complete the course or practice creating a real PO.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onOpenPurchaseOrderPractice}
                  className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20"
                >
                  Open PO Practice
                </button>
                <button
                  onClick={onAdvanceStep}
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-md transition-all focus-visible:ring-2 focus-visible:ring-white"
                >
                  Finalize Course ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
