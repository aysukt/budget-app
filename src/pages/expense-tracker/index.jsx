import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAddTransaction } from '../../hooks/useAddTransaction.js';
import { useGetTransaction } from '../../hooks/useGetTransaction.js';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";
import { auth } from '../../config/firebase-config.js';


export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transaction, transactionTotals } = useGetTransaction();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState('expense');
  const { balance, income, expenses } = transactionTotals;

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Oturum kapatma sırasında bir hata oluştu", error.message);
    }
  };

  return (
    <>
    <div className="expense-tracker">
      <div className="container">
        <h1>My Expense Tracker</h1>
        <div className="balance">
          <h3>Bakiyeniz</h3>
          {balance >= 0 ? <h2> ${balance}</h2> : <h2> -${balance * -1}</h2>}
        </div>
        <div className="summary">
          <div className="income">
            <h4>Gelir</h4>
            <p>${income}</p>
          </div>
          <div className="expenses">
            <h4>Giderler</h4>
            <p>${expenses}</p>
          </div>
        </div>
        <form className="add-transaction" onSubmit={onSubmit}>
          <input
            type='text'
            placeholder="Açıklama"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type='number'
            placeholder="Tutar"
            required
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          />
          <div className="transaction-type">
            <input
              type='radio'
              id="expense"
              value="expense"
              required
              checked={transactionType === 'expense'}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="expense"> Gider </label>
            <input
              type='radio'
              id="income"
              value="income"
              required
              checked={transactionType === 'income'}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="income"> Gelir </label>
          </div>
          <button type="submit"> İşlem Ekle</button>
        </form>
      </div>
      <button onClick={signUserOut}>Çıkış Yap</button>

      <div className="transaction">
        <h3> İşlemler</h3>
        <table>
          <thead>
            <tr>
              <th>Açıklama</th>
              <th>Tutar</th>
              <th>Tür</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>${transaction.transactionAmount}</td>
                <td>
                  <span
                    style={{
                      color: transaction.transactionType === "expense" ? "red" : "green",
                    }}
                  >
                    {transaction.transactionType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};
