import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([
    {
      id: uuidv4(),
      title: 'Groceries',
      amount: 45.75,
      date: '2025-04-15'
    },
    {
      id: uuidv4(),
      title: 'Gas',
      amount: 30.00,
      date: '2025-04-16'
    },
    {
      id: uuidv4(),
      title: 'Restaurant',
      amount: 65.20,
      date: '2025-04-18'
    }
  ])

  const addExpense = (expense) => {
    const newExpense = {
      id: uuidv4(),
      ...expense
    }
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const [filter, setFilter] = useState('')

  const filteredExpenses = filter
    ? expenses.filter(expense => expense.title.toLowerCase().includes(filter.toLowerCase()))
    : expenses

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Expense Tracker</h1>
      <ExpenseForm />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <ExpenseList expenses={filteredExpenses} onDeleteExpense={deleteExpense} />
    </div>
  )
}

export default App