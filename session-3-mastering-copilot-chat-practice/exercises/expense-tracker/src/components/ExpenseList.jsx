import ExpenseItem from './ExpenseItem'

function ExpenseList({ expenses, onDeleteExpense }) {
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Expenses</h2>

            {sortedExpenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No expenses found. Add some!</p>
            ) : (
                <div className="space-y-4">
                    {sortedExpenses.map((expense) => (
                        <ExpenseItem
                            key={expense.id}
                            expense={expense}
                            onDelete={onDeleteExpense}
                        />
                    ))}

                    <div className="pt-4 border-t border-gray-200">
                        <p className="font-medium text-gray-700">
                            Total: ${sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}



export default ExpenseList