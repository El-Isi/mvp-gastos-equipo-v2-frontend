'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CATEGORIES,
  MEMBERS,
  STATUS_MAP,
  DEFAULT_EXPENSES,
} from '@/lib/constants';
import type {
  Expense,
  ExpenseFormData,
  CategoryBreakdown,
  MemberBreakdown,
} from '@/lib/constants';
import { formatMoney, generateId } from '@/lib/utils';
import Header from '@/components/header';
import SummaryCards from '@/components/summary-cards';
import Filters from '@/components/filters';
import DashboardView from '@/components/dashboard-view';
import ListView from '@/components/list-view';
import ExpenseFormModal from '@/components/expense-form-modal';

export default function GastosEquipo() {
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [view, setView] = useState<'dashboard' | 'lista'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('all');
  const [filterMember, setFilterMember] = useState('all');
  const [mounted, setMounted] = useState(false);

  const emptyForm: ExpenseFormData = {
    member: MEMBERS[0],
    category: 'software',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'pendiente',
  };

  const [form, setForm] = useState<ExpenseFormData>(emptyForm);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('team-expenses-data');
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('team-expenses-data', JSON.stringify(expenses));
    } catch {
      // Silently fail
    }
  }, [expenses, mounted]);

  const openNew = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((exp: Expense) => {
    setForm({ ...exp, amount: String(exp.amount) });
    setEditingId(exp.id);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
  }, []);

  const saveExpense = useCallback(() => {
    if (!form.description || !form.amount || Number(form.amount) <= 0) return;
    if (editingId) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, ...form, amount: Number(form.amount) }
            : e
        )
      );
    } else {
      setExpenses((prev) => [
        { ...form, id: generateId(), amount: Number(form.amount) },
        ...prev,
      ]);
    }
    closeForm();
  }, [form, editingId, closeForm]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const cycleStatus = useCallback((id: string) => {
    const order: Array<'pendiente' | 'aprobado' | 'rechazado'> = [
      'pendiente',
      'aprobado',
      'rechazado',
    ];
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next = order[(order.indexOf(e.status) + 1) % 3];
        return { ...e, status: next };
      })
    );
  }, []);

  const resetData = useCallback(() => {
    setExpenses(DEFAULT_EXPENSES);
    try {
      localStorage.removeItem('team-expenses-data');
    } catch {
      // Silently fail
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilterCat('all');
    setFilterMember('all');
  }, []);

  const filtered = expenses.filter(
    (e) =>
      (filterCat === 'all' || e.category === filterCat) &&
      (filterMember === 'all' || e.member === filterMember)
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const totalApproved = filtered
    .filter((e) => e.status === 'aprobado')
    .reduce((s, e) => s + e.amount, 0);
  const totalPending = filtered
    .filter((e) => e.status === 'pendiente')
    .reduce((s, e) => s + e.amount, 0);
  const approvedCount = filtered.filter((e) => e.status === 'aprobado').length;
  const pendingCount = filtered.filter((e) => e.status === 'pendiente').length;

  const catBreakdown: CategoryBreakdown[] = CATEGORIES.map((c) => ({
    ...c,
    total: filtered
      .filter((e) => e.category === c.id)
      .reduce((s, e) => s + e.amount, 0),
    count: filtered.filter((e) => e.category === c.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);

  const memberBreakdown: MemberBreakdown[] = MEMBERS.map((m) => ({
    name: m,
    total: filtered
      .filter((e) => e.member === m)
      .reduce((s, e) => s + e.amount, 0),
    count: filtered.filter((e) => e.member === m).length,
  }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div
      className="min-h-screen bg-konfio-bg text-konfio-text font-sans transition-opacity duration-500"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <Header view={view} onChangeView={setView} onNewExpense={openNew} />

      <main className="max-w-[1100px] mx-auto px-6 pt-6 pb-16">
        <SummaryCards
          total={total}
          totalApproved={totalApproved}
          totalPending={totalPending}
          filteredCount={filtered.length}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
        />

        <Filters
          filterCat={filterCat}
          filterMember={filterMember}
          onFilterCatChange={setFilterCat}
          onFilterMemberChange={setFilterMember}
          onClear={clearFilters}
          onReset={resetData}
        />

        {view === 'dashboard' && (
          <DashboardView
            catBreakdown={catBreakdown}
            memberBreakdown={memberBreakdown}
            filtered={filtered}
            onViewAll={() => setView('lista')}
          />
        )}

        {view === 'lista' && (
          <ListView
            filtered={filtered}
            onCycleStatus={cycleStatus}
            onEdit={openEdit}
            onDelete={deleteExpense}
          />
        )}
      </main>

      {showForm && (
        <ExpenseFormModal
          form={form}
          editingId={editingId}
          onFormChange={setForm}
          onSave={saveExpense}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
