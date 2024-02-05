import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase-config.js';
import { useGetUserInfo } from './useGetUserInfo.js';

export const useGetTransaction = () => {
  const [transaction, setTransaction] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });
  const transactionCollectionRef = collection(db, 'transactions'); // Koleksiyon adınızın doğru olduğundan emin olun
  const { userID } = useGetUserInfo();
  

  useEffect(() => {
    
    
    const getTransaction = async () => {
      let unsubscribe;
      try {
        const queryTransactions = query(
          transactionCollectionRef,
          where('userID', '==', userID),
          orderBy('createdAt')
        );

unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
    const docs = [];
    let totalIncome = 0;
    let totalExpenses = 0;
  
    snapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
  
      docs.push({ ...data, id });
      if (data.transactionType === "expense") {
        totalExpenses += Number(data.transactionAmount);
      } else {
        totalIncome += Number(data.transactionAmount);
      }
    });
  
    let balance = totalIncome - totalExpenses;
    setTransactionTotals({
      balance,
      expenses: totalExpenses,
      income: totalIncome,
    });
  
    // Mevcut state'i güncellemeden önce yeni bir diziyi eski değerlerle birleştir
    setTransaction((prevTransactions) => [...prevTransactions, ...docs]);
  });
  
      } catch (err) {
        console.error(err);
      }
      return () => unsubscribe();
    };

    getTransaction();
  }, [userID, transactionCollectionRef]);

  return { transaction, transactionTotals };
};
