import React from 'react';

interface ExpenseTableHeaderProps {
  editMode: boolean;
}

export const ExpenseTableHeader: React.FC<ExpenseTableHeaderProps> = ({ editMode }) => (
  <thead className="bg-muted">
    <tr>
      <th className="px-4 py-2 text-left">Category</th>
      <th className="px-4 py-2 text-left">Amount</th>
      <th className="px-4 py-2 text-left">Date</th>
      {editMode && <th className="px-4 py-2"></th>}
    </tr>
  </thead>
);